import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress, Paper, Grid } from '@mui/material';

function Profile() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editing, setEditing] = useState(false); // 수정 모드 상태
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

        fetchUserProfile();
    }, [isAuthenticated, navigate, user, jwtToken]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        try {
            // 서버에 전송할 데이터에 항상 `username`을 포함시킴
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
            setEditing(false); // 수정 모드 해제
        } catch (error) {
            console.error('프로필 업데이트에 실패했습니다.', error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
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
                {/* 프로필 정보 섹션 */}
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" component="h2" gutterBottom>프로필 정보</Typography>
                        <form className="profile-form">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="아이디"
                                variant="outlined"
                                value={username}
                                disabled // 아이디는 수정 불가능하게 설정
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="이메일"
                                variant="outlined"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!editing} // 수정 모드일 때만 활성화
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
                                disabled={!editing} // 수정 모드일 때만 활성화
                            />
                            {editing ? (
                                <>
                                    <Button
                                        type="button" // 수정하기 버튼에서 `submit` 대신 `button` 사용
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={handleUpdateProfile} // 수정 버튼에서만 업데이트
                                    >
                                        수정하기
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        fullWidth
                                        sx={{ mt: 2 }}
                                        onClick={() => setEditing(false)} // 수정 취소
                                    >
                                        취소
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    onClick={() => setEditing(true)} // 수정 모드로 전환
                                >
                                    수정
                                </Button>
                            )}
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default Profile;
