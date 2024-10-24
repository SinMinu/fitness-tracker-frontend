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
                console.error('사용자가 인증되지 않았습니다.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/goals/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setGoals(response.data); // 백엔드로부터 목표 데이터를 설정
            } catch (error) {
                console.error('목표를 불러오는 데 실패했습니다:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoals();
    }, [jwtToken, user]);

    if (isLoading) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="goal-records">
            <h2>나의 목표</h2>
            {goals.length === 0 ? (
                <p>목표가 없습니다.</p>
            ) : (
                goals.map((goal) => (
                    <div
                        key={goal.id}
                        className={`goal-card ${goal.currentValue >= goal.targetValue ? 'achieved' : ''}`} // 달성된 목표에 'achieved' 클래스 추가
                    >
                        <h3>{goal.goalDescription}</h3>
                        <p>목표 값: {goal.targetValue}</p>
                        <p>현재 값: {goal.currentValue}</p>
                        <p>시작 날짜: {goal.startDate}</p>
                        <p>종료 날짜: {goal.endDate}</p>
                        <p>상태: {goal.currentValue >= goal.targetValue ? '달성됨' : '진행 중'}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default GoalRecords;
