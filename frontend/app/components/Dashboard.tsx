"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Location } from "../types";
import PlaidLink from "./PlaidLink";
import CreditCardList from "./CreditCardList";
import LocationTracker from "./LocationTracker";
import CardRecommendation from "./CardRecommendation";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [location, setLocation] = useState<Location | null>(null);
  const [cardsConnected, setCardsConnected] = useState(false);

  const handlePlaidSuccess = () => {
    setCardsConnected(true);
    // Refresh the page or reload cards
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img src="/logo.png" alt="Card Compass" className="h-10" />
              <h1 className="text-xl font-semibold text-gray-900">
                Card Compass
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {user?.username}
              </div>
              <button
                onClick={signOut}
                className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-100 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Location and Recommendation Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Current Location
              </h2>
              <LocationTracker onLocationUpdate={setLocation} />
            </div>
          </div>

          <CardRecommendation location={location} />
        </div>

        {/* Cards Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Credit Cards
            </h2>
            {!cardsConnected && (
              <PlaidLink onSuccess={handlePlaidSuccess} />
            )}
          </div>

          <CreditCardList />
        </div>
      </main>
    </div>
  );
}
