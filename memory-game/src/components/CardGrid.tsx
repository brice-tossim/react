import { useCallback } from "react";
import type CardImage from "../types/cardImage";
import Card from "./Card";

interface GridProps {
    cards: CardImage[];
    onFlipCard: (card: CardImage) => void;
}

export default function CardGrid({ cards, onFlipCard }: GridProps) {
    const handleChoice = useCallback((card: CardImage) => {
        // Call the parent handler to indicate a card choice
        onFlipCard(card);
    }, [onFlipCard]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4">
            {cards.map((card) => (
                <Card
                    key={card.id}
                    card={card}
                    handleChoice={() => handleChoice(card)}
                />
            ))}
        </div>
    );
}