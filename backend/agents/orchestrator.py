import asyncio
import time
from backend.agents.locator_agent import LocatorAgent
from backend.agents.card_picker import CardPickerAgent

class OrchestratorAgent:
    def __init__(self):
        # Sub-Agents
        self.locator = LocatorAgent()
        self.picker = CardPickerAgent()
        
        # Agent Memory / State
        self.state = "IDLE"  # Options: IDLE, DWELLING, PROCESSING
        self.last_coords = None
        self.dwell_poll_count = 0
        
        # Configuration
        self.DWELL_THRESHOLD_METERS = 30  # "Standing still" radius
        self.DWELL_TIME_SECONDS = 2       # Time before triggering logic

    async def perceive(self, user_context):
        """
        The main 'Brain' loop. 
        user_context needs: {'lat': float, 'lng': float, 'access_token': str}
        """
        lat, lng = user_context['lat'], user_context['lng']
        print(f"DEBUG: Perceive called with Lat: {lat}, Lng: {lng}, State: {self.state}")
        
        # 1. Evaluate State (Are we moving or stopping?)
        if self._has_moved_significantly(lat, lng):
            self._transition_to_moving(lat, lng)
            return None
        
        # 2. If we haven't moved, check how long we've been here
        if self.state == "MOVING" or self.state == "IDLE":
            self.state = "DWELLING"
            self.dwell_poll_count = 0
            self.dwell_start_time = time.time()
            return None

        if self.state == "DWELLING":
            # Count the polls (approx 1 poll per 2s throttled from frontend)
            self.dwell_poll_count += 1
            elapsed = time.time() - (self.dwell_start_time or time.time())
            
            print(f"   ⏳ Dwelling... Poll {self.dwell_poll_count}/2 (Elapsed: {elapsed:.1f}s)")
            
            # Trigger if 2 polls confirm dwelling OR if we've been sitting here > 30s
            if self.dwell_poll_count >= 2 or elapsed > 30:
                # 3. Trigger the Action Plan
                self.state = "PROCESSING"
                return await self._execute_plan(user_context)

        return None

    async def _execute_plan(self, ctx):
        """
        Delegates tasks to sub-agents.
        """
        print("🤖 Orchestrator: User is stationary (Polls/Timeout confirmed). Initiating Card Check Sequence.")
        
        # Step 1: Locator Agent (The Eyes)
        place_info = await self.locator.get_location_context(ctx['lat'], ctx['lng'])
        
        if not place_info['is_spending_location']:
            print(f"🤖 Orchestrator: {place_info['name']} is not a spending location. Sending notification.")
            
            # Custom message based on category
            cat = place_info.get('card_category', 'OTHER')
            place_name = place_info.get('name', 'This address')
            
            # Default message using the dynamic address
            msg = f'{place_name} is not available for rewards'
            
            if cat == "ACADEMICS": msg = "Academics"
            if cat == "UNDEFINED": msg = "Unknown Location"
            
            place_info['custom_message'] = msg
            
            self.state = "IDLE" 
            return {
                "type": "NO_REWARD_LOCATION",
                "place": place_info
            }

        # Step 2: Card Picker Agent (The Brain)
        recommendation = self.picker.get_best_card(
            access_token=ctx['access_token'],
            category=place_info['card_category']
        )

        print(f"🤖 Orchestrator: Recommendation ready -> {recommendation['recommended_card']}")
        
        # Reset state so we don't trigger again until they move to a NEW spot
        self.state = "IDLE" 
        self.dwell_poll_count = 0 

        return {
            "type": "RECOMMENDATION_EVENT",
            "place": place_info,
            "card": recommendation
        }

    def _has_moved_significantly(self, lat, lng):
        if not self.last_coords: return True
        lat_diff = abs(lat - self.last_coords[0])
        lng_diff = abs(lng - self.last_coords[1])
        # Rough approximation: 0.0003 deg is approx 30 meters
        moved = (lat_diff > 0.0003) or (lng_diff > 0.0003)
        if moved:
             print(f"DEBUG: Movement detected! Delta Lat: {lat_diff:.5f}, Delta Lng: {lng_diff:.5f}")
        return moved

    def _transition_to_moving(self, lat, lng):
        if self.state != "MOVING":
            print("🏃 User is moving...")
        self.state = "MOVING"
        self.last_coords = (lat, lng)
        self.dwell_poll_count = 0