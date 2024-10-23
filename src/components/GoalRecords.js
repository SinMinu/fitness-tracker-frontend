import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

function GoalRecords() {
    const { jwtToken, user } = useContext(AuthContext);
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchGoals = async () => {
            if (!jwtToken || !user) {
                console.error('User is not authenticated.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/goals/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setGoals(response.data);
            } catch (error) {
                console.error('Failed to fetch goals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoals();
    }, [jwtToken, user]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="goal-records">
            <h2>Your Goals</h2>
            {goals.length === 0 ? (
                <p>No goals found.</p>
            ) : (
                goals.map((goal) => (
                    <div key={goal.id} className="goal-card">
                        <h3>{goal.goalDescription}</h3>
                        <p>Target Value: {goal.targetValue}</p>
                        <p>Start Date: {goal.startDate}</p>
                        <p>End Date: {goal.endDate}</p>
                        <p>Status: {goal.isAchieved ? 'Achieved' : 'In Progress'}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default GoalRecords;
