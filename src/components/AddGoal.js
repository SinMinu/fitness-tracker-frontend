import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';

function AddGoal() {
    const [goalName, setGoalName] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [targetValue, setTargetValue] = useState(100); // 목표 값은 고정된 100으로 설정
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        if (!userId || !token) {
            alert('로그인이 필요합니다.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/goals/user/${userId}`,
                {
                    goalName,
                    goalDescription,
                    startDate,
                    endDate,
                    targetValue, // 목표 값은 항상 100
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);
            alert('목표가 성공적으로 추가되었습니다!');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('목표를 설정할 권한이 없습니다. 자격 증명을 확인하세요.');
            } else {
                alert('목표 추가에 실패했습니다. 다시 시도해 주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 600 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    새로운 목표 추가
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="목표 이름"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={goalName}
                        onChange={(e) => setGoalName(e.target.value)}
                    />
                    <TextField
                        label="목표 설명"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        value={goalDescription}
                        onChange={(e) => setGoalDescription(e.target.value)}
                    />
                    <TextField
                        label="시작 날짜"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <TextField
                        label="종료 날짜"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {/* 목표 값은 수정 불가하고 100으로 고정 */}
                    <TextField
                        label="목표 값"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={targetValue}
                        disabled // 수정 불가능하게 설정
                    />
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : '목표 추가'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AddGoal;
