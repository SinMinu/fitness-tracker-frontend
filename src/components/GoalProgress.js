import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GoalProgressChart from './GoalProgressChart';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Grid, Typography, Box } from '@mui/material';
import '../styles.css';

function GoalProgress() {
    const { jwtToken, user } = useContext(AuthContext);
    const [goalProgress, setGoalProgress] = useState([]);
    const [selectedGoal, setSelectedGoal] = useState(null);
    const [progressValue, setProgressValue] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const fetchGoalProgress = async () => {
            if (user && jwtToken) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/goals/progress/user/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });
                    setGoalProgress(response.data);
                } catch (error) {
                    console.error('목표 진행 상황을 불러오는 데 실패했습니다:', error);
                }
            }
        };

        fetchGoalProgress();
    }, [user, jwtToken]);

    const handleProgressUpdate = async () => {
        try {
            await axios.put(
                `http://localhost:8080/api/goals/goal/${selectedGoal.goalId}/progress`,
                { progress: progressValue },
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );

            setGoalProgress((prevGoals) =>
                prevGoals.map((goal) =>
                    goal.goalId === selectedGoal.goalId
                        ? {
                            ...goal,
                            progress: progressValue,
                            isAchieved: progressValue === 100,
                        }
                        : goal
                )
            );
            setOpenDialog(false);
        } catch (error) {
            console.error('목표 진행 상황 업데이트에 실패했습니다:', error);
        }
    };

    const handleOpenDialog = (goal) => {
        setSelectedGoal(goal);
        setProgressValue(goal.progress);
        setOpenDialog(true);
    };

    return (
        <Box sx={{ flexGrow: 1, p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            <Grid container spacing={3} alignItems="stretch">
                {/* 목표 목록 - 비율 1 */}
                <Grid item xs={12} md={4}>
                    <Typography variant="h5" gutterBottom>목표 목록</Typography>
                    <Box className="goal-cards-container" sx={{ overflowY: 'auto', maxHeight: '500px', pr: 2 }}>
                        {goalProgress.length === 0 ? (
                            <Typography>등록된 목표가 없습니다.</Typography>
                        ) : (
                            goalProgress.map((goal) => (
                                <Box key={goal.goalId} className="goal-progress-card" sx={{ mb: 3 }}>
                                    <Typography variant="h6">{goal.goalDescription}</Typography>
                                    <Box
                                        className="progress-bar"
                                        sx={{
                                            position: 'relative',
                                            height: '10px',
                                            backgroundColor: '#e0e0e0',
                                            borderRadius: '5px',
                                            mt: 1,
                                        }}
                                    >
                                        <Box
                                            className="progress-bar-fill"
                                            sx={{
                                                width: `${goal.progress}%`,
                                                backgroundColor: goal.progress === 100 ? '#4caf50' : '#1976d2',
                                                height: '100%',
                                                borderRadius: '5px',
                                            }}
                                        />
                                    </Box>
                                    <Typography sx={{ mt: 1 }}>{goal.progress}% 완료</Typography>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => handleOpenDialog(goal)}
                                        sx={{ mt: 1 }}
                                    >
                                        업데이트
                                    </Button>
                                </Box>
                            ))
                        )}
                    </Box>
                </Grid>

                {/* 목표 차트 - 비율 2 */}
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom>목표 진행 차트</Typography>
                    <Box sx={{ height: '100%' }}>
                        <GoalProgressChart goalProgress={goalProgress} />
                    </Box>
                </Grid>
            </Grid>

            {/* 팝업 다이얼로그 */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle>목표 진행률 업데이트</DialogTitle>
                <DialogContent sx={{ padding: '20px' }}>
                    <TextField
                        label="진행률 (0-100%)"
                        type="number"
                        fullWidth
                        value={progressValue}
                        onChange={(e) => setProgressValue(parseFloat(e.target.value))}
                        inputProps={{ min: 0, max: 100 }}
                        sx={{ marginTop: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="secondary">
                        취소
                    </Button>
                    <Button onClick={handleProgressUpdate} color="primary">
                        저장
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default GoalProgress;
