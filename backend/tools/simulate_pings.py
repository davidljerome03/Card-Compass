import asyncio
from backend.agents.orchestrator_agent import OrchestratorAgent

# Your REAL Sandbox Access Token (from your Frontend)
ACCESS_TOKEN = "access-sandbox-YOUR-TOKEN-HERE"

async def run_simulation():
    agent_team = OrchestratorAgent()
    
    # 1. Simulate Walking (Moving)
    print("--- 🚶 User Walking ---")
    await agent_team.perceive({'lat': 28.6010, 'lng': -81.2005, 'access_token': ACCESS_TOKEN})
    await asyncio.sleep(1)
    
    # 2. Simulate Arrival (Stopped at Panda Express)
    print("\n--- 🛑 User Arrived ---")
    await agent_team.perceive({'lat': 28.6024, 'lng': -81.2001, 'access_token': ACCESS_TOKEN})
    
    # 3. Simulate Dwelling (Wait for 6 seconds to trigger threshold)
    print("\n--- ⏳ User Waiting (Dwelling) ---")
    for _ in range(6):
        await asyncio.sleep(1)
        result = await agent_team.perceive({'lat': 28.6024, 'lng': -81.2001, 'access_token': ACCESS_TOKEN})
        
        if result:
            print("\n🎉 AGENT TRIGGERED!")
            print(f"📍 Location: {result['place']['name']}")
            print(f"💳 Use: {result['card']['recommended_card']}")
            print(f"💡 Why: {result['card']['reason']}")
            break

if __name__ == "__main__":
    asyncio.run(run_simulation())