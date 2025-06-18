import { MAX_FAILED_COUNTER, MAX_GOOD_MATCH_COUNTER } from "../constants";

interface HeaderProps {
    failedCounter: number,
    goodMatchCounter: number,
    onShuffle: () => void
}

export default function Header({ failedCounter, goodMatchCounter, onShuffle }: HeaderProps) {
    return (
        <div className="mb-10">
            <div className="flex flex-col items-center justify-center gap-2 p-2">
                <h1 className="font-bold text-lg">Test your memory 🧠</h1>
                <button
                    className="border border-indigo-600 bg-indigo-600 text-white rounded-lg p-2 cursor-pointer hover:bg-indigo-700"
                    onClick={onShuffle}
                >
                    New Game
                </button>
                <p className="text-md">Failed: {failedCounter} / {MAX_FAILED_COUNTER}</p>
                {
                    failedCounter >= MAX_FAILED_COUNTER &&
                    <p className="font-bold text-lg text-red-600">
                        Game Over !!! Start a new game !!!
                    </p>
                }
                { 
                    goodMatchCounter >= MAX_GOOD_MATCH_COUNTER &&
                    <p className="font-bold text-lg text-green-600">
                        Good game !!! Start a new one !!!
                    </p>
                }
            </div>
        </div >
    );
}