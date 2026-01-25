import { CreditCard } from '../app/types';

export const MOCK_CARDS: CreditCard[] = [
    {
        id: '1',
        name: 'Venture X',
        bank: 'Capital One',
        last4: '1234',
        type: 'Travel',
        rewards: '10x Hotels & Rental Cars, 5x Flights, 2x Everything',
        imageColor: 'linear-gradient(135deg, #2c3e50 0%, #4ca1af 100%)' // Dark Blue/Teal
    },
    {
        id: '2',
        name: 'Savor',
        bank: 'Capital One',
        last4: '5678',
        type: 'Dining',
        rewards: '4% Dining, 4% Entertainment, 4% Streaming, 3% Grocery',
        imageColor: 'linear-gradient(135deg, #d35400 0%, #e67e22 100%)' // Orange/Copper
    },
    {
        id: '3',
        name: 'Quicksilver',
        bank: 'Capital One',
        last4: '9012',
        type: 'Cash Back',
        rewards: '1.5% Cash Back on Everything',
        imageColor: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)' // Silver/Grey
    },
    {
        id: '4',
        name: 'Spark Cash',
        bank: 'Capital One',
        last4: '3456',
        type: 'Business',
        rewards: '2% Cash Back on Everything',
        imageColor: 'linear-gradient(135deg, #16a085 0%, #f4d03f 100%)' // Green/Gold
    },
    {
        id: '5',
        name: 'Venture',
        bank: 'Capital One',
        last4: '7890',
        type: 'Travel',
        rewards: '2x Miles on Everything',
        imageColor: 'linear-gradient(135deg, #00416a 0%, #e4e5e6 100%)' // Deep Blue
    },
    {
        id: '6',
        name: 'SavorOne',
        bank: 'Capital One',
        last4: '2345',
        type: 'Dining',
        rewards: '3% Dining, 3% Entertainment, 3% Popular Streaming, 3% Grocery',
        imageColor: 'linear-gradient(135deg, #e67e22 0%, #f39c12 100%)' // Lighter Orange
    }
];
