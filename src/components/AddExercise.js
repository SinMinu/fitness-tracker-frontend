import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
import { Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';

function AddExercise() {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [exerciseDate, setExerciseDate] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            alert('운동 기록을 추가하려면 로그인해야 합니다.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `http://localhost:8080/api/exercise-records/user/${userId}`,
                {
                    exerciseName,
                    exerciseType,
                    duration,
                    caloriesBurned,
                    exerciseDate,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(response.data);
            alert('운동 기록이 성공적으로 추가되었습니다!');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.status === 403) {
                alert('이 작업을 수행할 권한이 없습니다. 자격 증명을 확인하세요.');
            } else {
                alert('운동 기록 추가에 실패했습니다. 다시 시도해주세요.');
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
                    운동 기록 추가
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="운동 이름"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={exerciseName}
                        onChange={(e) => setExerciseName(e.target.value)}
                    />
                    <TextField
                        label="운동 종류"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={exerciseType}
                        onChange={(e) => setExerciseType(e.target.value)}
                    />
                    <TextField
                        label="운동 시간 (분)"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                    <TextField
                        label="소모 칼로리"
                        type="number"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={caloriesBurned}
                        onChange={(e) => setCaloriesBurned(e.target.value)}
                    />
                    <TextField
                        label="운동 날짜"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        value={exerciseDate}
                        onChange={(e) => setExerciseDate(e.target.value)}
                    />
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : '운동 추가'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default AddExercise;
