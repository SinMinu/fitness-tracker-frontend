import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Card,
    CardContent,
    Button,
    CardActions
} from '@mui/material';
import '../styles.css'; // Custom CSS 추가

function ExerciseRecords() {
    const [exerciseRecords, setExerciseRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 월은 0부터 시작하므로 +1

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('jwtToken');

        if (!userId || !token) {
            alert('운동 기록을 보려면 로그인해야 합니다.');
            return;
        }

        const fetchExerciseRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setExerciseRecords(response.data);
            } catch (error) {
                console.error(error);
                alert('운동 기록을 불러오지 못했습니다. 다시 시도해주세요.');
            }
        };

        fetchExerciseRecords();
    }, []);

    useEffect(() => {
        const filterRecordsByMonth = () => {
            const filtered = exerciseRecords.filter(record => {
                const recordDate = new Date(record.exerciseDate);
                return (
                    recordDate.getFullYear() === selectedYear &&
                    recordDate.getMonth() + 1 === selectedMonth
                );
            });
            setFilteredRecords(filtered);
        };

        filterRecordsByMonth();
    }, [exerciseRecords, selectedMonth, selectedYear]);

    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>운동 기록</Typography>

            {/* 년도와 월 선택 드롭다운 */}
            <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
                <Grid item>
                    <FormControl variant="outlined">
                        <InputLabel>년도</InputLabel>
                        <Select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                            label="년도"
                            sx={{ width: 150 }}
                        >
                            {[2024, 2023, 2022].map(year => (
                                <MenuItem key={year} value={year}>{year}년</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <FormControl variant="outlined">
                        <InputLabel>월</InputLabel>
                        <Select
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                            label="월"
                            sx={{ width: 120 }}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => (
                                <MenuItem key={month} value={month}>{month}월</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            {/* 운동 기록 카드들 */}
            <Grid container spacing={3} justifyContent="center">
                {filteredRecords.length === 0 ? (
                    <Typography variant="h6" align="center" sx={{ width: '100%' }}>
                        운동 기록이 없습니다.
                    </Typography>
                ) : (
                    filteredRecords.map((record) => (
                        <Grid item xs={12} sm={6} md={2.4} key={record.id}> {/* 5개씩 배열되도록 설정 */}
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRadius: 2,
                                    boxShadow: 3,
                                    backgroundColor: '#fff'
                                }}
                            >
                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {record.exerciseName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1.5 }}>
                                        유형: {record.exerciseType}
                                    </Typography>
                                    <Typography color="textSecondary" sx={{ mb: 1.5 }}>
                                        지속 시간: {record.duration} 분
                                    </Typography>
                                    <Typography variant="body2">
                                        소모 칼로리: {record.caloriesBurned} kcal
                                    </Typography>
                                    <Typography variant="body2">
                                        날짜: {new Date(record.exerciseDate).toLocaleDateString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        component={Link}
                                        to={`/exercise-detail/${record.id}`}
                                        size="small"
                                        color="primary"
                                    >
                                        자세히 보기
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
}

export default ExerciseRecords;
