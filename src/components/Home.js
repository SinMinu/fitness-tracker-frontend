// src/components/Home.js
import React from 'react';
import '../styles.css';
import { Box, Typography, Button } from '@mui/material';

function Home() {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#f0f0f0',
                padding: 3,
            }}
        >
            <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#007bff', fontWeight: 'bold' }}>
                피트니스 트래커에 오신 것을 환영합니다
            </Typography>
            <Typography variant="h6" component="p" gutterBottom sx={{ color: '#555' }}>
                운동을 기록하고 목표를 달성하세요!
            </Typography>
            <Button
                variant="contained"
                color="primary"
                size="large"
                sx={{ mt: 3 }}
                href="/register"
            >
                시작하기
            </Button>
        </Box>
    );
}

export default Home;
