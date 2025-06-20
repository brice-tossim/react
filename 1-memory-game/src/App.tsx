import { useCallback, useEffect, useState } from "react";
import type CardImage from "./types/cardImage";
import { createShuffledCards } from "./utils";
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";
import { MAX_FAILED_COUNTER } from "./constants";

export default function App() {
  const [cards, setCards] = useState<CardImage[]>(() => createShuffledCards());
  const [failedCounter, setFailedCounter] = useState<number>(0);
  const [goodMatchCounter, setGoodMatchCounter] = useState<number>(0);
  const [choiceOne, setChoiceOne] = useState<CardImage | null>(null);
  const [choiceTwo, setChoiceTwo] = useState<CardImage | null>(null);

  const refreshChoices = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
  }

  const handleShuffle = useCallback(() => {
    setCards(createShuffledCards());
    setFailedCounter(0);
    setGoodMatchCounter(0);
    refreshChoices();
  }, []);

  const handleCardFlip = useCallback((selectedCard: CardImage) => {
    // Do not turn in the maximum failed counter is reached
    if (failedCounter >= MAX_FAILED_COUNTER) return;

    // If the card is disabled or already matched, do nothing
    if (selectedCard.disabled || selectedCard.matched) return;

    // Get the selected card and flip it
    setCards((prevCards) => {
      return prevCards.map((card) => {
        return card.id === selectedCard.id
          ? { ...card, flipped: !card.flipped, disabled: !card.disabled }
          : card
      });
    });

    // Update choices
    choiceOne ? setChoiceTwo(selectedCard) : setChoiceOne(selectedCard)
  }, [choiceOne, failedCounter]);

  useEffect(() => {
    if (failedCounter >= MAX_FAILED_COUNTER) return;

    if (!choiceOne || !choiceTwo) return;

    if (choiceOne.src === choiceTwo.src) {
      setCards((prevCards) => {
        return prevCards.map((card) => {
          return card.id === choiceOne.id || card.id === choiceTwo.id
            ? { ...card, matched: true, disabled: true }
            : card
        });
      });

      setGoodMatchCounter((prevGoodMatchCounter) => prevGoodMatchCounter + 1)
      refreshChoices();
    } else {
      // Set a timer the time that the user can see the cards before flipping them back
      setTimeout(() => {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            return card.id === choiceOne.id || card.id === choiceTwo.id
              ? { ...card, flipped: false, disabled: false }
              : card
          });
        });

        setFailedCounter((prevFailedCounter) => prevFailedCounter + 1)
        refreshChoices()
      }, 1000)
    }
  }, [choiceOne, choiceTwo])

  return (
    <div className="flex flex-col w-full items-center justify-center text-white mt-4">
      <Header
        failedCounter={failedCounter}
        goodMatchCounter={goodMatchCounter}
        onShuffle={handleShuffle}
      />
      <CardGrid cards={cards} onFlipCard={handleCardFlip} />
    </div>
  );
}
