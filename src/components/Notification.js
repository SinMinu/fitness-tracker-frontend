import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

function Notifications() {
    const { user, jwtToken } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user || !jwtToken) {
                alert('You need to be logged in to view notifications.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/notifications/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setNotifications(response.data);
            } catch (error) {
                console.error(error);
                alert('Failed to fetch notifications. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [user, jwtToken]);

    const handleMarkAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8080/api/notifications/mark-as-read/${notificationId}`, {}, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setNotifications(notifications.map((notification) =>
                notification.id === notificationId ? { ...notification, isRead: true } : notification
            ));
        } catch (error) {
            console.error(error);
            alert('Failed to mark notification as read. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading notifications...</p>;
    }

    return (
        <div className="notifications-container">
            <h2>Notifications</h2>
            {notifications.length === 0 ? (
                <p>No notifications available.</p>
            ) : (
                <ul className="notifications-list">
                    {notifications.map((notification) => (
                        <li key={notification.id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                            <p>{notification.message}</p>
                            {!notification.isRead && (
                                <button onClick={() => handleMarkAsRead(notification.id)} className="mark-as-read-button">Mark as Read</button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Notifications;
