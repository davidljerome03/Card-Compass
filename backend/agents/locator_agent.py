import asyncio
import math
from backend.tools.mcp_maps_tools import GoogleMapsMCPTool

class LocatorAgent:
    def __init__(self):
        self.map_tool = GoogleMapsMCPTool()

    async def get_location_context(self, lat: float, lng: float):
        print(f"DEBUG: LocatorAgent.get_location_context received Lat: {lat}, Lng: {lng}")

        # --- STEP 1: Baseline Address ---
        fallback_address_obj = None
        try:
            geo_results = await self.map_tool.reverse_geocode(lat, lng)
            if geo_results:
                fallback_address_obj = geo_results[0]
                if "name" not in fallback_address_obj or not fallback_address_obj["name"]:
                     addr = fallback_address_obj.get("formatted_address", "").split(",")[0]
                     fallback_address_obj["name"] = addr
                print(f"DEBUG: Baseline Address found: {fallback_address_obj.get('name')}")
        except Exception:
            pass

        # --- STEP 2: SEQUENTIAL SEARCH (The Fix) ---
        # We search one by one to ensure we get a diverse mix of results.
        
        # 1. Search Restaurants (Highest priority)
        results_food = await self.map_tool.search_nearby(lat, lng, 500, "restaurant")
        
        # 2. Search Grocery 
        results_grocery = await self.map_tool.search_nearby(lat, lng, 500, "grocery store")
        
        # 3. Search Gas
        results_gas = await self.map_tool.search_nearby(lat, lng, 500, "gas station")

        # Combine them all
        raw_results = results_food + results_grocery + results_gas

        # Deduplicate (Wawa might be in both Gas and Grocery)
        seen_ids = set()
        unique_results = []
        for place in raw_results:
            pid = place.get("place_id")
            if pid and pid not in seen_ids:
                seen_ids.add(pid)
                unique_results.append(place)

        # --- STEP 3: Distance Filtering ---
        valid_results = []
        if unique_results:
            for place in unique_results:
                p_loc = place.get("geometry", {}).get("location") or place.get("location")
                if not p_loc: continue
                
                dist = self._calculate_distance(lat, lng, p_loc['lat'], p_loc['lng'])
                
                # Filter: Accept places within 300m
                if dist <= 300:
                    valid_results.append(place)

        # --- STEP 4: Select Best Match ---
        selected_place = None

        if not valid_results:
            if fallback_address_obj:
                print("DEBUG: No valid search results. Reverting to Baseline Address.")
                selected_place = fallback_address_obj
            else:
                return self._create_fallback_response(lat, lng)
        else:
            # Sort by distance (closest first)
            valid_results.sort(key=lambda p: self._calculate_distance(
                lat, lng, 
                p.get("geometry", {}).get("location", {}).get("lat", 0), 
                p.get("geometry", {}).get("location", {}).get("lng", 0)
            ))
            
            selected_place = fallback_address_obj if fallback_address_obj else valid_results[0]
            found_priority = False

            # TIER 1: FOOD & GROCERY (Combined / Equal Priority)
            # We want the CLOSEST food or grocery.
            food_types = {
                "grocery_or_supermarket", "supermarket", "liquor_store",
                "restaurant", "food", "meal_takeaway", "bar", "cafe", "bakery"
            }
            
            for place in valid_results:
                types = set(place.get("types", []))
                
                is_food = types.intersection(food_types)
                # CRITICAL: Block Gas Stations from this tier
                is_gas = "gas_station" in types or "convenience_store" in types
                
                if is_food and not is_gas:
                    selected_place = place
                    found_priority = True
                    print(f"DEBUG: 🏆 TIER 1 SNAP! Found Food/Grocery: {place.get('name')}")
                    break

            # TIER 2: GAS STATIONS
            if not found_priority:
                gas_types = {"gas_station", "convenience_store"}
                for place in valid_results:
                    types = set(place.get("types", []))
                    if types.intersection(gas_types):
                        selected_place = place
                        found_priority = True
                        print(f"DEBUG: 🥈 TIER 2 SNAP! Found Gas: {place.get('name')}")
                        break
            
            if not found_priority:
                print(f"DEBUG: No Spending Business matched. Keeping Baseline: {selected_place.get('name')}")

        return self._process_place_result(selected_place)

    def _calculate_distance(self, lat1, lng1, lat2, lng2):
        R = 6371000 
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lng2 - lng1)
        a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2) * math.sin(dlambda/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def _process_place_result(self, place):
        place_name = place.get("name")
        formatted_address = place.get("formatted_address", "")

        def is_valid_name(n):
            if not n: return False
            n_str = str(n).strip().lower()
            return n_str not in ["undefined", "unknown", "null", "none"]

        if not is_valid_name(place_name):
            if formatted_address:
                place_name = formatted_address.split(",")[0] 
            else:
                place_name = "Unknown Location"

        raw_type = "unknown"
        types = place.get("types", [])
        if types:
            raw_type = types[0]

        category = self._map_to_card_category(raw_type)
        
        non_spending_categories = {"OTHER", "ACADEMICS", "RESIDENTIAL", "RECREATION"}
        is_spending = category not in non_spending_categories

        if place_name == "Unknown Location":
            is_spending = False

        print(f"DEBUG: Final Location Decision: {place_name} ({category}) | Spending: {is_spending}")

        return {
            "status": "success",
            "name": place_name, 
            "raw_type": raw_type,
            "card_category": category, 
            "is_spending_location": is_spending
        }

    def _map_to_card_category(self, google_type):
        type_map = {
            "chinese_restaurant": "DINING", "mexican_restaurant": "DINING",
            "fast_food_restaurant": "DINING", "coffee_shop": "DINING",
            "restaurant": "DINING", "bar": "DINING", "cafe": "DINING",
            "meal_takeaway": "DINING", "bakery": "DINING",
            "supermarket": "GROCERY", "grocery_store": "GROCERY",
            "liquor_store": "GROCERY",
            "gas_station": "GAS", "convenience_store": "GAS",
            "airport": "TRAVEL", "hotel": "TRAVEL", "lodging": "TRAVEL",
            "car_rental": "TRAVEL", "transit_station": "TRAVEL",
            "clothing_store": "RETAIL", "department_store": "RETAIL",
            "electronics_store": "RETAIL", "shopping_mall": "RETAIL",
            "drugstore": "DRUGSTORE", "pharmacy": "DRUGSTORE",
            "home_goods_store": "RETAIL", "book_store": "RETAIL",
            "school": "ACADEMICS", "university": "ACADEMICS", 
            "premise": "RESIDENTIAL", "sublocality": "RESIDENTIAL", 
            "political": "RESIDENTIAL", "neighborhood": "RESIDENTIAL", 
            "street_address": "RESIDENTIAL", "route": "RESIDENTIAL",
            "park": "RECREATION", "gym": "RECREATION"
        }
        return type_map.get(google_type, "OTHER")
    
    def _create_fallback_response(self, lat, lng):
        return {"status": "unknown", "name": "Unknown Location", "card_category": "OTHER", "is_spending_location": False}