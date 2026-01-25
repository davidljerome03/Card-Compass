import os
import plaid
from plaid.api import plaid_api
from plaid.model.accounts_get_request import AccountsGetRequest

class PlaidWalletTool:
    def __init__(self):
        # 1. Configure the Client (The Plumbing)
        configuration = plaid.Configuration(
            host=plaid.Environment.Sandbox, # Switch to Development for prod
            api_key={
                'clientId': os.getenv('PLAID_CLIENT_ID'),
                'secret': os.getenv('PLAID_SECRET'),
            }
        )
        api_client = plaid.ApiClient(configuration)
        self.client = plaid_api.PlaidApi(api_client)

    def fetch_credit_cards(self, access_token):
        """
        Returns a clean list of credit card names, filtering out checking/savings.
        """
        try:
            request = AccountsGetRequest(access_token=access_token)
            response = self.client.accounts_get(request)
            
            # Filter logic moved here
            cards = []
            for acc in response['accounts']:
                if str(acc.type) == "credit":
                    # Prefer the user-friendly name (e.g. 'Capital One Venture') over official_name
                    # because official_name is often generic in Sandbox (e.g. 'Plaid Credit Card')
                    cards.append(acc.name or acc.official_name)
            return cards

        except plaid.ApiException as e:
            print(f"Plaid Tool Error: {e}")
            return []