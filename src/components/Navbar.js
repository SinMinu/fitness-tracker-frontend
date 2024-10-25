import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

function Navbar() {
    const { isAuthenticated, logout, user, jwtToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (isAuthenticated && user && jwtToken) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    });
                    setNotifications(response.data);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            }
        };

        fetchNotifications();
    }, [isAuthenticated, user, jwtToken]);

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

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/mark-as-read/${notificationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
            );
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        피트니스 트래커
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* 그룹 1: 일반 */}
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
                                {/* 그룹 2: 운동 관련 */}
                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#e0f7fa' }}>
                                    <Button color="inherit" component={Link} to="/add-exercise">운동 추가</Button>
                                    <Button color="inherit" component={Link} to="/exercise-records">운동 기록</Button>
                                    <Button color="inherit" component={Link} to="/exercise-chart">운동 기록 차트</Button> {/* 차트 추가 */}
                                    <Button color="inherit" component={Link} to="/recommendations">추천 운동</Button>
                                </Paper>

                                {/* 그룹 3: 목표 관련 */}
                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#ffe0b2' }}>
                                    <Button color="inherit" component={Link} to="/add-goal">목표 추가</Button>
                                    <Button color="inherit" component={Link} to="/goal-records">목표 기록</Button>
                                    <Button color="inherit" component={Link} to="/goal-progress">목표 진행 상황</Button>
                                </Paper>

                                {/* 그룹 4: 프로필 및 알림 */}
                                <Paper elevation={3} sx={{ padding: '0 10px', backgroundColor: '#f3e5f5' }}>
                                    <Button color="inherit" component={Link} to="/profile">프로필</Button>
                                    <IconButton color="inherit" onClick={handleMenuOpen}>
                                        <Badge badgeContent={notifications.length} color="secondary">
                                            <NotificationsIcon />
                                        </Badge>
                                    </IconButton>
                                </Paper>

                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    {notifications.length === 0 ? (
                                        <MenuItem onClick={handleMenuClose}>알림이 없습니다</MenuItem>
                                    ) : (
                                        notifications.map((notification) => (
                                            <MenuItem key={notification.id} onClick={() => handleMarkAsRead(notification.id)}>
                                                {notification.message}
                                            </MenuItem>
                                        ))
                                    )}
                                </Menu>

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
