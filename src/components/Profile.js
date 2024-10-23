import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';

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

            // 비밀번호가 입력된 경우에만 추가
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
        return <p>Loading...</p>;
    }

    return (
        <div className="profile-container">
            <h2>Your Profile</h2>
            <form onSubmit={handleUpdateProfile} className="profile-form">
                <div className="form-group">
                    <label htmlFor="username">아이디 :</label>
                    <input
                        type="text"
                        id="username"
                        className="profile-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">이메일 :</label>
                    <input
                        type="email"
                        id="email"
                        className="profile-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">비밀번호 :</label>
                    <input
                        type="password"
                        id="password"
                        className="profile-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password (leave blank if not changing)"
                    />
                </div>
                <button type="submit" className="update-button">Update Profile</button>
            </form>
        </div>
    );
}

export default Profile;