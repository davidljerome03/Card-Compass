import { NextRequest, NextResponse } from "next/server";

// This endpoint fetches user's credit cards
export async function GET(request: NextRequest) {
  try {
    // Check if we have an access token from the request
    const accessToken = request.headers.get("x-plaid-access-token");
    
    if (accessToken) {
      // Fetch cards from Plaid
      const response = await fetch(`${request.nextUrl.origin}/api/plaid/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    }

    // If no access token or Plaid fetch failed, return mock data
    return NextResponse.json({
      cards: [
        {
          id: "1",
          name: "Capital One Venture Rewards",
          last4: "1234",
          type: "Visa",
          rewards: {
            categories: ["Travel", "Dining"],
            rate: 2,
            description: "2x miles on all purchases",
          },
        },
        {
          id: "2",
          name: "Capital One Savor",
          last4: "5678",
          type: "Mastercard",
          rewards: {
            categories: ["Dining", "Entertainment", "Groceries"],
            rate: 4,
            description: "4% cash back on dining and entertainment",
          },
        },
        {
          id: "3",
          name: "Capital One Quicksilver",
          last4: "9012",
          type: "Visa",
          rewards: {
            categories: ["All"],
            rate: 1.5,
            description: "1.5% cash back on all purchases",
          },
        },
        {
          id: "4",
          name: "Capital One Spark Cash",
          last4: "3456",
          type: "Mastercard",
          rewards: {
            categories: ["All"],
            rate: 2,
            description: "2% cash back on all purchases",
          },
        },
        {
          id: "5",
          name: "Capital One Venture X",
          last4: "7890",
          type: "Visa",
          rewards: {
            categories: ["Travel", "Dining"],
            rate: 2,
            description: "2x miles on all purchases, 5x on flights",
          },
        },
        {
          id: "6",
          name: "Capital One SavorOne",
          last4: "2345",
          type: "Mastercard",
          rewards: {
            categories: ["Dining", "Groceries", "Entertainment"],
            rate: 3,
            description: "3% cash back on dining, groceries, and entertainment",
          },
        },
      ],
    });
  } catch (error) {
    console.error("Fetch cards error:", error);
    // Return mock data on error
    return NextResponse.json({
      cards: [
        {
          id: "1",
          name: "Capital One Venture Rewards",
          last4: "1234",
          type: "Visa",
          rewards: {
            categories: ["Travel", "Dining"],
            rate: 2,
            description: "2x miles on all purchases",
          },
        },
      ],
    });
  }
}
