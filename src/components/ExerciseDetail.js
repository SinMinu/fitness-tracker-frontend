import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import {TextField, Button, CircularProgress, Box, Typography} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// 차트에 필요한 설정 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ExerciseDetail() {
    const { recordId } = useParams();
    const { jwtToken } = useContext(AuthContext);
    const [exerciseRecord, setExerciseRecord] = useState(null);
    const [editing, setEditing] = useState(false); // 수정 모드 여부
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();

    const [feedback, setFeedback] = useState(''); // 피드백 상태

    useEffect(() => {
        const fetchExerciseRecord = async () => {
            if (!jwtToken) {
                console.error('토큰이 없습니다.');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/exercise-records/${recordId}`, {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                });
                setExerciseRecord(response.data);
                generateFeedback(response.data); // 피드백 생성
            } catch (error) {
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        if (recordId) {
            fetchExerciseRecord();
        }
    }, [recordId, jwtToken]);

    // 피드백 생성 함수
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

    // 수정 후 저장 기능
    const handleSave = async () => {
        setLoading(true);
        const userId = localStorage.getItem('userId');

        try {
            console.log("보내는 데이터:", exerciseRecord); // 보낼 데이터 확인
            const response = await axios.put(
                `http://localhost:8080/api/exercise-records/user/${userId}/record/${exerciseRecord.id}`,
                exerciseRecord,
                { headers: { Authorization: `Bearer ${jwtToken}` } }
            );

            console.log('응답 데이터:', response.data); // 응답 데이터 확인
            alert('운동 기록이 성공적으로 수정되었습니다.');
            setExerciseRecord(response.data);
            generateFeedback(response.data); // 수정 후 피드백 업데이트
            setEditing(false); // 저장 후 수정 모드 해제
        } catch (error) {
            console.error('운동 기록 수정에 실패했습니다:', error);
        } finally {
            setLoading(false);
        }
    };

    // 삭제 기능
    const handleDelete = async () => {
        if (window.confirm('이 운동 기록을 삭제하시겠습니까?')) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8080/api/exercise-records/record/${recordId}`, {
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });
                alert('운동 기록이 삭제되었습니다.');
                navigate('/exercise-records'); // 삭제 후 목록으로 이동
            } catch (error) {
                console.error('운동 기록 삭제에 실패했습니다:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    // `null` 값 체크 후 빈 문자열로 처리
    const safeValue = (value) => (value === null || value === undefined ? '' : value);

    // 운동 시간 차트 데이터 설정
    const durationChartData = {
        labels: ['운동 시간 (분)'],
        datasets: [
            {
                label: '운동 시간',
                data: exerciseRecord ? [exerciseRecord.duration] : [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    // 소모 칼로리 차트 데이터 설정
    const caloriesChartData = {
        labels: ['소모 칼로리 (kcal)'],
        datasets: [
            {
                label: '소모 칼로리',
                data: exerciseRecord ? [exerciseRecord.caloriesBurned] : [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    if (!exerciseRecord) {
        return (
            <Box display="flex" alignItems="center" justifyContent="center" height="80vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ ml: 2 }}>로딩 중입니다...</Typography>
            </Box>
        );
    }

    return (
        <div className="exercise-detail-container">
            <h2>운동 상세 정보</h2>
            {editing ? (
                <form>
                    {/* 수정 필드들 */}
                    <TextField
                        label="이름"
                        value={safeValue(exerciseRecord.exerciseName)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, exerciseName: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="유형"
                        value={safeValue(exerciseRecord.exerciseType)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, exerciseType: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="지속 시간"
                        type="number"
                        value={safeValue(exerciseRecord.duration)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, duration: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="소모 칼로리"
                        type="number"
                        value={safeValue(exerciseRecord.caloriesBurned)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, caloriesBurned: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="운동 장소"
                        value={safeValue(exerciseRecord.location)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, location: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="사용한 장비"
                        value={safeValue(exerciseRecord.equipment)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, equipment: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="운동 강도"
                        value={safeValue(exerciseRecord.intensity)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, intensity: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="메모"
                        value={safeValue(exerciseRecord.notes)}
                        onChange={(e) => setExerciseRecord({ ...exerciseRecord, notes: e.target.value })}
                        fullWidth
                        margin="normal"
                        multiline
                        rows={4}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={handleSave}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : '저장'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={() => setEditing(false)}
                        >
                            취소
                        </Button>
                    </Box>
                </form>
            ) : (
                <div>
                    <p><strong>이름:</strong> {exerciseRecord.exerciseName}</p>
                    <p><strong>유형:</strong> {exerciseRecord.exerciseType}</p>
                    <p><strong>지속 시간:</strong> {exerciseRecord.duration} 분</p>
                    <p><strong>소모 칼로리:</strong> {exerciseRecord.caloriesBurned} kcal</p>
                    <p><strong>운동 장소:</strong> {exerciseRecord.location}</p>
                    <p><strong>사용한 장비:</strong> {exerciseRecord.equipment}</p>
                    <p><strong>운동 강도:</strong> {exerciseRecord.intensity}</p>
                    <p><strong>메모:</strong> {exerciseRecord.notes}</p>
                    {/* 운동 피드백 */}
                    <p style={{ fontWeight: 'bold', color: 'green' }}>운동 피드백: {feedback}</p>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={() => setEditing(true)}
                        >
                            수정
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={handleDelete}
                        >
                            삭제
                        </Button>
                    </Box>

                    {/* 운동 시간과 소모 칼로리 차트를 가로로 나란히 배열 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                        {/* 운동 시간 차트 */}
                        <Box sx={{ flex: 1, mr: 2 }}>
                            <h3>운동 시간 (분)</h3>
                            <Bar data={durationChartData} />
                        </Box>

                        {/* 소모 칼로리 차트 */}
                        <Box sx={{ flex: 1, ml: 2 }}>
                            <h3>소모 칼로리 (kcal)</h3>
                            <Bar data={caloriesChartData} />
                        </Box>
                    </Box>
                </div>
            )}
        </div>
    );
}

export default ExerciseDetail;
