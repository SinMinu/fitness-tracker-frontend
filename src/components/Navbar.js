// src/components/Navbar.js
import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import '../styles.css';

function Navbar() {
    const { isAuthenticated, logout, user, jwtToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);

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
        alert('You have been logged out.');
        navigate('/login');
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

    const handleMarkAllAsRead = async () => {
        try {
            await Promise.all(
                notifications.filter((notification) => !notification.isRead).map((notification) =>
                    axios.put(`http://localhost:8080/api/notifications/mark-as-read/${notification.id}`, {}, {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    })
                )
            );
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({ ...notification, isRead: true }))
            );
            alert('All notifications marked as read.');
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    return (
        <nav className="navbar">
            <h2>Fitness Tracker</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                {!isAuthenticated ? (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/add-exercise">Add Exercise</Link></li>
                        <li><Link to="/exercise-records">Exercise Records</Link></li>
                        <li><Link to="/add-goal">Add Goal</Link></li>
                        <li><Link to="/goal-records">Goal Records</Link></li>
                        <li><Link to="/goal-progress">Goal Progress</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li>
                            <div className="notification-dropdown">
                                <button className="notification-button">Notifications ({notifications.length})</button>
                                <div className="notification-dropdown-content">
                                    {notifications.length === 0 ? (
                                        <p>No notifications</p>
                                    ) : (
                                        <>
                                            <button onClick={handleMarkAllAsRead} className="mark-all-button">Mark All as Read</button>
                                            {notifications.map((notification) => (
                                                <div key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                                    <p>{notification.message}</p>
                                                    {!notification.isRead && (
                                                        <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                                                    )}
                                                </div>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
