import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, CircularProgress, Box } from '@mui/material';

function ExerciseDetail() {
    const { recordId } = useParams();
    const { jwtToken } = useContext(AuthContext);
    const [exerciseRecord, setExerciseRecord] = useState(null);
    const [editing, setEditing] = useState(false); // 수정 모드 여부
    const [loading, setLoading] = useState(false); // 로딩 상태
    const navigate = useNavigate();

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
            } catch (error) {
                console.error('운동 기록을 불러오지 못했습니다:', error);
            }
        };

        if (recordId) {
            fetchExerciseRecord();
        }
    }, [recordId, jwtToken]);

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

            // 성공적으로 수정되었으므로, 다시 불러온다.
            setExerciseRecord(response.data);
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
                await axios.delete(`http://localhost:8080/api/exercise-records/${recordId}`, {
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

    if (!exerciseRecord) {
        return <p>로딩 중...</p>;
    }

    return (
        <div className="exercise-detail-container">
            <h2>운동 상세 정보</h2>
            {editing ? (
                <form>
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
                    {/* 추가된 필드 */}
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
                            onClick={handleSave} // 저장 버튼으로 동작
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : '저장'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={() => setEditing(false)} // 취소 버튼 동작
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
                    {/* 추가된 필드 표시 */}
                    <p><strong>운동 장소:</strong> {exerciseRecord.location}</p>
                    <p><strong>사용한 장비:</strong> {exerciseRecord.equipment}</p>
                    <p><strong>운동 강도:</strong> {exerciseRecord.intensity}</p>
                    <p><strong>메모:</strong> {exerciseRecord.notes}</p>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ mx: 2, width: '150px' }}
                            onClick={() => setEditing(true)} // 수정 모드로 전환
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
                </div>
            )}
        </div>
    );
}

export default ExerciseDetail;
