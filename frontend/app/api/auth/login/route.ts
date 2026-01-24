import { NextRequest, NextResponse } from "next/server";

// This endpoint handles user login
// TODO: Connect to your backend authentication service
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Validate credentials - only accept bob123/bob123
    if (username !== "bob123" || password !== "bob123") {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Authentication successful
    const user = {
      username: username,
      email: `${username}@example.com`,
    };

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
