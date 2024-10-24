import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress, Paper, Grid } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../CustomCalendar.css';

// 대한민국 법정 공휴일 (2024년 기준)
const holidays = [
    '2024-01-01', // 신정
    '2024-02-09', // 설날 연휴 시작
    '2024-02-10', // 설날
    '2024-02-11', // 설날 연휴 끝
    '2024-03-01', // 삼일절
    '2024-05-05', // 어린이날
    '2024-05-15', // 부처님 오신 날
    '2024-06-06', // 현충일
    '2024-08-15', // 광복절
    '2024-09-16', // 추석 연휴 시작
    '2024-09-17', // 추석
    '2024-09-18', // 추석 연휴 끝
    '2024-10-03', // 개천절
    '2024-10-09', // 한글날
    '2024-12-25', // 성탄절
];

function Profile() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [exerciseRecords, setExerciseRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user || !jwtToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const fetchUserProfile = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/users/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setUsername(response.data.username);
                setEmail(response.data.email);
                setIsLoading(false);
            } catch (error) {
                console.error('사용자 프로필을 불러오지 못했습니다.', error);
            }
        };

        const fetchExerciseRecords = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setExerciseRecords(response.data);
            } catch (error) {
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        fetchUserProfile();
        fetchExerciseRecords();
    }, [isAuthenticated, navigate, user, jwtToken]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            const requestData = { username, email };
            if (password) {
                requestData.password = password;
            }

            await axios.put(`http://localhost:8080/api/users/${user.id}`, requestData, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'application/json',
                },
            });
            alert('프로필이 성공적으로 업데이트되었습니다.');
        } catch (error) {
            console.error('프로필 업데이트에 실패했습니다.', error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const isHoliday = holidays.includes(date.toISOString().slice(0, 10));
            if (date.getDay() === 0 || isHoliday) {
                return 'sunday-tile'; // 일요일 및 공휴일 스타일
            } else if (date.getDay() === 6) {
                return 'saturday-tile'; // 토요일 스타일
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

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Grid container spacing={3}>
                {/* 프로필 정보 수정 섹션 */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" component="h2" gutterBottom>프로필 정보</Typography>
                        <form onSubmit={handleUpdateProfile} className="profile-form">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="아이디"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="이메일"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="비밀번호"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="비밀번호 (변경하지 않을 경우 빈 칸으로 두세요)"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                프로필 업데이트
                            </Button>
                        </form>
                    </Paper>
                </Grid>

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
            </Grid>
        </Container>
    );
}

export default Profile;
