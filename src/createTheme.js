// createTheme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // 파란색 계열
        },
        secondary: {
            main: '#ffffff', // 흰색
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        button: {
            fontWeight: 'bold',
        },
    },
});

export default theme;
