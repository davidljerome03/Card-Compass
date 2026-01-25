'use client';

import { useState, useEffect } from 'react';
import { MapPin, Sparkles } from 'lucide-react';
import styles from './DashboardComponents.module.css';
import { LocationData, Recommendation } from '../app/types';

interface LocationTrackerProps {
    onLocationUpdate?: (location: LocationData) => void;
}

export default function LocationTracker({ onLocationUpdate }: LocationTrackerProps) {
    const [location, setLocation] = useState<LocationData>({
        latitude: null,
        longitude: null,
        loading: true
    });
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        loading: false,
                        // Mock address for demo
                        address: "123 Main St, New York, NY (Mock)"
                    };
                    setLocation(loc);
                    if (onLocationUpdate) onLocationUpdate(loc);

                    // Simulate AI Recommendation after location found
                    setTimeout(() => {
                        setRecommendation({
                            cardId: '2', // Savor
                            reason: 'You are at a Restaurant. Use Savor for 4% cash back on dining.',
                            confidence: 98,
                            estimatedRewards: '4% Cash Back'
                        });
                    }, 1500);
                },
                (error) => {
                    setLocation({
                        latitude: null,
                        longitude: null,
                        error: error.message,
                        loading: false
                    });
                }
            );
        } else {
            setLocation({
                latitude: null,
                longitude: null,
                error: "Geolocation not supported",
                loading: false
            });
        }
    }, [onLocationUpdate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Location Status */}
            <div className={styles.locationPanel}>
                <div className={styles.locationIcon}>
                    <MapPin size={24} />
                </div>
                <div className={styles.locationInfo}>
                    <div className={styles.locationLabel}>Current Location</div>
                    <div className={styles.locationValue}>
                        {location.loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Locating...</span>
                        ) : location.error ? (
                            <span style={{ color: '#f87171' }}>{location.error}</span>
                        ) : (
                            <span>
                                {location.latitude?.toFixed(4)}, {location.longitude?.toFixed(4)}
                                {location.address && <span style={{ display: 'block', fontSize: '0.875rem', color: '#9ca3af', fontWeight: 'normal' }}>{location.address}</span>}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* AI Recommendation */}
            {recommendation && (
                <div className={styles.locationPanel} style={{ background: 'linear-gradient(135deg, rgba(88, 28, 135, 0.2), rgba(124, 58, 237, 0.2))', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                    <div className={styles.locationIcon} style={{ background: 'rgba(139, 92, 246, 0.3)', color: '#c4b5fd' }}>
                        <Sparkles size={24} />
                    </div>
                    <div className={styles.locationInfo}>
                        <div className={styles.locationLabel}>AI Recommendation</div>
                        <div className={styles.locationValue}>
                            Use <span className="text-gradient" style={{ fontWeight: 'bold' }}>Capital One Savor</span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginTop: '0.25rem' }}>
                            {recommendation.reason}
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{recommendation.estimatedRewards}</div>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(74, 222, 128, 0.7)' }}>Estimated Reward</div>
                    </div>
                </div>
            )}
        </div>
    );
}
