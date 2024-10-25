import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography, CircularProgress, Paper, Grid } from '@mui/material';

function ExerciseRecommendations() {
    const { jwtToken } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchRecommendations = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                console.error('토큰이 없습니다.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}/recommendations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error('운동 추천을 가져오지 못했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [jwtToken, userId]);

    const handleRecommendationClick = async (exerciseType) => {
        // 현재 위치 기반 주변 장소 검색 (Google Places API 사용 - 결제 필요)
        /*
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;

            try {
                const response = await axios.get(`http://localhost:8080/api/google-places`, {
                    params: {
                        lat: latitude,
                        lng: longitude,
                        keyword: exerciseType
                    }
                });

                console.log(response.data);
            } catch (error) {
                console.error("주변 장소를 불러오지 못했습니다:", error);
            }
        });
        */
        alert(`${exerciseType} 관련 장소를 검색하려면 API 결제가 필요합니다.`);
    };

    return (
        <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
            <Typography variant="h4" gutterBottom align="center"> {/* 제목 가운데 정렬 */}
                추천 운동
            </Typography>
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : recommendations.length > 0 ? (
                <Grid container spacing={2}>
                    {recommendations.map((recommendation, index) => (
                        <Grid item xs={12} sm={6} key={index}>
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    textAlign: 'center',
                                    bgcolor: '#f7faff',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: '#e3f2fd',
                                        transform: 'scale(1.02)',
                                        transition: '0.3s ease-in-out',
                                    },
                                }}
                                onClick={() => handleRecommendationClick(recommendation)} // 클릭 핸들러 추가
                            >
                                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                                    {recommendation}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center">추천 운동이 없습니다.</Typography>
            )}
        </Box>
    );
}

export default ExerciseRecommendations;
