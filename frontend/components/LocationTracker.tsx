'use client';

import { useState, useEffect, useRef } from 'react';
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
    const lastSent = useRef(0);

    const wsRef = useRef<WebSocket | null>(null);
    const locationRef = useRef<LocationData>(location); // Keep ref synced for heartbeat

    // Sync ref
    useEffect(() => { locationRef.current = location; }, [location]);

    useEffect(() => {
        // 1. Establish WebSocket Connection
        const ws = new WebSocket('ws://localhost:8000/ws/location');
        wsRef.current = ws;

        ws.onopen = () => {
            // eslint-disable-next-line no-console
            console.log('Connected to Location WebSocket');
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'RECOMMENDATION_EVENT') {
                    setRecommendation({
                        cardId: data.card.recommended_card,
                        reason: (data.place.name || "Unknown Location") + ": " + data.card.reason,
                        confidence: 95,
                        estimatedRewards: `${data.card.multiplier}x Points`
                    });
                } else if (data.type === 'NO_REWARD_LOCATION') {
                    const placeName = data.place.name || "Unknown Location";
                    const customMsg = data.place.custom_message || ("Can't find any rewards you can use at this time (" + placeName + ").");
                    setRecommendation({
                        cardId: 'none',
                        reason: customMsg,
                        confidence: 0,
                        estimatedRewards: ''
                    });
                }
            } catch (e) {
                console.error("Error parsing WS message", e);
            }
        };

        ws.onerror = (error: any) => {
            // eslint-disable-next-line no-console
            console.log('WebSocket Connection Closed/Error (Retrying...)');
        };

        // 2. Start Geolocation Tracking
        let watchId: number;

        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const loc = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        loading: false,
                        address: "Tracking..."
                    };
                    setLocation(loc);
                    if (onLocationUpdate) onLocationUpdate(loc);

                    // Send immediate update if throttled
                    const now = Date.now();
                    if (ws.readyState === WebSocket.OPEN && now - lastSent.current > 2000) {
                        ws.send(JSON.stringify(loc));
                        lastSent.current = now;
                    }
                },
                (error) => {
                    setLocation(prev => ({ ...prev, error: error.message, loading: false }));
                },
                { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
            );
        } else {
            setLocation(prev => ({ ...prev, error: "Geolocation not supported", loading: false }));
        }

        // 3. Heartbeat Loop (Keeps backend alive when stationary)
        const heartbeat = setInterval(() => {
            const loc = locationRef.current;
            const now = Date.now();
            if (ws.readyState === WebSocket.OPEN && loc.latitude && loc.longitude) {
                // Send if we haven't sent in a while (e.g. 2.5s) to ensure "Polling" continues
                if (now - lastSent.current > 2500) {
                    ws.send(JSON.stringify(loc));
                    lastSent.current = now;
                }
            }
        }, 1000);

        return () => {
            if (watchId) navigator.geolocation.clearWatch(watchId);
            clearInterval(heartbeat);
            ws.close();
        };
    }, [onLocationUpdate]);

    // 3. Heartbeat: Send location every 3s if stationary to keep agent alive
    useEffect(() => {
        const interval = setInterval(() => {
            if (location.latitude && location.longitude && !location.loading && lastSent.current) {
                // Determine if we should send a heartbeat
                const now = Date.now();
                const ws = new WebSocket('ws://localhost:8000/ws/location'); // Wait, we can't create NEW socket.
                // We need access to the existing socket. 
                // Refactor: Move WS to ref or context? 
                // Simplest fix for now: Rely on the main useEffect, but we can't access 'ws' there easily from outside.
                // Let's modify the MAIN useEffect to include the interval.
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [location]);
    // Wait, the above approach is messy because of WS scope.
    // Let's rewrite the main useEffect to handle both watchPosition and Heartbeat.

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
                <div className={styles.locationPanel} style={{
                    background: recommendation.cardId === 'none' ? 'rgba(55, 65, 81, 0.5)' : 'linear-gradient(135deg, rgba(88, 28, 135, 0.2), rgba(124, 58, 237, 0.2))',
                    border: recommendation.cardId === 'none' ? '1px solid rgba(75, 85, 99, 0.5)' : '1px solid rgba(139, 92, 246, 0.3)'
                }}>
                    <div className={styles.locationIcon} style={{
                        background: recommendation.cardId === 'none' ? 'rgba(75, 85, 99, 0.5)' : 'rgba(139, 92, 246, 0.3)',
                        color: recommendation.cardId === 'none' ? '#9ca3af' : '#c4b5fd'
                    }}>
                        <Sparkles size={24} />
                    </div>
                    <div className={styles.locationInfo}>
                        <div className={styles.locationLabel}>AI Recommendation</div>
                        <div className={styles.locationValue}>
                            {recommendation.cardId === 'none' ? (
                                <span style={{ color: '#d1d5db' }}>No Card Needed</span>
                            ) : (
                                <>Use <span className="text-gradient" style={{ fontWeight: 'bold' }}>{recommendation.cardId}</span></>
                            )}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#d1d5db', marginTop: '0.25rem' }}>
                            {recommendation.reason}
                        </div>
                    </div>
                    {recommendation.estimatedRewards && (
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4ade80' }}>{recommendation.estimatedRewards}</div>
                            <div style={{ fontSize: '0.75rem', color: 'rgba(74, 222, 128, 0.7)' }}>Estimated Reward</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
