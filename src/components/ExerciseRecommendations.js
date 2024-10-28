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
        const fetchPersonalizedRecommendations = async () => {
            if (!jwtToken) {
                console.error('토큰이 없습니다.');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}/personalized-recommendations`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setRecommendations(response.data);
            } catch (error) {
                console.error('개인화 추천을 가져오지 못했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPersonalizedRecommendations();
    }, [jwtToken, userId]);

    const handleRecommendationClick = async (exerciseType) => {
        alert(`${exerciseType} 관련 장소를 검색하려면 API 결제가 필요합니다.`);
    };

    return (
        <Box sx={{ mt: 4, mx: 'auto', maxWidth: 800 }}>
            <Typography variant="h4" gutterBottom align="center">
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
                                onClick={() => handleRecommendationClick(recommendation)} // recommendation 자체 전달
                            >
                                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                                    {recommendation} {/* recommendation 자체 출력 */}
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
