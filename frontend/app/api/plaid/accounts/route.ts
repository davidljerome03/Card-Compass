import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, AccountsGetRequest } from "plaid";

// Initialize Plaid client
const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID || "697517f6177841001ed38ced",
      "PLAID-SECRET": process.env.PLAID_SECRET || "f2f2a8b8f139b3f3a2a78789b1f73b",
    },
  },
});

const plaidClient = new PlaidApi(configuration);

// This endpoint fetches accounts (credit cards) from Plaid
export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    if (!accessToken) {
      return NextResponse.json(
        { error: "accessToken is required" },
        { status: 400 }
      );
    }

    // Fetch accounts from Plaid
    const accountsResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    // Filter for credit cards only (Capital One)
    const creditCards = accountsResponse.data.accounts
      .filter((account) => {
        // Filter for credit cards - Capital One cards
        const isCreditCard = account.type === "credit" || account.subtype === "credit card";
        const isCapitalOne = account.name?.toLowerCase().includes("capital one") ||
                           account.mask?.startsWith("4") || // Visa cards often start with 4
                           account.mask?.startsWith("5"); // Mastercard often starts with 5
        
        return isCreditCard;
      })
      .map((account) => ({
        id: account.account_id,
        name: account.name || "Capital One Card",
        last4: account.mask || "0000",
        type: account.type === "credit" ? "Credit Card" : account.subtype || "Card",
        rewards: {
          // Default rewards - you can enhance this with actual card data
          categories: ["All"],
          rate: 1.5,
          description: "Capital One rewards card",
        },
      }));

    return NextResponse.json({
      cards: creditCards,
    });
  } catch (error: any) {
    console.error("Plaid accounts error:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts", details: error.message },
      { status: 500 }
    );
  }
}
