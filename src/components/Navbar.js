import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

function Navbar() {
    const { isAuthenticated, logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleLogout = () => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/login');
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        피트니스 트래커
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#f0f0f0' }}>
                            <Button color="inherit" component={Link} to="/">홈</Button>
                        </Paper>

                        {!isAuthenticated ? (
                            <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#f0f0f0' }}>
                                <Button color="inherit" component={Link} to="/register">회원가입</Button>
                                <Button color="inherit" component={Link} to="/login">로그인</Button>
                            </Paper>
                        ) : (
                            <>
                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#e0f7fa' }}>
                                    <Button color="inherit" component={Link} to="/add-exercise">운동 추가</Button>
                                    <Button color="inherit" component={Link} to="/exercise-records">운동 기록</Button>
                                    <Button color="inherit" component={Link} to="/exercise-chart">운동 기록 차트</Button>
                                    <Button color="inherit" component={Link} to="/recommendations">추천 운동</Button>
                                </Paper>

                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#ffe0b2' }}>
                                    <Button color="inherit" component={Link} to="/add-goal">목표 추가</Button>
                                    <Button color="inherit" component={Link} to="/goal-records">목표 기록</Button>
                                </Paper>

                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#f3e5f5' }}>
                                    <Button color="inherit" component={Link} to="/profile">프로필</Button>
                                </Paper>

                                <IconButton edge="end" color="inherit" onClick={handleLogout}>
                                    <AccountCircle />
                                </IconButton>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;
