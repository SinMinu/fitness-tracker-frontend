import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CustomCalendar.css';
import { Container, Paper, Grid, Typography, Box, CircularProgress } from '@mui/material';
import CaloriesTrendChart from '../components/CaloriesTrendChart';

function CombinedView() {
    const { jwtToken, user } = useContext(AuthContext);
    const [chartData, setChartData] = useState(null);
    const [exerciseRecords, setExerciseRecords] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const holidays = [
        '2024-01-01', '2024-02-09', '2024-02-10', '2024-02-11', '2024-03-01', '2024-05-05', '2024-05-15',
        '2024-06-06', '2024-08-15', '2024-09-16', '2024-09-17', '2024-09-18', '2024-10-03', '2024-10-09', '2024-12-25'
    ];

    useEffect(() => {
        const fetchExerciseData = async () => {
            try {
                const userId = localStorage.getItem('userId');
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                const exerciseRecords = response.data;
                setExerciseRecords(exerciseRecords);

                updateChartData(new Date(), exerciseRecords);
            } catch (error) {
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        fetchExerciseData();
    }, [jwtToken]);

    const updateChartData = (selectedDate, records) => {
        const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.exerciseDate);
            return (
                recordDate.getFullYear() === selectedDate.getFullYear() &&
                recordDate.getMonth() === selectedDate.getMonth() &&
                recordDate.getDate() === selectedDate.getDate()
            );
        });

        const labels = filteredRecords.map(record => record.exerciseName);
        const calories = filteredRecords.map(record => record.caloriesBurned);

        setChartData({
            labels,
            datasets: [
                {
                    label: '칼로리 소모량',
                    data: calories,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                },
            ],
        });
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        updateChartData(date, exerciseRecords);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isHoliday = holidays.includes(date.toISOString().slice(0, 10));
            if (date.getDay() === 0 || isHoliday) {
                return 'sunday-tile';
            } else if (date.getDay() === 6) {
                return 'saturday-tile';
            }
        }
        return null;
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const exerciseDate = exerciseRecords.find((record) => {
                const recordDate = new Date(record.exerciseDate);
                return (
                    recordDate.getFullYear() === date.getFullYear() &&
                    recordDate.getMonth() === date.getMonth() &&
                    recordDate.getDate() === date.getDate()
                );
            });
            return exerciseDate ? (
                <div style={{ backgroundColor: '#1976d2', borderRadius: '50%', width: '10px', height: '10px', margin: '0 auto' }}></div>
            ) : null;
        }
    };

    if (!chartData) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>로딩 중입니다...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 8 }}>
            <Grid container spacing={3}>
                {/* 캘린더 섹션 */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>나의 캘린더</Typography>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            tileContent={tileContent}
                            tileClassName={tileClassName}
                            locale="ko-KR"
                            className="custom-calendar"
                        />
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            선택된 날짜: {selectedDate.toLocaleDateString()}
                        </Typography>
                    </Paper>
                </Grid>

                {/* 운동 기록 차트 섹션 */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>운동 기록 차트</Typography>
                        <Bar data={chartData} />
                    </Paper>
                </Grid>

                {/* 운동 통계 섹션 */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 4, mt: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>운동 통계</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-around' }}>
                            <CaloriesTrendChart period="일주일" />
                            <CaloriesTrendChart period="한달" />
                            <CaloriesTrendChart period="분기" />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default CombinedView;
