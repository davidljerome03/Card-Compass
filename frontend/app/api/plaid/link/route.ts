import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments, CountryCode, Products } from "plaid";

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

// This endpoint creates a Plaid Link token
export async function POST(request: NextRequest) {
  try {
    const linkTokenResponse = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "bob123", // Using the logged-in user
      },
      client_name: "Card Compass",
      products: [Products.Auth, Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({
      link_token: linkTokenResponse.data.link_token,
    });
  } catch (error: any) {
    console.error("Plaid link token error:", error);
    return NextResponse.json(
      { error: "Failed to create Plaid link token", details: error.message },
      { status: 500 }
    );
  }
}
