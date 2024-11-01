import React, { useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Box
            sx={{
                minHeight: '100vh',
                overflow: 'hidden',
                backgroundImage: 'url(/images/main.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: '#fff',
                textAlign: 'center',
                padding: 3,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.3)', // 흰색 반투명 오버레이
                    backdropFilter: 'blur(4px)', // 블러 효과 적용
                    zIndex: 1,
                },
            }}
        >
            {/* 흰색 반투명 오버레이 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.5)', // 흰색 투명도 50%
                    zIndex: 1,
                }}
            />

            {/* 배경 위의 텍스트 */}
            <Box sx={{ position: 'relative', zIndex: 2, paddingTop: '100px', paddingBottom: '40px' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#FFFFFF',
                        textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)',
                    }}
                >
                    피트니스 트래커에 오신 것을 환영합니다
                </Typography>
                <Typography variant="h6" component="p" sx={{ color: '#ccc', mb: 3 }}>
                    운동을 기록하고 목표를 달성하세요!
                </Typography>
            </Box>

            {/* 카드 섹션 */}
            <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
                {/* 카드들 */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: '100%',
                            height: 200,
                            backgroundImage: 'url(/images/1.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            color: '#000',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                zIndex: 1,
                            },
                        }}
                    >
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography gutterBottom variant="h5" component="div" color="primary">
                                운동 기록
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                각 운동 세션을 기록하고 칼로리 소모량을 확인하세요.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: '100%',
                            height: 200,
                            backgroundImage: 'url(/images/2.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            color: '#000',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                zIndex: 1,
                            },
                        }}
                    >
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography gutterBottom variant="h5" component="div" color="primary">
                                목표 설정
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                명확한 목표를 설정하고 달성 현황을 추적하세요.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card
                        sx={{
                            maxWidth: '100%',
                            height: 200,
                            backgroundImage: 'url(/images/3.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            position: 'relative',
                            color: '#000',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                zIndex: 1,
                            },
                        }}
                    >
                        <CardContent sx={{ position: 'relative', zIndex: 2 }}>
                            <Typography gutterBottom variant="h5" component="div" color="primary">
                                목표 달성
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                피트니스 목표를 달성하며 건강한 삶을 이루어보세요.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* 시작하기 버튼 */}
            {!isAuthenticated && (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{
                        mt: 4,
                        backgroundColor: '#1976d2', // 더 짙은 파란색으로 버튼 강조
                        color: '#fff',
                        fontWeight: 'bold',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        position: 'relative',
                        zIndex: 2, // 배경 이미지 위로 올리기 위해 z-index 설정
                    }}
                    href="/register"
                >
                    시작하기
                </Button>
            )}
        </Box>
    );
}

export default Home;
