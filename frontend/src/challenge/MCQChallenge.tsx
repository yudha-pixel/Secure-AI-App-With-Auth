import { useState } from 'react';

interface MCQChallengeProps {
    challenge: {
        options: string | any[];
        title: string;
        correct_answer_id: number;
        explanation: string;
        difficulty: string;
    };
    showExplanation?: boolean;
    selectedOption?: number | null;
}

function MCQChallenge({challenge, showExplanation=false}: MCQChallengeProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [shouldShowExplanation, setShouldShowExplanation] = useState(showExplanation);

    const options = typeof challenge.options === 'string'
        ? JSON.parse(challenge.options)
        : challenge.options;

    const handleOptionSelect = (option: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(option);
        setShouldShowExplanation(true);
    };

    const getOptionClass = (index: number) => {
        if (selectedOption === null) return 'option';

        if (index === challenge.correct_answer_id) {
            return 'option correct'
        }
        if (selectedOption === index && index !== challenge.correct_answer_id) {
            return 'option incorrect'
        }

        return 'option';
    };

    return (
        <div className="challenge-display">
            <p>
                <strong>Difficulty:</strong> {challenge.difficulty}
            </p>
            <p className="challenge-title">
                {challenge.title}
            </p>
            <div className="options">
                {options.map((option: string, index:number) => (
                    <div
                        key={index}
                        className={getOptionClass(index)}
                        onClick={() => handleOptionSelect(index)}
                    >
                        {option}
                    </div>
                ))}
            </div>
            {shouldShowExplanation && (
                <div className="explanation">
                    <h4>Explanation</h4>
                    <p>{challenge.explanation}</p>
                </div>
            )}
        </div>
    );
}

export default MCQChallenge;