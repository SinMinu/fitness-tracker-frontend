import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress, Typography, Card, CardContent, Button, Grid, CardActions } from '@mui/material';
import { Link } from 'react-router-dom';

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
                setGoals(response.data);
            } catch (error) {
                console.error('목표를 불러오는 데 실패했습니다:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchGoals();
    }, [jwtToken, user]);

    const isPastDueDate = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        return end < today;
    };

    if (isLoading) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>로딩 중입니다...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>나의 목표</Typography>
            {goals.length === 0 ? (
                <Typography variant="h6" align="center">현재 설정된 목표가 없습니다.</Typography>
            ) : (
                <Grid container spacing={3} justifyContent="center">
                    {goals.map((goal) => {
                        const isExpired = isPastDueDate(goal.endDate);

                        return (
                            <Grid item xs={12} sm={6} md={2.4} key={goal.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        backgroundColor: goal.currentValue >= goal.targetValue
                                            ? '#e0f7fa'
                                            : isExpired
                                                ? '#ffebee'
                                                : '#fff',
                                        borderLeft: goal.currentValue >= goal.targetValue
                                            ? '5px solid #00796b'
                                            : isExpired
                                                ? '5px solid #d32f2f'
                                                : 'none',
                                    }}
                                >
                                    <CardContent>
                                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                            {goal.goalDescription}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                                            설명: {goal.goalDescription}
                                        </Typography>
                                        <Typography color="textSecondary" sx={{ mb: 1.5 }}>
                                            목표 값: {goal.targetValue} | 현재 값: {goal.currentValue}
                                        </Typography>
                                        <Typography variant="body2">
                                            시작 날짜: {goal.startDate}
                                        </Typography>
                                        <Typography variant="body2" color={isExpired ? "error" : "textPrimary"}>
                                            종료 날짜: {goal.endDate} {isExpired && "(종료됨)"}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color={goal.currentValue >= goal.targetValue ? "primary" : isExpired ? "error" : "textSecondary"}
                                            sx={{ mt: 1 }}
                                        >
                                            상태: {goal.currentValue >= goal.targetValue
                                            ? '달성됨 🎉'
                                            : isExpired
                                                ? '종료됨'
                                                : '진행 중...'}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
                                        <Button
                                            component={Link}
                                            to={`/goal-progress/`}
                                            size="small"
                                            variant="contained"
                                            sx={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                '&:hover': { backgroundColor: '#0056b3' },
                                                fontWeight: 'bold',
                                                px: 2,
                                                py: 1,
                                                borderRadius: '8px',
                                            }}
                                        >
                                            상세보기
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
}

export default GoalRecords;
