import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Container, Paper, Typography } from '@mui/material';
import '../styles.css'; // 기존 스타일 파일 유지

function CalendarPage() {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onDateChange = (date) => {
        setSelectedDate(date);
        console.log('선택된 날짜:', date);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ padding: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    나의 캘린더
                </Typography>
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    locale="ko-KR"
                    tileContent={({ date, view }) => {
                        return <span>{date.getDate()}</span>;
                    }}
                />
                <Typography variant="h6" sx={{ mt: 4 }}>
                    선택된 날짜: {selectedDate.toLocaleDateString()}
                </Typography>
            </Paper>
        </Container>
    );
}

export default CalendarPage;
