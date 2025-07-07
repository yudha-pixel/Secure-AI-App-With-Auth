import {useState, useEffect} from 'react';
import MCQChallenge from '../challenge/MCQChallenge.tsx';
import {useApi} from "../utils/api.ts";

const HistoryPanel = () => {
    const { makeRequest } = useApi()
    const [history, setHistory] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        setIsLoading(true)
        setError('')
        try {
            const data = await makeRequest('my-history')
            setHistory(data.challenges)
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Fail to fetch history";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <p>Loading History...</p>
    }

    if (error) {
        return <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchHistory}>Retry</button>
        </div>
    }

    return (
        <div className="history-panel">
            <h2>History</h2>
            {history.length === 0 ?(
                <p>No Challenges History</p>
            ) : (
                <div className="history-list">
                    {history.map((challenge) => {
                        return <MCQChallenge
                                    key={challenge.id}
                                    challenge={challenge}
                                    showExplanation
                                />;
                    })}
                </div>
            )}
        </div>
    );
};

export default HistoryPanel;