import os
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class GoogleMapsMCPTool:
    def __init__(self):
        api_key = os.getenv("GOOGLE_MAPS_API_KEY")
        if not api_key:
            print("⚠️ WARNING: GOOGLE_MAPS_API_KEY not found. Maps features will fail.")
            self.server_params = None
        else:
            self.server_params = StdioServerParameters(
                command="npx",
                args=["-y", "@modelcontextprotocol/server-google-maps"],
                env=os.environ.copy()
            )
            print(f"DEBUG: Configured Maps MCP with Key: {api_key[:10]}...")

    # FIX: added 'query' parameter back to signature
    async def search_nearby(self, lat: float, lng: float, radius: int = 500, query: str = None):
        """
        Connects to the server, runs the search, and returns the RAW list of results.
        """
        if not self.server_params:
            print("⚠️ Skipping Maps Search: No Configuration.")
            return []

        # Default fallback if no query provided
        search_query = query if query else "restaurant, food, grocery, store"

        print(f"DEBUG: MCP Tool search_nearby called with Lat: {lat}, Lng: {lng}, Query: '{search_query}'")

        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                args = {
                    "query": search_query, 
                    "location": {
                        "latitude": lat,
                        "longitude": lng
                    },
                    "radius": radius,
                    "language": "en"
                }

                try:
                    result = await session.call_tool("maps_search_places", arguments=args)
                except Exception as e:
                    print(f"⚠️ 'maps_search_places' failed with args {args}. Error: {e}")
                    return []

                # Robust Parsing
                try:
                    response_text = result.content[0].text
                    
                    if "failed" in response_text.lower() or "invalid" in response_text.lower():
                        print(f"⚠️ Tool Error: {response_text}")
                        return []

                    data = json.loads(response_text)
                    results = data.get("results", []) or data.get("places", []) or data.get("candidates", [])
                    return results

                except (json.JSONDecodeError, IndexError, AttributeError) as e:
                    print(f"❌ Failed to parse JSON from search_nearby. Error: {e}")
                    return []

    async def reverse_geocode(self, lat: float, lng: float):
        if not self.server_params: return []
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                args = {"latitude": lat, "longitude": lng}
                try:
                    result = await session.call_tool("maps_reverse_geocode", arguments=args)
                    if not result.content: return []
                    data = json.loads(result.content[0].text)
                    results = data.get("results", [])
                    if not results and "formatted_address" in data: results = [data]
                    return results
                except: return []