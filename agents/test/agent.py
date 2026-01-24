from google.adk.agents.llm_agent import Agent

root_agent = Agent(
    model='gemini-2.5-flash',
    name='root_agent',
    description='A helpful assistant to find what is located at gps coordinates.',
    instruction='User MCP tools to find the building at a location',
)
