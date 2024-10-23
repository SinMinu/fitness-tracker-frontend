import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, CircularProgress, Box } from '@mui/material';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 유효성 검사
        if (!username || !email || !password) {
            alert('All fields are required.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        setLoading(true); // 로딩 시작

        try {
            const response = await axios.post('http://localhost:8080/api/users/register', {
                username,
                email,
                password,
            });
            console.log(response.data);
            alert('Registration successful!');
            navigate('/login'); // 회원가입 성공 후 로그인 페이지로 이동
        } catch (error) {
            console.error(error);
            alert('Registration failed. Please try again.');
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Username"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Password"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Box sx={{ mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : 'Register'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}

export default Register;
