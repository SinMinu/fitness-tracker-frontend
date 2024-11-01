import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';
import { AuthContext } from '../context/AuthContext';
import { TextField, Button, Container, Typography, CircularProgress, Paper, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DaumPostcode from 'react-daum-postcode';

function Profile() {
    const { isAuthenticated, user, jwtToken } = useContext(AuthContext);
    const [profileData, setProfileData] = useState({
        username: '',
        email: '',
        name: '',
        dateOfBirth: '',
        phoneNumber: '',
        address: '',
        detailedAddress: '',
    });
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editing, setEditing] = useState(false); // 수정 모드 상태
    const [openPasswordDialog, setOpenPasswordDialog] = useState(false); // 비밀번호 변경 모달 상태
    const [openAddressDialog, setOpenAddressDialog] = useState(false); // 주소 검색 모달 상태
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
                    headers: { Authorization: `Bearer ${jwtToken}` },
                });

                const fullAddress = response.data.address || '';
                const [mainAddress, ...detailParts] = fullAddress.split(' ');
                const detailedAddress = detailParts.join(' ');

                setProfileData({
                    username: response.data.username,
                    email: response.data.email,
                    name: response.data.name || '',
                    dateOfBirth: response.data.dateOfBirth || '',
                    phoneNumber: response.data.phoneNumber || '',
                    address: mainAddress || '',
                    detailedAddress: detailedAddress || '',
                });
                setIsLoading(false);
            } catch (error) {
                console.error('사용자 프로필을 불러오지 못했습니다.', error);
            }
        };

        fetchUserProfile();
    }, [isAuthenticated, navigate, user, jwtToken]);

    const handlePhoneNumberChange = (e) => {
        const input = e.target.value.replace(/[^0-9]/g, ''); // 숫자 외 문자 제거
        let formattedNumber = input;

        if (input.length > 3 && input.length <= 7) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3)}`;
        } else if (input.length > 7) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
        }

        setProfileData((prevData) => ({ ...prevData, phoneNumber: formattedNumber }));
    };

    const handleUpdateProfile = async () => {
        try {
            const fullAddress = `${profileData.address} ${profileData.detailedAddress}`.trim();

            const requestData = {
                ...profileData,
                address: fullAddress,
            };
            if (password) {
                requestData.password = password;
            }
            await axios.put(`http://localhost:8080/api/users/${user.id}`, requestData, {
                headers: { Authorization: `Bearer ${jwtToken}`, 'Content-Type': 'application/json' },
            });
            alert('프로필이 성공적으로 업데이트되었습니다.');
            setEditing(false);
            setOpenPasswordDialog(false);
            setPassword('');
        } catch (error) {
            console.error('프로필 업데이트에 실패했습니다.', error);
            alert('프로필 업데이트에 실패했습니다. 다시 시도해주세요.');
        }
    };

    const openPasswordChangeDialog = () => setOpenPasswordDialog(true);
    const closePasswordChangeDialog = () => {
        setOpenPasswordDialog(false);
        setPassword('');
    };

    const handleAddressComplete = (data) => {
        const fullAddress = data.address;
        setProfileData((prevData) => ({
            ...prevData,
            address: fullAddress,
            detailedAddress: '',
        }));
        setOpenAddressDialog(false);
    };

    const openAddressSearchDialog = () => setOpenAddressDialog(true);
    const closeAddressSearchDialog = () => setOpenAddressDialog(false);

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
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Typography variant="h4" component="h2" gutterBottom>프로필 정보</Typography>
                        <form className="profile-form">
                            <TextField
                                fullWidth
                                margin="normal"
                                label="아이디"
                                variant="outlined"
                                value={profileData.username}
                                disabled
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="이메일"
                                variant="outlined"
                                value={profileData.email}
                                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                disabled={!editing}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="이름"
                                variant="outlined"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                disabled={!editing}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="생년월일"
                                variant="outlined"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={profileData.dateOfBirth}
                                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                                disabled={!editing}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="전화번호"
                                variant="outlined"
                                value={profileData.phoneNumber}
                                onChange={handlePhoneNumberChange}
                                disabled={!editing}
                                placeholder="010-1234-5678"
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="주소"
                                variant="outlined"
                                value={profileData.address}
                                onClick={editing ? openAddressSearchDialog : undefined}
                                disabled={!editing}
                                placeholder="주소 검색을 클릭하세요"
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="세부 주소"
                                variant="outlined"
                                value={profileData.detailedAddress}
                                onChange={(e) => setProfileData({ ...profileData, detailedAddress: e.target.value })}
                                disabled={!editing}
                            />
                            {editing ? (
                                <>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ mt: 2, backgroundColor: '#1976d2', color: '#fff' }}
                                        onClick={handleUpdateProfile}
                                    >
                                        수정 완료
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2, color: '#1976d2', borderColor: '#1976d2' }}
                                        onClick={() => setEditing(false)}
                                    >
                                        취소
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mt: 2, color: '#d32f2f', borderColor: '#d32f2f' }}
                                        onClick={openPasswordChangeDialog}
                                    >
                                        비밀번호 변경
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mt: 2, color: '#1976d2', borderColor: '#1976d2' }}
                                    onClick={() => setEditing(true)}
                                >
                                    프로필 수정
                                </Button>
                            )}
                        </form>
                    </Paper>
                </Grid>
            </Grid>

            {/* 주소 검색 모달 */}
            <Dialog open={openAddressDialog} onClose={closeAddressSearchDialog} fullWidth>
                <DialogTitle>주소 검색</DialogTitle>
                <DialogContent>
                    <DaumPostcode onComplete={handleAddressComplete} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAddressSearchDialog} color="secondary">
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>

            {/* 비밀번호 변경 모달 */}
            <Dialog open={openPasswordDialog} onClose={closePasswordChangeDialog}>
                <DialogTitle>비밀번호 변경</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="새 비밀번호"
                        variant="outlined"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ backgroundColor: '#1976d2', color: '#fff' }}
                        onClick={handleUpdateProfile}
                    >
                        수정 완료
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ color: '#d32f2f', borderColor: '#d32f2f' }}
                        onClick={closePasswordChangeDialog}
                    >
                        취소
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Profile;
