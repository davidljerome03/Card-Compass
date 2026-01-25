import asyncio
import os
import sys

# Try to load .env
try:
    from dotenv import load_dotenv
    load_dotenv() # Root .env
    
    # Also load agents .env
    agents_env = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'backend', 'agents', '.env')
    if os.path.exists(agents_env):
        load_dotenv(agents_env)
        print(f"Loaded agents env from {agents_env}")
    else:
        print(f"Warning: agents env not found at {agents_env}")

    print("Loaded .env file(s)")
except ImportError:
    print("python-dotenv not installed, assuming env vars are set.")

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.tools.mcp_maps_tools import GoogleMapsMCPTool

async def test():
    print("Initialize Map Tool...")
    tool = GoogleMapsMCPTool()
    
    # Coordinates for a known location (e.g., a test coordinate)
    # Using a generic coordinate for now, user can edit this
    lat, lng = 26.712, -80.054  # Example West Palm Beach coord

    print(f"\nTesting with Lat: {lat}, Lng: {lng}")

    print("\n--- Testing Reverse Geocode ---")
    try:
        res_rev = await tool.reverse_geocode(lat, lng)
        print(f"Found {len(res_rev)} results.")
        if res_rev:
            print(f"Top Result Address: {res_rev[0].get('formatted_address')}")
            print(f"Top Result Types: {res_rev[0].get('types')}")
    except Exception as e:
        print(f"Reverse Geo Failed: {e}")

    print("\n--- Testing Search Nearby ---")
    try:
        res_search = await tool.search_nearby(lat, lng, radius=50)
        print(f"Found {len(res_search)} results.")
        if res_search:
            print(f"Top Result Name: {res_search[0].get('name')}")
            print(f"Top Result Types: {res_search[0].get('types')}")
    except Exception as e:
        print(f"Search Nearby Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
