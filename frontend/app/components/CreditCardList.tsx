"use client";

import { useEffect, useState } from "react";
import { CreditCard } from "../types";

export default function CreditCardList() {
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        // Get access token from localStorage if available
        const accessToken = localStorage.getItem("plaid_access_token");
        
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };
        
        if (accessToken) {
          headers["x-plaid-access-token"] = accessToken;
        }

        const response = await fetch("/api/cards", {
          headers,
        });
        const data = await response.json();
        setCards(data.cards || []);
      } catch (error) {
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No credit cards found. Connect your bank account to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {card.name}
              </h3>
              <p className="text-sm text-gray-500">**** {card.last4}</p>
            </div>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              {card.type}
            </span>
          </div>
          {card.rewards && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-2">
                {card.rewards.description}
              </p>
              {card.rewards.categories && (
                <div className="flex flex-wrap gap-2">
                  {card.rewards.categories.map((category, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
