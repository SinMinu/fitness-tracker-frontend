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
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        if (recordId) {
            fetchExerciseRecord();
        }
    }, [recordId, jwtToken]);

    if (!exerciseRecord) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="exercise-detail-container">
            <h2>운동 상세 정보</h2>
            <p><strong>이름:</strong> {exerciseRecord.exerciseName}</p>
            <p><strong>유형:</strong> {exerciseRecord.exerciseType}</p>
            <p><strong>지속 시간:</strong> {exerciseRecord.duration} 분</p>
            <p><strong>소모 칼로리:</strong> {exerciseRecord.caloriesBurned} kcal</p>
            <p><strong>날짜:</strong> {exerciseRecord.exerciseDate}</p>
        </div>
    );
}

export default ExerciseDetail;
