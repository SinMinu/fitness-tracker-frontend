import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles.css';

function EditGoal() {
    const { goalId } = useParams(); // URL에서 goalId를 가져옴
    const navigate = useNavigate();
    const [goal, setGoal] = useState({
        goalName: '',
        goalDescription: '',
        startDate: '',
        endDate: '',
        targetValue: '',
        userId: '', // userId 필드 추가
    });

    const [loading, setLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        const fetchGoal = async () => {
            const token = localStorage.getItem('jwtToken');

            if (!token) {
                alert('You need to be logged in to edit a goal.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/goals/${goalId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGoal(response.data); // 서버로부터 데이터를 받아서 goal 상태 업데이트
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 403) {
                    alert('You do not have permission to edit this goal. Please check your credentials.');
                } else {
                    alert('Failed to fetch goal details. Please try again.');
                }
            } finally {
                setLoading(false); // 로딩 상태를 false로 설정
            }
        };

        fetchGoal();
    }, [goalId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGoal((prevGoal) => ({
            ...prevGoal,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            alert('You need to be logged in to edit a goal.');
            return;
        }

        try {
            await axios.put(
                `http://localhost:8080/api/goals/goal/${goalId}`,
                goal,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // JWT 토큰 헤더에 추가
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('Goal updated successfully!');
            navigate('/goal-records'); // 수정 후 목표 목록 페이지로 이동
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('You do not have permission to edit this goal. Please check your credentials.');
            } else {
                alert('Failed to update goal. Please try again.');
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>; // 로딩 중일 때 표시할 내용
    }

    return (
        <div>
            <h2>Edit Goal</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="goalName"
                    placeholder="Goal Name"
                    value={goal.goalName || ''} // value가 undefined가 아니도록 빈 문자열로 처리
                    onChange={handleChange}
                />
                <textarea
                    name="goalDescription"
                    placeholder="Goal Description"
                    value={goal.goalDescription || ''} // value가 undefined가 아니도록 빈 문자열로 처리
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="startDate"
                    value={goal.startDate || ''} // value가 undefined가 아니도록 빈 문자열로 처리
                    onChange={handleChange}
                />
                <input
                    type="date"
                    name="endDate"
                    value={goal.endDate || ''} // value가 undefined가 아니도록 빈 문자열로 처리
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="targetValue"
                    placeholder="Target Value"
                    value={goal.targetValue || ''} // value가 undefined가 아니도록 빈 문자열로 처리
                    onChange={handleChange}
                />
                <button type="submit">Update Goal</button>
            </form>
        </div>
    );
}

export default EditGoal;
