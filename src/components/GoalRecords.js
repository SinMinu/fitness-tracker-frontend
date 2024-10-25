import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, CircularProgress, Typography, Card, CardContent, Button, Grid } from '@mui/material';
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

    // 오늘 날짜와 목표 종료 날짜 비교 함수
    const isPastDueDate = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        return end < today; // 종료 날짜가 오늘보다 이전인지 확인
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
                        const isExpired = isPastDueDate(goal.endDate); // 목표가 종료되었는지 확인

                        return (
                            <Grid item xs={12} sm={6} md={2.4} key={goal.id}> {/* 5개씩 배열되도록 설정 */}
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        boxShadow: 3,
                                        backgroundColor: goal.currentValue >= goal.targetValue
                                            ? '#e0f7fa'
                                            : isExpired
                                                ? '#ffebee'  // 종료 날짜가 지난 목표는 빨간색 계열 배경
                                                : '#fff',
                                        borderLeft: goal.currentValue >= goal.targetValue
                                            ? '5px solid #00796b'
                                            : isExpired
                                                ? '5px solid #d32f2f'  // 경고 스타일
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
                                    <Button
                                        component={Link}
                                        to={`/goal-progress/`}
                                        size="small"
                                        color="primary"
                                    >
                                        상세보기
                                    </Button>
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
