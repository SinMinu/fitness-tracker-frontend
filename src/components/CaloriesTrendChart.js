import React, { useEffect, useState, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box, Typography } from '@mui/material';

function CaloriesTrendChart({ period }) {
    const { jwtToken } = useContext(AuthContext);
    const [trendData, setTrendData] = useState(null);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchTrendData = async () => {
            const periodPath = {
                "일주일": "weekly",
                "한달": "monthly",
                "분기": "quarterly"
            }[period] || period;

            try {
                const response = await axios.get(
                    `http://localhost:8080/api/exercise-records/user/${userId}/stats/${periodPath}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );

                const statsList = response.data;
                console.log("받아온 통계 리스트:", statsList);

                if (Array.isArray(statsList) && statsList.length > 0) {
                    const labels = statsList.map(stat => stat.date);
                    const caloriesBurned = statsList.map(stat => stat.caloriesBurned);
                    const averageDuration = statsList.map(stat => stat.averageDuration);

                    setTrendData({
                        labels,
                        datasets: [
                            {
                                label: '소모 칼로리',
                                data: caloriesBurned,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: false,
                                tension: 0.4,
                            },
                            {
                                label: '평균 운동 시간',
                                data: averageDuration,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                fill: false,
                                tension: 0.4,
                            },
                        ],
                    });
                } else {
                    console.warn("예상치 못한 데이터 형식 또는 빈 데이터 배열입니다.");
                }
            } catch (error) {
                console.error(`오류 발생: ${period} 기간의 통계 데이터를 불러올 수 없습니다.`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendData();
    }, [jwtToken, userId, period]);


    if (loading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="200px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h6" align="center">{`${period.charAt(0).toUpperCase() + period.slice(1)} 통계`}</Typography>
            {trendData ? (
                <Line data={trendData} options={{
                    scales: {
                        x: {
                            display: false, // x축 레이블 숨기기
                        }
                    },
                    plugins: {
                        tooltip: {
                            enabled: true, // 마우스 오버 시 툴팁 활성화
                        }
                    }
                }} />
            ) : (
                <Typography align="center" variant="body2">데이터가 없습니다</Typography>
            )}
        </Box>
    );
}

export default CaloriesTrendChart;
