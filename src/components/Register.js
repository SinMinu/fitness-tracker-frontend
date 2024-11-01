import React, { useState } from 'react';
import axios from 'axios';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from 'react-daum-postcode';
import { TextField, Button, Container, Typography, CircularProgress, Box, Dialog, DialogContent } from '@mui/material';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [detailedAddress, setDetailedAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [openAddressDialog, setOpenAddressDialog] = useState(false); // 주소 검색 모달 상태
    const navigate = useNavigate();

    // 전화번호 입력 시 자동으로 하이픈(-) 추가
    const handlePhoneNumberChange = (e) => {
        const input = e.target.value.replace(/[^0-9]/g, '');
        let formattedNumber = input;

        if (input.length > 3 && input.length <= 7) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3)}`;
        } else if (input.length > 7) {
            formattedNumber = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
        }

        setPhoneNumber(formattedNumber);
    };

    // 주소 검색 창 열기
    const handleOpenAddressDialog = () => {
        setOpenAddressDialog(true);
    };

    // 주소 검색 완료 후 데이터 처리
    const handleAddressSelect = (data) => {
        setAddress(data.address); // 선택한 주소 설정
        setOpenAddressDialog(false); // 모달 닫기
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !name || !dateOfBirth || !phoneNumber || !address) {
            alert('모든 필드를 입력해 주세요.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('올바른 이메일 주소를 입력해 주세요.');
            return;
        }

        if (password.length < 6) {
            alert('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }

        setLoading(true);

        try {
            // 주소와 세부 주소를 결합하여 서버에 전송
            const fullAddress = `${address} ${detailedAddress}`;
            const response = await axios.post('http://localhost:8080/api/users/register', {
                username,
                email,
                password,
                name,
                dateOfBirth,
                phoneNumber,
                address: fullAddress, // 결합된 주소를 사용
            });
            alert('회원가입이 성공적으로 완료되었습니다!');
            navigate('/login');
        } catch (error) {
            console.error(error);
            alert('회원가입에 실패했습니다. 다시 시도해 주세요.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    회원가입
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="아이디"
                        variant="outlined"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="이메일"
                        type="email"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="비밀번호"
                        type="password"
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="이름"
                        variant="outlined"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="생년월일"
                        type="date"
                        variant="outlined"
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="전화번호"
                        variant="outlined"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        placeholder="010-1234-5678"
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="주소"
                        variant="outlined"
                        value={address}
                        onClick={handleOpenAddressDialog}
                        placeholder="주소 검색 버튼을 클릭하세요"
                        readOnly
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label="세부 주소"
                        variant="outlined"
                        value={detailedAddress}
                        onChange={(e) => setDetailedAddress(e.target.value)}
                        placeholder="세부 주소를 입력해 주세요"
                    />
                    <Box sx={{ mt: 4 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} /> : '회원가입'}
                        </Button>
                    </Box>
                </form>
            </Box>

            {/* 주소 검색 모달 */}
            <Dialog open={openAddressDialog} onClose={() => setOpenAddressDialog(false)} maxWidth="sm" fullWidth>
                <DialogContent>
                    <DaumPostcode onComplete={handleAddressSelect} />
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default Register;
