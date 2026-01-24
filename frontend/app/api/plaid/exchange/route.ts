import { NextRequest, NextResponse } from "next/server";
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

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

// This endpoint exchanges a Plaid public token for an access token
export async function POST(request: NextRequest) {
  try {
    const { publicToken } = await request.json();

    if (!publicToken) {
      return NextResponse.json(
        { error: "publicToken is required" },
        { status: 400 }
      );
    }

    // Exchange public token for access token
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    // Store access token (in production, store this in a database)
    // For now, we'll return it and the frontend can store it temporarily
    // TODO: Store access_token in database associated with user

    return NextResponse.json({
      access_token: accessToken,
      item_id: itemId,
      success: true,
    });
  } catch (error: any) {
    console.error("Plaid exchange token error:", error);
    return NextResponse.json(
      { error: "Failed to exchange Plaid token", details: error.message },
      { status: 500 }
    );
  }
}
