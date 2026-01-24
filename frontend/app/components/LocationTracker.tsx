"use client";

import { useEffect, useState } from "react";
import { Location } from "../types";

interface LocationTrackerProps {
  onLocationUpdate: (location: Location) => void;
}

export default function LocationTracker({ onLocationUpdate }: LocationTrackerProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Try to get address from reverse geocoding
          let address = "";
          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY || ""}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                address = data.results[0].formatted;
              }
            }
          } catch (err) {
            console.error("Reverse geocoding error:", err);
          }

          const newLocation: Location = {
            latitude,
            longitude,
            address: address || undefined,
          };

          setLocation(newLocation);
          onLocationUpdate(newLocation);
          setLoading(false);
        },
        (err) => {
          setError("Unable to retrieve your location");
          setLoading(false);
          console.error("Geolocation error:", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

    getLocation();

    // Update location every 30 seconds
    const interval = setInterval(getLocation, 30000);

    return () => clearInterval(interval);
  }, [onLocationUpdate]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-600">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
        <span className="text-sm">Getting location...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="text-sm text-gray-600">
      {location?.address ? (
        <span>📍 {location.address}</span>
      ) : (
        <span>
          📍 {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
        </span>
      )}
    </div>
  );
}
