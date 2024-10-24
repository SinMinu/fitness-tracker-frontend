import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import { Link } from 'react-router-dom';

function ExerciseRecords() {
    const [exerciseRecords, setExerciseRecords] = useState([]);

    useEffect(() => {
        // localStorage에서 userId와 jwtToken 가져오기
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        if (!userId || !token) {
            alert('운동 기록을 보려면 로그인해야 합니다.');
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
                    alert('이 기록을 볼 권한이 없습니다. 자격 증명을 확인해주세요.');
                } else {
                    alert('운동 기록을 불러오지 못했습니다. 다시 시도해주세요.');
                }
            }
        };

        fetchExerciseRecords();
    }, []);

    return (
        <div className="exercise-records">
            <h2>운동 기록</h2>
            <div className="exercise-cards-container">
                {exerciseRecords.length === 0 ? (
                    <p>운동 기록이 없습니다.</p>
                ) : (
                    exerciseRecords.map((record) => (
                        <div key={record.id} className="exercise-card">
                            <h3>{record.exerciseName}</h3>
                            <p>유형: {record.exerciseType}</p>
                            <p>지속 시간: {record.duration} 분</p>
                            <p>소모 칼로리: {record.caloriesBurned} kcal</p>
                            <p>날짜: {record.exerciseDate}</p>
                            <Link to={`/exercise-detail/${record.id}`}>자세히 보기</Link> {/* 상세 페이지로 이동하는 링크 */}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ExerciseRecords;
