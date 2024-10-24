import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import GoalProgressChart from './GoalProgressChart';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
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
    }, [user, jwtToken]); // 의존성 배열에 user와 jwtToken만 포함


    const handleProgressUpdate = async () => {
        console.log("업데이트할 진행률 값:", progressValue); // 값 확인
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
        setProgressValue(goal.progress); // 현재 진행률 값으로 초기화
        setOpenDialog(true);
    };

    return (
        <div className="goal-progress-container">
            <h2>목표 진행 상황</h2>
            {goalProgress.length === 0 ? (
                <p>등록된 목표가 없습니다.</p>
            ) : (
                <>
                    <GoalProgressChart goalProgress={goalProgress} />
                    <div className="goal-cards-container">
                        {goalProgress.map((goal) => (
                            <div key={goal.goalId} className="goal-progress-card">
                                <h3>{goal.goalDescription}</h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${goal.progress}%` }}
                                    ></div>
                                </div>
                                <p>{goal.progress}% 완료</p>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleOpenDialog(goal)}
                                >
                                    업데이트
                                </Button>
                            </div>
                        ))}
                    </div>
                </>
            )}

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
        </div>
    );
}

export default GoalProgress;
