import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Box, CircularProgress, Typography, Paper } from '@mui/material';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });
            console.log('Response data:', response.data);

            // 서버 응답에서 jwtToken과 userId를 정확하게 받아옴
            const { jwtToken, userId } = response.data;

            if (jwtToken && userId) {
                // 항상 localStorage에 저장
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('userId', userId);

                // AuthContext에 로그인 상태 업데이트
                login(jwtToken, { id: userId, username });

                alert('Login successful!');
                navigate('/'); // 로그인 후 메인 페이지로 이동
            } else {
                console.error('Failed to get the necessary data from the response');
                alert('Login failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            alert('Login failed. Please try again.');
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
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Login
                </Typography>
                <form onSubmit={handleSubmit} className="form-container">
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box sx={{ marginTop: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Login'}
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}

export default Login;
