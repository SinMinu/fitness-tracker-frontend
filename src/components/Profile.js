import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress, Paper, Grid } from '@mui/material';

function Profile() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(true);
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
                console.error(error);
                alert('사용자 프로필을 가져오지 못했습니다. 다시 시도해주세요.');
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, navigate, user, jwtToken]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!isAuthenticated || !user || !jwtToken) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        try {
            const requestData = {
                username,
                email,
            };

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
            console.error(error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
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
                {/* 나의 프로필 박스 */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 4, height: '100%' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            나의 프로필
                        </Typography>
                        <form onSubmit={handleUpdateProfile}>
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

                {/* 나의 캘린더 박스 */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ padding: 4, height: '100%' }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            나의 캘린더
                        </Typography>
                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
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
