'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Link as LinkIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import CreditCardList from '../../components/CreditCardList';
import LocationTracker from '../../components/LocationTracker';
import PlaidLink from '../../components/PlaidLink';
import { MOCK_CARDS } from '../../data/mockData';
import { CreditCard as CreditCardType } from '../types';

export default function DashboardPage() {
    const router = useRouter();
    const [cards, setCards] = useState<CreditCardType[]>([]);
    const [isPlaidConnected, setIsPlaidConnected] = useState(false);

    // Helper to determine card style based on name
    const getCardStyle = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('savor')) {
            // Orange/Red for Savor
            return 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)';
        } else if (n.includes('venture x')) {
            // Premium Dark Blue/Slate for Venture X
            return 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)';
        } else if (n.includes('venture')) {
            // Blue/Teal for Venture
            return 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)';
        } else if (n.includes('quicksilver')) {
            // Silver/Grey for Quicksilver
            return 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)';
        } else if (n.includes('platinum')) {
            // Platinum/Metallic
            return 'linear-gradient(135deg, #E0E0E0 0%, #BDBDBD 100%)';
        }
        // Fallback Blue-ish
        return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    };

    // Function to fetch cards from backend
    const fetchCards = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/cards');
            const data = await res.json();

            // If backend has real data (i.e. access token is set)
            if (!data.mock && data.cards && data.cards.length > 0) {
                setCards(data.cards.map((c: any) => ({
                    ...c,
                    // Assign a gradient based on card name
                    imageColor: getCardStyle(c.name)
                })));
                setIsPlaidConnected(true);
            }
        } catch (e) {
            console.error("Failed to fetch cards", e);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleUnlink = async () => {
        try {
            await fetch('http://localhost:8000/api/logout', { method: 'POST' });
            setIsPlaidConnected(false);
            setCards([]);
        } catch (e) {
            console.error("Unlink failed:", e);
        }
    };

    const handleSignOut = () => {
        router.push('/');
    };

    return (
        <main className={styles.main}>
            <nav className={styles.nav}>
                <div className={styles.logo}>
                    <CreditCard className="text-purple-500" />
                    <span>Card <span className="text-gradient">Compass</span></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {isPlaidConnected ? (
                        <div className={styles.plaidStatus}>
                            <LinkIcon size={14} />
                            Linked to Plaid
                        </div>
                    ) : (
                        <PlaidLink onLinkSuccess={fetchCards} />
                    )}



                    {isPlaidConnected && (
                        <button
                            onClick={handleUnlink}
                            className={styles.plaidStatus}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.2)', cursor: 'pointer', border: '1px solid' }}
                        >
                            <LinkIcon size={14} style={{ transform: 'rotate(45deg)' }} />
                            Unlink
                        </button>
                    )}

                    <button
                        onClick={handleSignOut}
                        className={styles.plaidStatus}
                        style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af', borderColor: 'rgba(255,255,255,0.1)', cursor: 'pointer', border: '1px solid' }}
                    >
                        <LogOut size={14} />
                        Sign Out
                    </button>
                </div>
            </nav>

            <div className={styles.container}>
                {/* Location & AI Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>
                        Compass
                    </h2>
                    <LocationTracker />
                </section>

                {/* Wallet Section */}
                <section className={styles.section}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className={styles.sectionTitle} style={{ marginBottom: 0 }}>
                            <Wallet size={24} />
                            Your Wallet
                        </h2>
                        <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                            {isPlaidConnected ? 'Synced from Capital One' : 'Connect Plaid to see your cards'}
                        </span>
                    </div>

                    <CreditCardList cards={cards} />

                    {isPlaidConnected && cards.length === 0 && (
                        <div style={{
                            padding: '2rem',
                            textAlign: 'center',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '1rem',
                            marginTop: '1rem'
                        }}>
                            <h3 style={{ color: '#f87171', marginBottom: '0.5rem', fontWeight: 'bold' }}>No Credit Cards Found</h3>
                            <p style={{ color: '#d1d5db', fontSize: '0.9rem' }}>
                                We successfully connected to your bank, but didn't find any <strong>Credit</strong> accounts.
                                <br /><br />
                                Please try connecting again and make sure to select an account labeled <strong>"Plaid Credit Card"</strong>.
                            </p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
