class Orchestrator:
    def __init__(self):
        self.current_state = "MOVING"
        self.last_stationary_loc = None

    async def process_ping(self, lat, lng):
        if self.is_stationary(lat, lng):
            # Trigger the sub-agent chain
            business_info = await locator_agent.identify(lat, lng)
            
            if business_info['spend_category'] != "NON-SPENDING":
                best_card = await card_picker_agent.get_best_card(
                    business_info['category']
                )
                self.notify_user(best_card, business_info['name'])