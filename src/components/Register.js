import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

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
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} className="form-container">
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
}

export default Register;
