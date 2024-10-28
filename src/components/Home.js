import React, { useContext } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

function Home() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f0f0f0',
                padding: 3,
                textAlign: 'center',
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                피트니스 트래커에 오신 것을 환영합니다
            </Typography>
            <Typography variant="h6" component="p" gutterBottom sx={{ color: '#555', mb: 3 }}>
                운동을 기록하고 목표를 달성하세요!
            </Typography>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ maxWidth: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://source.unsplash.com/featured/?fitness"
                            alt="목표 설정"
                        />
                        <CardContent>
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
                    <Card sx={{ maxWidth: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://source.unsplash.com/featured/?workout"
                            alt="운동 기록"
                        />
                        <CardContent>
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
                    <Card sx={{ maxWidth: '100%' }}>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://source.unsplash.com/featured/?motivation"
                            alt="목표 달성"
                        />
                        <CardContent>
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

            {!isAuthenticated && (
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    sx={{ mt: 4 }}
                    href="/register"
                >
                    시작하기
                </Button>
            )}
        </Box>
    );
}

export default Home;
