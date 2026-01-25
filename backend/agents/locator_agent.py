import asyncio
from backend.tools.mcp_map_tool import GoogleMapsMCPTool

class LocatorAgent:
    def __init__(self):
        # Initialize the Tool (The "Hardware")
        self.map_tool = GoogleMapsMCPTool()

    async def get_location_context(self, lat: float, lng: float):
        """
        Orchestrates the lookup: Tool Call -> Parse -> Classify.
        """
        # 1. Ask the Tool for raw data
        # We use a 75m radius to account for GPS drift
        results = await self.map_tool.search_nearby(lat, lng, radius=75)

        if not results:
            return self._create_fallback_response(lat, lng)

        # 2. Agent Reasoning: Pick the best result
        # The API returns results ranked by prominence. We take the top one.
        best_match = results[0]
        
        # 3. Hybrid Parsing (Handles Legacy vs New API formats)
        if "displayName" in best_match:
            # New API Format
            place_name = best_match.get("displayName", {}).get("text", "Unknown Store")
            raw_type = best_match.get("primaryType", "unknown")
        else:
            # Legacy API Format
            place_name = best_match.get("name", "Unknown Store")
            types_list = best_match.get("types", [])
            raw_type = types_list[0] if types_list else "unknown"

        # 4. Classify the Business
        category = self._map_to_card_category(raw_type)

        return {
            "status": "success",
            "name": place_name,
            "raw_type": raw_type,
            "card_category": category, 
            "is_spending_location": category != "OTHER"
        }

    def _map_to_card_category(self, google_type):
        """
        Translates Google Maps types into Credit Card Reward Categories.
        """
        type_map = {
            # Dining
            "chinese_restaurant": "DINING", "mexican_restaurant": "DINING",
            "fast_food_restaurant": "DINING", "coffee_shop": "DINING",
            "restaurant": "DINING", "bar": "DINING", "cafe": "DINING",
            "meal_takeaway": "DINING",
            
            # Grocery
            "supermarket": "GROCERY", "grocery_store": "GROCERY",
            "bakery": "GROCERY", "liquor_store": "GROCERY",
            
            # Gas / Travel
            "gas_station": "GAS", "convenience_store": "GAS",
            "airport": "TRAVEL", "hotel": "TRAVEL", "lodging": "TRAVEL",
            "car_rental": "TRAVEL",
            
            # Retail / Drugstore
            "clothing_store": "RETAIL", "department_store": "RETAIL",
            "electronics_store": "RETAIL", "shopping_mall": "RETAIL",
            "drugstore": "DRUGSTORE", "pharmacy": "DRUGSTORE"
        }
        
        return type_map.get(google_type, "OTHER")

    def _create_fallback_response(self, lat, lng):
        return {
            "status": "unknown",
            "name": "Unknown Location",
            "card_category": "OTHER",
            "is_spending_location": False
        }