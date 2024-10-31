import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

function NotificationSettings() {
    const { user, jwtToken } = useContext(AuthContext);
    const [settings, setSettings] = useState({
        GOAL_ACHIEVEMENT: false,
        APPROACHING_GOAL_END: false,
        GOAL_END: false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            if (!jwtToken) {
                console.error("JWT 토큰이 없습니다.");
                return;
            }
            console.log("사용 중인 JWT 토큰:", jwtToken);
            try {
                const response = await axios.get(`http://localhost:8080/api/notification-settings/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                console.log("Fetched settings:", response.data); // 가져온 설정 확인
                setSettings(response.data);
            } catch (error) {
                console.error("Failed to fetch notification settings", error);
                alert("알림 설정을 가져오는 중 문제가 발생했습니다.");
            }
        };

        if (user && jwtToken) {
            fetchSettings();
        }
    }, [user, jwtToken]);

    const handleSettingChange = async (type) => {
        try {
            const updatedSettings = {
                ...settings,
                [type]: !settings[type],
            };
            await axios.put(`http://localhost:8080/api/notification-settings/${user.id}`, updatedSettings, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
            });
            setSettings(updatedSettings);
            console.log("Updated settings:", updatedSettings); // 업데이트 확인
        } catch (error) {
            console.error('Failed to update notification settings', error);
            alert('알림 설정을 업데이트하는 중 문제가 발생했습니다.');
        }
    };

    return (
        <div className="notification-settings-container">
            <h2>알림 설정</h2>
            <div className="notification-settings-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.GOAL_ACHIEVEMENT}
                        onChange={() => handleSettingChange('GOAL_ACHIEVEMENT')}
                    />
                    목표 달성 알림
                </label>
            </div>
            <div className="notification-settings-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.APPROACHING_GOAL_END}
                        onChange={() => handleSettingChange('APPROACHING_GOAL_END')}
                    />
                    목표 종료일 접근 알림
                </label>
            </div>
            <div className="notification-settings-item">
                <label>
                    <input
                        type="checkbox"
                        checked={settings.GOAL_END}
                        onChange={() => handleSettingChange('GOAL_END')}
                    />
                    목표 종료 알림
                </label>
            </div>
        </div>
    );
}

export default NotificationSettings;
