import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GoalProgressChart from './GoalProgressChart';
import '../styles.css';

function GoalProgress() {
    const { jwtToken, user } = useContext(AuthContext);
    const [goalProgress, setGoalProgress] = useState([]);

    useEffect(() => {
        const fetchGoalProgress = async () => {
            if (user && jwtToken) {
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
            }
        };

        fetchGoalProgress();
    }, [user, jwtToken]);

    return (
        <div className="goal-progress-container">
            <h2>Goal Progress</h2>
            {goalProgress.length === 0 ? (
                <p>No goals found</p>
            ) : (
                <>
                    <GoalProgressChart goalProgress={goalProgress} />
                    <div className="goal-cards-container">
                        {goalProgress.map((goal) => (
                            <div key={goal.goalId} className="goal-progress-card">
                                <h3>{goal.goalDescription}</h3>
                                <p>Progress: {goal.progress}%</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default GoalProgress;
