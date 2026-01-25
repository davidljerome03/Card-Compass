import json
import os

class CardPickerAgent:
    def __init__(self):
        # Load the rewards database
        # Ensure the path is correct relative to where you run the script
        db_path = os.path.join(os.path.dirname(__file__), '../data/rewards_db.json')
        try:
            with open(db_path, 'r') as f:
                self.rewards_db = json.load(f)
        except FileNotFoundError:
            print(f"⚠️ Error: Could not find rewards_db.json at {db_path}")
            self.rewards_db = {}

    def get_best_card(self, category):
        """
        1. Fetches user's wallet (Mocked Plaid Data).
        2. Compares rewards for the given category.
        3. Returns the winner.
        """
        
        # --- 1. SIMULATE PLAID FETCH ---
        # In a real app, you would call: client.liabilities_get(access_token)
        # Here, we pretend the user has linked these three cards:
        user_wallet = [
            "chase_sapphire_preferred", 
            "wells_fargo_active_cash",
            "amex_gold" # Try removing this one later to see the recommendation change!
        ]
        
        print(f"💳 Analyzing {len(user_wallet)} cards for category: {category}...")

        best_card = None
        highest_multiplier = -1.0
        
        # --- 2. THE OPTIMIZATION LOGIC ---
        for card_id in user_wallet:
            # Look up card details in our DB
            card_data = self.rewards_db.get(card_id)
            
            if not card_data:
                continue # Skip cards we don't recognize
            
            # Get the multiplier for this category (default to 1.0 if not listed)
            multiplier = card_data["rewards"].get(category, 1.0)
            
            print(f"   -> {card_data['name']}: {multiplier}x points")

            # Simple logic: Is this higher than what we found so far?
            if multiplier > highest_multiplier:
                highest_multiplier = multiplier
                best_card = card_data

        # --- 3. RETURN RESULT ---
        if best_card:
            return {
                "recommended_card": best_card["name"],
                "multiplier": highest_multiplier,
                "reason": f"Earns {highest_multiplier}x on {category}"
            }
        else:
            return {
                "recommended_card": "Debit Card",
                "multiplier": 0,
                "reason": "No applicable credit cards found."
            }

# --- TEST BLOCK ---
if __name__ == "__main__":
    # Simulate the Orchestrator calling this
    test_category = "DINING" # We got this from the Locator Agent!
    
    agent = CardPickerAgent()
    recommendation = agent.get_best_card(test_category)
    
    print("\n🏆 FINAL RECOMMENDATION:")
    print(json.dumps(recommendation, indent=2))