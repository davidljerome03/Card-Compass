import asyncio
import os
import sys

# Try to load .env
try:
    from dotenv import load_dotenv
    # Load root .env
    load_dotenv() 
    
    # Also load agents .env
    # Assuming we are running from project root
    agents_env = os.path.join('backend', 'agents', '.env')
    if os.path.exists(agents_env):
        load_dotenv(agents_env)
        print(f"Loaded agents env from {agents_env}")
except ImportError:
    print("python-dotenv not installed.")

# Add project root to path
sys.path.append(os.path.abspath(os.getcwd()))

from backend.agents.locator_agent import LocatorAgent

async def test():
    print("Initialize Locator Agent...")
    agent = LocatorAgent()
    
    # Coordinates from user's logs
    lat, lng = 29.63186983031408, -82.37884958371201

    print(f"\nTesting Agent with Lat: {lat}, Lng: {lng}")
    
    context = await agent.get_location_context(lat, lng)
    print("\n--- Agent Result ---")
    print(context)

if __name__ == "__main__":
    asyncio.run(test())
