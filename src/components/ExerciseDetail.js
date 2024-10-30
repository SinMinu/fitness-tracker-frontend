import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Container, Paper, Button, CircularProgress, Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import ShareExerciseRecord from './ShareExerciseRecord';

ChartJS.register(ArcElement, Tooltip, Legend);

// centerTextPlugin을 컴포넌트 외부에 정의하여 원하는 차트에만 적용
const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart) => {
        const { ctx, width, height } = chart;
        ctx.save();
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const duration = chart.config.data.datasets[0].data[0];
        const caloriesBurned = chart.config.data.datasets[1].data[0];

        ctx.fillText(`소모 칼로리: ${caloriesBurned} kcal`, width / 2, height / 2 - 10);
        ctx.fillText(`운동 시간: ${duration} 분`, width / 2, height / 2 + 20);
        ctx.restore();
    }
};

function ExerciseDetail() {
    const { recordId } = useParams();
    const { jwtToken } = useContext(AuthContext);
    const [exerciseRecord, setExerciseRecord] = useState(null);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState(false);
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState('');
    const userId = localStorage.getItem('userId');
    const [combinedChartData, setCombinedChartData] = useState(null);

    useEffect(() => {
        const fetchExerciseRecord = async () => {
            if (!jwtToken) return;

            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/${recordId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setExerciseRecord(response.data);
                generateFeedback(response.data);
            } catch (error) {
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        if (recordId) {
            fetchExerciseRecord();
        }
    }, [recordId, jwtToken]);

    const generateFeedback = (record) => {
        let message = '';
        const { intensity, duration, caloriesBurned } = record;

        if (intensity === '높음' && duration >= 60) {
            message += '운동 강도와 시간이 매우 높습니다! 휴식이 필요할 수 있습니다. ';
        } else if (intensity === '보통' && duration >= 30) {
            message += '적당한 강도로 잘 운동하셨습니다! ';
        } else if (intensity === '낮음' || duration < 30) {
            message += '조금 더 운동 시간을 늘리거나 강도를 높이는 것을 고려해 보세요. ';
        }

        if (caloriesBurned > 500) {
            message += '칼로리 소모가 매우 높습니다! 멋진 운동이었습니다!';
        } else if (caloriesBurned > 200) {
            message += '적절한 칼로리 소모량입니다.';
        } else {
            message += '칼로리 소모가 적습니다. 좀 더 강도 높은 운동을 시도해 보세요.';
        }

        setFeedback(message);
    };

    const handleSave = async () => {
        setLoading(true);

        try {
            const response = await axios.put(
                `http://localhost:8080/api/exercise-records/user/${userId}/record/${exerciseRecord.id}`,
                exerciseRecord,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );
            alert('운동 기록이 성공적으로 수정되었습니다.');
            const updatedRecord = response.data;
            setExerciseRecord(updatedRecord);
            generateFeedback(updatedRecord);
            updateChartData(updatedRecord);  // 차트 데이터를 업데이트
            setEditing(false);
        } catch (error) {
            console.error('운동 기록 수정에 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateChartData = (record) => {
        setCombinedChartData({
            labels: ['운동 시간 (분)', '남은 시간', '소모 칼로리 (kcal)', '남은 칼로리'],
            datasets: [
                {
                    data: [
                        Math.min(record.duration, 60),
                        60 - Math.min(record.duration, 60)
                    ],
                    backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(230, 230, 230, 0.4)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(200, 200, 200, 0.2)'],
                    borderWidth: 1,
                    hoverOffset: 4,
                    cutout: '60%',
                },
                {
                    data: [
                        Math.min(record.caloriesBurned, 500),
                        500 - Math.min(record.caloriesBurned, 500)
                    ],
                    backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(230, 230, 230, 0.4)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(200, 200, 200, 0.2)'],
                    borderWidth: 1,
                    hoverOffset: 4,
                },
            ],
        });
    };

    useEffect(() => {
        if (exerciseRecord) {
            updateChartData(exerciseRecord);
        }
    }, [exerciseRecord]);

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: false,
            },
        },
    };

    const handleDelete = async () => {
        if (window.confirm('이 운동 기록을 삭제하시겠습니까?')) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8080/api/exercise-records/record/${recordId}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                alert('운동 기록이 삭제되었습니다.');
                navigate('/exercise-records');
            } catch (error) {
                console.error('운동 기록 삭제에 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const safeValue = (value) => (value === null || value === undefined ? '' : value);

    if (!exerciseRecord || !combinedChartData) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>로딩 중입니다...</Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom>운동 상세 정보</Typography>
                <Typography><strong>이름:</strong> {exerciseRecord.exerciseName}</Typography>
                <Typography><strong>유형:</strong> {exerciseRecord.exerciseType}</Typography>
                <Typography><strong>지속 시간:</strong> {exerciseRecord.duration} 분</Typography>
                <Typography><strong>소모 칼로리:</strong> {exerciseRecord.caloriesBurned} kcal</Typography>
                <Typography><strong>운동 장소:</strong> {exerciseRecord.location}</Typography>
                <Typography><strong>사용한 장비:</strong> {exerciseRecord.equipment}</Typography>
                <Typography><strong>운동 강도:</strong> {exerciseRecord.intensity}</Typography>
                <Typography><strong>메모:</strong> {exerciseRecord.notes}</Typography>
                <Typography style={{ fontWeight: 'bold', color: 'green' }}>운동 피드백: {feedback}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setEditing(true)}
                        sx={{ width: '150px' }}
                    >
                        수정
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleDelete}
                        sx={{ ml: 2, width: '150px' }}
                    >
                        삭제
                    </Button>
                </Box>
                <Dialog open={editing} onClose={() => setEditing(false)} maxWidth="sm" fullWidth>
                    <DialogTitle>운동 기록 수정</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="이름"
                            value={safeValue(exerciseRecord?.exerciseName)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, exerciseName: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="유형"
                            value={safeValue(exerciseRecord?.exerciseType)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, exerciseType: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="지속 시간"
                            type="number"
                            value={safeValue(exerciseRecord?.duration)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, duration: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="소모 칼로리"
                            type="number"
                            value={safeValue(exerciseRecord?.caloriesBurned)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, caloriesBurned: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="운동 장소"
                            value={safeValue(exerciseRecord?.location)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, location: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="사용한 장비"
                            value={safeValue(exerciseRecord?.equipment)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, equipment: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="운동 강도"
                            value={safeValue(exerciseRecord?.intensity)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, intensity: e.target.value })}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="메모"
                            value={safeValue(exerciseRecord?.notes)}
                            onChange={(e) => setExerciseRecord({ ...exerciseRecord, notes: e.target.value })}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleSave} color="primary" variant="contained">
                            저장
                        </Button>
                        <Button
                            onClick={() => setEditing(false)}
                            color="secondary"
                            variant="outlined"
                            sx={{
                                color: 'black',
                                borderColor: 'black',
                            }}
                        >
                            취소
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <ShareExerciseRecord record={exerciseRecord} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Box sx={{ width: '250px', height: '250px' }}>
                        <Doughnut
                            data={combinedChartData}
                            options={chartOptions}
                            plugins={[centerTextPlugin]}  // 여기서만 centerTextPlugin 사용
                        />
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default ExerciseDetail;
