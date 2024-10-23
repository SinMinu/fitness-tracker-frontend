import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

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
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default Login;
