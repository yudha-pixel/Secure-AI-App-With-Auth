import React from 'react';
import { useState, useEffect } from 'react';
import MCQChallenge from './MCQChallenge.tsx';
import { useApi } from '../utils/api';

interface Quota {
    id: number;
    user_id: string;
    quota_remaining: number;
    last_reset_date: string; // ISO date string from the backend
}

interface ChallengeGeneratorProps {
    // Add any other props here if needed
}

const ChallengeGenerator: React.FC<ChallengeGeneratorProps> = () => {
    const [challenge, setChallenge] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [error, setError] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [quota, setQuota] = useState<Quota | null>(null);
    const {makeRequest} = useApi()

    useEffect(() => {
        fetchQuota()
    }, [])

    const fetchQuota = async () => {
        try {
            const data = await makeRequest("quota")
            setQuota(data)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Fail to fetch quota";
            setError(errorMessage);
        }
    }

    const getChallenge = async () => {
        setIsLoading(true);
        setError('');

        try {
            const data = await makeRequest("generate-challenge", {
                method: "POST",
                body: JSON.stringify({difficulty})
                }
            )
            setChallenge(data)
            fetchQuota()
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Fail to generate challenge";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
            setShowExplanation(false);
            setSelectedOption(null);
        }
    }

    const getNextResetTime = async () => {
        if (!quota?.last_reset_date) return null;
        const resetDate = new Date(quota.last_reset_date);
        resetDate.setHours(resetDate.getHours() + 24);
        return resetDate
    }

    return (
        <div className="challenge-container">
            <h2>Coding Challenge Generator</h2>
            <div className="quota-display">
                <p>Challenge remaining today: {quota?.quota_remaining || 0}</p>
                {quota?.quota_remaining === 0 && (
                    <p>
                        Next Reset: {getNextResetTime()?.toLocaleString()}
                    </p>
                )}
            </div>
            <div className="difficulty-selector">
                <label htmlFor="difficulty">Difficulty:</label>
                <select id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        disabled={isLoading}
                >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                </select>
            </div>

            <button
                onClick={getChallenge}
                disabled={isLoading || quota?.quota_remaining === 0}
                className="generate-button"
            >
                {isLoading ? 'Generating...' : 'Generate Challenge'}
            </button>

            {error && <div className="error-message">
                <p>{error}</p>
            </div>}

            {challenge && (
                <MCQChallenge
                    challenge={challenge}
                    showExplanation={showExplanation}
                    selectedOption={selectedOption}
                />
            )}
        </div>
    );
};

export default ChallengeGenerator;