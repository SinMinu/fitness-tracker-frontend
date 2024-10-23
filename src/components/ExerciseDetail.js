// src/components/ExerciseDetail.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function ExerciseDetail() {
    const { recordId } = useParams();
    const { jwtToken } = useContext(AuthContext);
    const [exerciseRecord, setExerciseRecord] = useState(null);

    useEffect(() => {
        const fetchExerciseRecord = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/${recordId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setExerciseRecord(response.data);
            } catch (error) {
                console.error('Failed to fetch exercise record:', error);
            }
        };

        if (recordId) {
            fetchExerciseRecord();
        }
    }, [recordId, jwtToken]);

    if (!exerciseRecord) {
        return <p>Loading...</p>;
    }

    return (
        <div className="exercise-detail-container">
            <h2>Exercise Details</h2>
            <p><strong>Name:</strong> {exerciseRecord.exerciseName}</p>
            <p><strong>Type:</strong> {exerciseRecord.exerciseType}</p>
            <p><strong>Duration:</strong> {exerciseRecord.duration} minutes</p>
            <p><strong>Calories Burned:</strong> {exerciseRecord.caloriesBurned}</p>
            <p><strong>Date:</strong> {exerciseRecord.exerciseDate}</p>
        </div>
    );
}

export default ExerciseDetail;
