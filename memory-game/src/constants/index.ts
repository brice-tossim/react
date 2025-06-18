import dog1 from '../assets/images/dog-1.jpg';
import dog2 from '../assets/images/dog-2.jpg';
import dog3 from '../assets/images/dog-3.jpg';
import dog4 from '../assets/images/dog-4.jpg';
import dog5 from '../assets/images/dog-5.jpg';
import dog6 from '../assets/images/dog-6.jpg';
import type CardImage from '../types/cardImage';

const MAX_FAILED_COUNTER = 5;

const MAX_GOOD_MATCH_COUNTER = 6;

const CARD_IMAGES: CardImage[] = [
    {
        src: dog1,
        matched: false,
        flipped: false,
        disabled: false,
    },
    {
        src: dog2,
        matched: false,
        flipped: false,
        disabled: false,
    },
    {
        src: dog3,
        matched: false,
        flipped: false,
        disabled: false,
    },
    {
        src: dog4,
        matched: false,
        flipped: false,
        disabled: false,
    },
    {
        src: dog5,
        matched: false,
        flipped: false,
        disabled: false,
    },
    {
        src: dog6,
        matched: false,
        flipped: false,
        disabled: false,
    },
];

export {MAX_FAILED_COUNTER, MAX_GOOD_MATCH_COUNTER, CARD_IMAGES};