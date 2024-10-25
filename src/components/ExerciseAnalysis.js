import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function ExerciseAnalysis() {
    const { jwtToken } = useContext(AuthContext);
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const userId = localStorage.getItem('userId');
            const startDate = '2024-10-01'; // 예시 시작 날짜
            const endDate = '2024-10-31';   // 예시 종료 날짜

            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}/analysis`, {
                    params: { startDate, endDate },
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });

                const labels = response.data.map(record => record.exerciseDate);
                const durations = response.data.map(record => record.duration);
                const calories = response.data.map(record => record.caloriesBurned);

                setChartData({
                    labels,
                    datasets: [
                        {
                            label: '운동 시간 (분)',
                            data: durations,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                        {
                            label: '소모 칼로리',
                            data: calories,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        },
                    ],
                });
            } catch (error) {
                console.error('운동 기록 분석 데이터를 가져오지 못했습니다:', error);
            }
        };

        fetchData();
    }, [jwtToken]);

    return (
        <div>
            <h2>운동 기록 분석</h2>
            <Line data={chartData} />
        </div>
    );
}

export default ExerciseAnalysis;
