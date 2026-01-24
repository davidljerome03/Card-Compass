"use client";

import { useEffect, useState } from "react";
import { Recommendation, Location } from "../types";

interface CardRecommendationProps {
  location: Location | null;
}

export default function CardRecommendation({ location }: CardRecommendationProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setRecommendation(null);
      return;
    }

    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/recommendation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(location),
        });

        const data = await response.json();
        setRecommendation(data.recommendation);
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to avoid too many requests
    const timeoutId = setTimeout(fetchRecommendation, 1000);
    return () => clearTimeout(timeoutId);
  }, [location]);

  if (!location) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>Enable location services to get card recommendations</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">
        <p>No recommendation available at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Recommended Card</h3>
          <p className="text-2xl font-bold">{recommendation.cardName}</p>
        </div>
        <div className="bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
          {Math.round(recommendation.confidence * 100)}% match
        </div>
      </div>

      <p className="text-indigo-100 mb-4">{recommendation.reason}</p>

      {recommendation.rewards && (
        <div className="bg-white/10 rounded-lg p-4 mt-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-indigo-200">
                {recommendation.rewards.category || "Rewards"}
              </p>
              <p className="text-2xl font-bold">
                {recommendation.rewards.rate}%
              </p>
            </div>
            {recommendation.rewards.estimatedRewards && (
              <div className="text-right">
                <p className="text-sm text-indigo-200">Estimated Rewards</p>
                <p className="text-2xl font-bold">
                  ${recommendation.rewards.estimatedRewards.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
