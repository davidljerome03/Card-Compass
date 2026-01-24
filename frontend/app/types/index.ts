export interface CreditCard {
  id: string;
  name: string;
  last4: string;
  type: string;
  rewards?: {
    categories?: string[];
    rate?: number;
    description?: string;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
}

export interface Recommendation {
  cardId: string;
  cardName: string;
  reason: string;
  confidence: number;
  rewards?: {
    category?: string;
    rate?: number;
    estimatedRewards?: number;
  };
}
