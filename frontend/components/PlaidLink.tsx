'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink } from 'react-plaid-link';
import { Link as LinkIcon, AlertCircle } from 'lucide-react';
import styles from './DashboardComponents.module.css';

interface PlaidLinkProps {
    onLinkSuccess: () => void;
}

export default function PlaidLink({ onLinkSuccess }: PlaidLinkProps) {
    const [token, setToken] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createLinkToken = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/create_link_token', {
                    method: 'POST',
                });
                if (!response.ok) throw new Error("Backend Error");
                const data = await response.json();
                setToken(data.link_token);
            } catch (error) {
                console.error("Error creating link token:", error);
                setError("Connection Failed");
            }
        };
        createLinkToken();
    }, []);

    const onSuccess = useCallback(async (public_token: string) => {
        try {
            await fetch('http://localhost:8000/api/exchange_public_token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ public_token }),
            });
            // Notify parent to fetch new data
            console.log("Token exchanged successfully, refreshing cards...");
            await onLinkSuccess();
        } catch (error) {
            console.error("Error exchanging token:", error);
        }
    }, [onLinkSuccess]);

    const config: Parameters<typeof usePlaidLink>[0] = {
        token,
        onSuccess,
    };

    const { open, ready } = usePlaidLink(config);

    if (error) {
        return (
            <div className={styles.plaidStatus} style={{ color: '#f87171', borderColor: '#f87171', background: 'rgba(239, 68, 68, 0.1)' }}>
                <AlertCircle size={14} />
                {error}
            </div>
        );
    }

    return (
        <button
            onClick={() => open()}
            disabled={!ready}
            className={styles.plaidStatus}
            style={{
                cursor: ready ? 'pointer' : 'not-allowed',
                opacity: ready ? 1 : 0.7,
                background: 'rgba(59, 130, 246, 0.1)', // Blue-ish
                color: '#60a5fa',
                borderColor: 'rgba(59, 130, 246, 0.2)'
            }}
        >
            <LinkIcon size={14} />
            Connect Bank
        </button>
    );
}
