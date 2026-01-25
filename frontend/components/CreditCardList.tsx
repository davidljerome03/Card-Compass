import { CreditCard } from '../app/types';
import styles from './DashboardComponents.module.css';

interface CreditCardListProps {
    cards: CreditCard[];
}

export default function CreditCardList({ cards }: CreditCardListProps) {
    return (
        <div className={styles.grid}>
            {cards.map((card) => (
                <div
                    key={card.id}
                    className={styles.card}
                    style={{ background: card.imageColor }}
                >
                    <div className={styles.cardTop}>
                        <span className={styles.cardBank}>{card.bank}</span>
                        <span className={styles.cardType}>{card.type}</span>
                    </div>

                    <div className={styles.cardNumber}>
                        •••• •••• •••• {card.last4}
                    </div>

                    <div className={styles.cardBottom}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span className={styles.cardName}>{card.name}</span>
                            <span className={styles.cardRewards}>{card.rewards}</span>
                        </div>
                        {/* Optional logo or chip icon could go here */}
                    </div>
                </div>
            ))}
        </div>
    );
}
