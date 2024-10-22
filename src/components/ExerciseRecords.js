import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ExerciseRecords() {
    const [exerciseRecords, setExerciseRecords] = useState([]);

    useEffect(() => {
        // localStorage에서 userId와 jwtToken 가져오기
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        if (!userId || !token) {
            alert('You need to be logged in to view exercise records.');
            return;
        }

        // 운동 기록 조회 API 호출
        const fetchExerciseRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                setExerciseRecords(response.data);
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    alert('You do not have permission to view these records. Please check your credentials.');
                } else {
                    alert('Failed to fetch exercise records. Please try again.');
                }
            }
        };

        fetchExerciseRecords();
    }, []);

    return (
        <div>
            <h2>Exercise Records</h2>
            {exerciseRecords.length === 0 ? (
                <p>No exercise records found.</p>
            ) : (
                <ul>
                    {exerciseRecords.map((record) => (
                        <li key={record.id}>
                            {record.exerciseName} - {record.exerciseType} - {record.duration} minutes
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ExerciseRecords;
