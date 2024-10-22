import React, { useState } from 'react';
import axios from 'axios';

function AddGoal() {
    const [goalName, setGoalName] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [targetValue, setTargetValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // localStorage에서 userId와 jwtToken 가져오기
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        if (!userId || !token) {
            alert('You need to be logged in to set a goal.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/goals/user/${userId}`,
                {
                    goalName,
                    goalDescription,
                    startDate,
                    endDate,
                    targetValue,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);
            alert('Goal added successfully!');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('You do not have permission to set a goal. Please check your credentials.');
            } else {
                alert('Failed to add goal. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Add New Goal</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Goal Name"
                    value={goalName}
                    onChange={(e) => setGoalName(e.target.value)}
                />
                <textarea
                    placeholder="Goal Description"
                    value={goalDescription}
                    onChange={(e) => setGoalDescription(e.target.value)}
                />
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Target Value"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                />
                <button type="submit">Add Goal</button>
            </form>
        </div>
    );
}

export default AddGoal;
