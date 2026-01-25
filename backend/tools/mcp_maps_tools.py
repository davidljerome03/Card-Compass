import os
import json
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

class GoogleMapsMCPTool:
    def __init__(self):
        # 1. Define the Server Configuration (The Plumbing)
        if not os.getenv("GOOGLE_MAPS_API_KEY"):
            raise ValueError("Missing GOOGLE_MAPS_API_KEY")

        self.server_params = StdioServerParameters(
            command="npx",
            args=["-y", "@modelcontextprotocol/server-google-maps"],
            env=os.environ.copy()
        )

    async def search_nearby(self, lat, lng, radius=75):
        """
        Connects to the server, runs the search, and returns the RAW list of results.
        """
        async with stdio_client(self.server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()

                # Call the specific MCP function
                result = await session.call_tool(
                    "maps_search_places",
                    arguments={
                        "location": f"{lat},{lng}",
                        "radius": radius,
                        "rankBy": "prominence"
                    }
                )

                # Parse the inner JSON string so the Agent gets a clean Dict
                try:
                    data = json.loads(result.content[0].text)
                    return data.get("results", []) or data.get("places", [])
                except (json.JSONDecodeError, IndexError):
                    return []