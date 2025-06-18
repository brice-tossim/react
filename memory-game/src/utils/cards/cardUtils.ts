import { CARD_IMAGES } from "../../constants";
import type CardImage from "../../types/cardImage";
import { v4 as uuidv4 } from 'uuid';

// Use two-pointer techniques to shuffle efficiently the card images
export const shuffle = (cardImages: CardImage[]): CardImage[] => {
    let left = 0, right = cardImages.length - 1;

    while (left < right) {
        const j = Math.floor(Math.random() * (right - left + 1)) + left;
        [cardImages[left], cardImages[j]] = [cardImages[j], cardImages[left]];
        left++;
        right--;
    }

    return cardImages;
}

// Shuffle the cards
export const createShuffledCards = (): CardImage[] => {
    let cardImages = [...CARD_IMAGES, ...CARD_IMAGES];
    cardImages = shuffle(cardImages);
    
    return cardImages.map((card) => {
        return {
            ...card,
            id: uuidv4() // Generate a unique ID for each card
        }
    });
}