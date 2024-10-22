import React, { useState } from 'react';
import axios from 'axios';

function AddExercise() {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [exerciseDate, setExerciseDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // localStorage에서 JWT 토큰과 userId 가져오기
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert('You need to be logged in to add an exercise record.');
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/api/exercise-records/user/${userId}`,
                {
                    exerciseName,
                    exerciseType,
                    duration,
                    caloriesBurned,
                    exerciseDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);
            alert('Exercise record added successfully!');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('You do not have permission to perform this action. Please check your credentials.');
            } else {
                alert('Failed to add exercise record. Please try again.');
            }
        }
    };

    return (
        <div>
            <h2>Add Exercise Record</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Exercise Name"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Exercise Type"
                    value={exerciseType}
                    onChange={(e) => setExerciseType(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Calories Burned"
                    value={caloriesBurned}
                    onChange={(e) => setCaloriesBurned(e.target.value)}
                />
                <input
                    type="date"
                    value={exerciseDate}
                    onChange={(e) => setExerciseDate(e.target.value)}
                />
                <button type="submit">Add Exercise</button>
            </form>
        </div>
    );
}

export default AddExercise;
