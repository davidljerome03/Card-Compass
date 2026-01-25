export interface CreditCard {
    id: string;
    name: string;
    bank: string;
    last4: string;
    type: string;
    rewards: string;
    imageColor: string; // CSS gradient or color class
}

export interface LocationData {
    latitude: number | null;
    longitude: number | null;
    address?: string;
    error?: string;
    loading: boolean;
}

export interface Recommendation {
    cardId: string;
    reason: string;
    confidence: number; // 0-100
    estimatedRewards: string;
}
