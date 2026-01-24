"use client";

import { useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkProps {
  onSuccess: (publicToken: string) => void;
  onExit?: () => void;
}

export default function PlaidLink({ onSuccess, onExit }: PlaidLinkProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const createLinkToken = async () => {
      try {
        const response = await fetch("/api/plaid/link", {
          method: "POST",
        });
        const data = await response.json();
        setLinkToken(data.link_token);
      } catch (error) {
        console.error("Error creating link token:", error);
      } finally {
        setLoading(false);
      }
    };

    createLinkToken();
  }, []);

  const { open, ready } = usePlaidLink(
    linkToken
      ? {
          token: linkToken,
          onSuccess: async (publicToken: string) => {
            try {
              // Exchange public token for access token
              const response = await fetch("/api/plaid/exchange", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ publicToken }),
              });

              if (response.ok) {
                const data = await response.json();
                // Store access token in localStorage for fetching cards later
                if (data.access_token) {
                  localStorage.setItem("plaid_access_token", data.access_token);
                }
                onSuccess(publicToken);
              }
            } catch (error) {
              console.error("Error exchanging token:", error);
            }
          },
          onExit: onExit,
        }
      : { token: null, onSuccess: () => {}, onExit: onExit }
  );

  if (loading) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  if (!linkToken) {
    return (
      <button
        disabled
        className="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed"
      >
        Unable to connect
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      disabled={!ready}
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      Connect Bank Account
    </button>
  );
}
