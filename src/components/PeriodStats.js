// PeriodStats.js
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Box, Typography, CircularProgress, Select, MenuItem } from '@mui/material';

function PeriodStats() {
    const { jwtToken } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [period, setPeriod] = useState("daily");
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/user/${userId}/stats/${period}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                setStats(response.data);
            } catch (error) {
                console.error('통계 데이터를 불러오지 못했습니다:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [period, jwtToken, userId]);

    return (
        <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
            <Typography variant="h5" align="center">운동 통계</Typography>
            <Select value={period} onChange={(e) => setPeriod(e.target.value)} fullWidth>
                <MenuItem value="daily">일일 통계</MenuItem>
                <MenuItem value="weekly">주간 통계</MenuItem>
                <MenuItem value="monthly">월간 통계</MenuItem>
            </Select>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                stats && (
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body1">총 운동 횟수: {stats.totalSessions}</Typography>
                        <Typography variant="body1">평균 운동 시간: {stats.averageDuration.toFixed(2)} 분</Typography>
                    </Box>
                )
            )}
        </Box>
    );
}

export default PeriodStats;
