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
        self.dwell_start_time = None
        
        # Configuration
        self.DWELL_THRESHOLD_METERS = 30  # "Standing still" radius
        self.DWELL_TIME_SECONDS = 5       # Time before triggering logic

    async def perceive(self, user_context):
        """
        The main 'Brain' loop. 
        user_context needs: {'lat': float, 'lng': float, 'access_token': str}
        """
        lat, lng = user_context['lat'], user_context['lng']
        
        # 1. Evaluate State (Are we moving or stopping?)
        if self._has_moved_significantly(lat, lng):
            self._transition_to_moving(lat, lng)
            return None
        
        # 2. If we haven't moved, check how long we've been here
        if self.state == "MOVING" or self.state == "IDLE":
            self.state = "DWELLING"
            self.dwell_start_time = time.time()
            return None

        if self.state == "DWELLING":
            elapsed = time.time() - self.dwell_start_time
            print(f"   ⏳ Dwelling for {elapsed:.1f}s...")
            
            if elapsed > self.DWELL_TIME_SECONDS:
                # 3. Trigger the Action Plan
                self.state = "PROCESSING"
                return await self._execute_plan(user_context)

        return None

    async def _execute_plan(self, ctx):
        """
        Delegates tasks to sub-agents.
        """
        print("🤖 Orchestrator: User is stationary. Initiating Card Check Sequence.")
        
        # Step 1: Locator Agent (The Eyes)
        place_info = await self.locator.get_location_context(ctx['lat'], ctx['lng'])
        
        if not place_info['is_spending_location']:
            print(f"🤖 Orchestrator: {place_info['name']} is not a spending location. Resetting.")
            self.state = "IDLE" # Reset so we don't spam
            return None

        # Step 2: Card Picker Agent (The Brain)
        recommendation = self.picker.get_best_card(
            access_token=ctx['access_token'],
            category=place_info['card_category']
        )

        print(f"🤖 Orchestrator: Recommendation ready -> {recommendation['recommended_card']}")
        
        # Reset state so we don't trigger again until they move to a NEW spot
        self.state = "IDLE" 

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
        return (lat_diff > 0.0003) or (lng_diff > 0.0003)

    def _transition_to_moving(self, lat, lng):
        if self.state != "MOVING":
            print("🏃 User is moving...")
        self.state = "MOVING"
        self.last_coords = (lat, lng)
        self.dwell_start_time = None