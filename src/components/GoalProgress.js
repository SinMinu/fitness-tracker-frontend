import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProgressChart from '../components/ProgressChart';
import '../styles.css';

function GoalProgress() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [goalProgress, setGoalProgress] = useState([]);

    useEffect(() => {
        if (isAuthenticated && user && jwtToken) {
            const fetchGoalProgress = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/goals/progress/user/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });
                    setGoalProgress(response.data);
                } catch (error) {
                    console.error('Failed to fetch goal progress:', error);
                }
            };
            fetchGoalProgress();
        }
    }, [isAuthenticated, user, jwtToken]);

    return (
        <div className="goal-progress-container">
            <h2>Goal Progress</h2>
            <div className="progress-charts">
                {goalProgress.length === 0 ? (
                    <p>No goals to display progress.</p>
                ) : (
                    goalProgress.map((goal) => (
                        <ProgressChart
                            key={goal.id}
                            goalName={goal.goalName}
                            progress={goal.progress}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default GoalProgress;
