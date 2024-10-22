import React, { useState } from 'react';
import axios from 'axios';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username,
                password,
            });
            console.log('Response data:', response.data);

            // 서버 응답에서 jwtToken과 userId를 정확하게 받아옴
            const { jwtToken, userId } = response.data;

            if (jwtToken && userId) {
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('userId', userId);
            } else {
                console.error('Failed to get the necessary data from the response');
            }

            alert('Login successful!');
        } catch (error) {
            console.error(error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
