import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress } from '@mui/material';

function Profile() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated || !user || !jwtToken) {
            alert('You need to be logged in to view this page.');
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
                alert('Failed to fetch user profile. Please try again.');
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, navigate, user, jwtToken]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        if (!isAuthenticated || !user || !jwtToken) {
            alert('You need to be logged in to update your profile.');
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
            alert('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update profile. Please try again.');
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Container maxWidth="sm" className="profile-container">
            <Typography variant="h4" component="h2" gutterBottom>Your Profile</Typography>
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
                    placeholder="Password (leave blank if not changing)"
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="update-button"
                    sx={{ mt: 2 }}
                >
                    Update Profile
                </Button>
            </form>
        </Container>
    );
}

export default Profile;
