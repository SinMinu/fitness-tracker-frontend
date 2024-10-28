import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';
import { Box, Button, CircularProgress, Paper, TextField, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddExercise() {
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseType, setExerciseType] = useState('');
    const [duration, setDuration] = useState('');
    const [caloriesBurned, setCaloriesBurned] = useState('');
    const [exerciseDate, setExerciseDate] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        // 오늘 날짜를 YYYY-MM-DD 형식으로 변환하여 기본값으로 설정
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        setExerciseDate(formattedDate);
    }, []);

    // 운동 종류 목록
    const exerciseTypes = [
        '웨이트 트레이닝', '유산소 운동', '요가', '스트레칭', '러닝', '수영', '사이클링', '필라테스',
        '킥복싱', '크로스핏', '하이킹', '댄스', '배드민턴', '테니스', '농구', '축구', '스쿼시', '스키', '클라이밍', '걷기',
    ];

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
            await axios.post(
                `http://localhost:8080/api/exercise-records/user/${userId}`,
                { exerciseName, exerciseType, duration, caloriesBurned, exerciseDate },
                { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
            );
            alert('운동 기록이 성공적으로 추가되었습니다!');
            navigate('/exercise-records');
        } catch (error) {
            console.error(error);
            alert('운동 기록 추가에 실패했습니다. 다시 시도해주세요.');
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
                height: '90vh',
            }}
        >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: 550 }}>
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
                        select
                        value={exerciseType}
                        onChange={(e) => setExerciseType(e.target.value)}
                        SelectProps={{
                            MenuProps: {
                                PaperProps: { style: { maxHeight: 200, overflowY: 'auto' } },
                            },
                        }}
                    >
                        {exerciseTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </TextField>
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
