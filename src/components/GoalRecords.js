import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function GoalRecords() {
    const [goals, setGoals] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGoals = async () => {
            const token = localStorage.getItem('jwtToken');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) {
                alert('You need to be logged in to view your goals.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/goals/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setGoals(response.data);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch goals. Please try again.');
            }
        };

        fetchGoals();
    }, []);

    const handleDelete = async (goalId) => {
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            alert('You need to be logged in to delete a goal.');
            return;
        }

        try {
            await axios.delete(`http://localhost:8080/api/goals/${goalId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            alert('Goal deleted successfully!');
            setGoals(goals.filter((goal) => goal.id !== goalId));
        } catch (error) {
            console.error(error);
            alert('Failed to delete goal. Please try again.');
        }
    };

    return (
        <div>
            <h2>Your Goals</h2>
            {goals.length === 0 ? (
                <p>No goals found.</p>
            ) : (
                <ul>
                    {goals.map((goal) => (
                        <li key={goal.id}>
                            <div>
                                <h3>{goal.goalName}</h3>
                                <p>{goal.goalDescription}</p>
                                <p>Start Date: {goal.startDate}</p>
                                <p>End Date: {goal.endDate}</p>
                                <p>Target Value: {goal.targetValue}</p>
                                <button onClick={() => navigate(`/edit-goal/${goal.id}`)}>Edit</button>
                                <button onClick={() => handleDelete(goal.id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default GoalRecords;
