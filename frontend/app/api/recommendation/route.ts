import { NextRequest, NextResponse } from "next/server";

// This endpoint gets card recommendation based on location
export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, address } = await request.json();

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "Location coordinates are required" },
        { status: 400 }
      );
    }

    // TODO: Replace with your actual backend endpoint that calls the orchestrator
    const response = await fetch(`${process.env.BACKEND_URL || "http://localhost:8000"}/api/recommendation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        location: { latitude, longitude, address },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get recommendation");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Recommendation error:", error);
    // Return mock recommendation for development
    return NextResponse.json({
      recommendation: {
        cardId: "2",
        cardName: "Capital One Savor",
        reason: "This location is a restaurant. The Savor card offers 4% cash back on dining.",
        confidence: 0.95,
        rewards: {
          category: "Dining",
          rate: 4,
          estimatedRewards: 4.0,
        },
      },
    });
  }
}
