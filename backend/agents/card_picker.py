import json
import os
from backend.tools.plaid_tool import PlaidWalletTool

class CardPickerAgent:
    def __init__(self):
        # Initialize the Tool
        self.plaid_tool = PlaidWalletTool()
        
        # Load the Knowledge Base (Rewards Rules)
        db_path = os.path.join(os.path.dirname(__file__), '../data/rewards_db.json')
        try:
            with open(db_path, 'r') as f:
                self.rewards_db = json.load(f)
        except FileNotFoundError:
            print("⚠️ Rewards DB not found. Agent is flying blind.")
            self.rewards_db = {}

    def get_best_card(self, access_token, category):
        """
        1. Tool: Fetch real cards.
        2. Logic: Match to DB -> Calc Max Multiplier.
        """
        # 1. Ask Tool for the user's wallet
        card_names = self.plaid_tool.fetch_credit_cards(access_token)
        
        if not card_names:
            return {"recommended_card": "Debit Card", "reason": "No credit cards found."}

        # 2. Match Bank Names to Internal DB Keys
        user_wallet = []
        for name in card_names:
            db_key = self._match_card_to_db(name)
            if db_key:
                user_wallet.append(db_key)

        if not user_wallet:
            return {
                "recommended_card": "Debit Card", 
                "reason": f"Cards found ({len(card_names)}) but none matched our rewards database."
            }

        # 3. Optimization Logic: Find the highest multiplier
        best_card = None
        highest_multiplier = -1.0
        
        for key in user_wallet:
            card_data = self.rewards_db.get(key)
            if not card_data: continue
            
            # Get multiplier for this category, or fall back to "OTHER"
            multiplier = card_data["rewards"].get(category, card_data["rewards"].get("OTHER", 1.0))
            
            if multiplier > highest_multiplier:
                highest_multiplier = multiplier
                best_card = card_data

        return {
            "recommended_card": best_card["name"],
            "multiplier": highest_multiplier,
            "reason": f"Earns {highest_multiplier}x points on {category}"
        }

    def _match_card_to_db(self, plaid_name):
        """
        Fuzzy Matcher: Maps Bank Strings -> JSON Keys
        """
        n = plaid_name.lower()
        
        # Capital One Matches (Specific to your wallet)
        if "capital one" in n:
            if "savor" in n: return "capital_one_savor_one"
            if "venture x" in n: return "capital_one_venture_x"
            if "venture" in n: return "capital_one_venture"
            if "quicksilver" in n: return "capital_one_quicksilver"
            if "platinum" in n: return "capital_one_platinum"

        # Common Chase Matches
        if "sapphire preferred" in n: return "chase_sapphire_preferred"
        if "sapphire reserve" in n: return "chase_sapphire_reserve"
        if "freedom unlimited" in n: return "chase_freedom_unlimited"
        
        # Common Amex Matches
        if "american express" in n or "amex" in n:
            if "gold" in n: return "amex_gold"
            if "platinum" in n: return "amex_platinum"
            
        return None