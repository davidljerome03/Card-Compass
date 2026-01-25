import asyncio
import os
import json
from dotenv import load_dotenv
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# Load environment variables
load_dotenv()

class LocatorAgent:
    def __init__(self):
        # Check for key to prevent silent failures
        if not os.getenv("GOOGLE_MAPS_API_KEY"):
            raise ValueError("Missing GOOGLE_MAPS_API_KEY in .env file")

        self.server_params = StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-google-maps"],
            env=os.environ.copy()
        )

    async def get_location_context(self, lat: float, lng: float):
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                try:
                    places_result = await session.call_tool(
                        "maps_search_places",
                        arguments={
                            "location": f"{lat},{lng}",
                            "radius": 75,
                            # "openNow": True  <-- Optional: helps filter closed shops
                        }
                    )
                except Exception as e:
                    print(f"MCP Tool Error: {e}")
                    return self._create_fallback_response(lat, lng)

                try:
                    # 1. Decode the JSON
                    data = json.loads(places_result.content[0].text)
                    
                    # 2. Extract the list of places
                    # The Legacy API usually returns 'results', the New API returns 'places'
                    results = data.get("results", []) or data.get("places", [])

                    if not results:
                        print("⚠️ Debug: API returned zero results.")
                        return self._create_fallback_response(lat, lng)

                    # 3. Get the first match
                    best_match = results[0]
                    
                    # --- THE FIX: Handle Legacy Format ---
                    # Legacy uses 'name'. New uses 'displayName.text'.
                    if "name" in best_match:
                         place_name = best_match["name"]
                    else:
                         place_name = best_match.get("displayName", {}).get("text", "Unknown Store")

                    # Legacy uses 'types' (list). New uses 'primaryType' (string).
                    if "types" in best_match:
                        # e.g. ["restaurant", "food", "point_of_interest"]
                        raw_type = best_match["types"][0] 
                    else:
                        raw_type = best_match.get("primaryType", "unknown")

                    # 4. Map to Category
                    category = self._map_to_card_category(raw_type)

                    return {
                        "status": "success",
                        "name": place_name,
                        "raw_type": raw_type,
                        "card_category": category, 
                        "is_spending_location": category != "OTHER"
                    }

                except Exception as e:
                    print(f"Error parsing Maps data: {e}")
                    return self._create_fallback_response(lat, lng)
                    
    def _map_to_card_category(self, google_type):
        """
        Maps specific Google types to broad Credit Card categories.
        """
        # Dictionary mapping
        type_map = {
            "chinese_restaurant": "DINING",
            "mexican_restaurant": "DINING",
            "fast_food_restaurant": "DINING",
            "coffee_shop": "DINING",
            "restaurant": "DINING",
            "bar": "DINING",
            "supermarket": "GROCERY",
            "grocery_store": "GROCERY",
            "convenience_store": "GAS", # Often code as gas if attached to a station
            "gas_station": "GAS",
            "clothing_store": "RETAIL",
            "department_store": "RETAIL",
            "electronics_store": "RETAIL",
            "drugstore": "DRUGSTORE",
            "pharmacy": "DRUGSTORE"
        }
        
        return type_map.get(google_type, "OTHER")

    def _create_fallback_response(self, lat, lng):
        return {
            "status": "unknown",
            "name": "Unknown Location",
            "card_category": "OTHER",
            "is_spending_location": False
        }

# --- Test Block ---
if __name__ == "__main__":
    TEST_LAT = 28.6024
    TEST_LNG = -81.2001
    async def main():
        print(f"Testing Locator Agent at {TEST_LAT}, {TEST_LNG}...")
        agent = LocatorAgent()
        result = await agent.get_location_context(TEST_LAT, TEST_LNG)
        print(json.dumps(result, indent=2))
    asyncio.run(main())