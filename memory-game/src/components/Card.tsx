import type CardImage from "../types/cardImage";

interface CardProps {
    card: CardImage,
    handleChoice: (card: CardImage) => void;
}

export default function Card({ card, handleChoice }: CardProps) {
    const handleClick = () => {
        if (!card.disabled) {
            handleChoice(card);
        }
    }

    return (
        <div
            className="flex w-40 h-40 m-2 rounded-lg shadow-lg cursor-pointer bg-gray-800"
            onClick={handleClick}
        >
            <img
                src={card.flipped ? card.src : './src/assets/images/cover.svg'}
                alt="Card"
                className={`rounded-lg ${card.flipped ? 'w-full h-full object-cover' : 'w-30 h-30 m-auto object-contain rotate-none'}`}
            />
        </div>
    );
}