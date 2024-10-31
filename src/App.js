import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AddExercise from './components/AddExercise';
import ExerciseRecords from './components/ExerciseRecords';
import AddGoal from './components/AddGoal';
import GoalRecords from './components/GoalRecords';
import EditGoal from './components/EditGoal';
import Navbar from './components/Navbar';
import Profile from "./components/Profile";
import Notification from './components/Notification';
import GoalProgress from './components/GoalProgress';
import ExerciseDetail from './components/ExerciseDetail';
import CalendarPage from './components/CalendarPage'; // 캘린더 페이지 추가
import ExerciseChart from './components/CombinedView';
import ExerciseRecommendations from './components/ExerciseRecommendations';
import theme from './createTheme';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import NotificationSettings from './components/NotificationSettings';

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/add-exercise" element={<AddExercise />} />
                        <Route path="/exercise-chart" element={<ExerciseChart />} />
                        <Route path="/exercise-records" element={<ExerciseRecords />} />
                        <Route path="/recommendations" element={<ExerciseRecommendations />} />
                        <Route path="/exercise-detail/:recordId" element={<ExerciseDetail />} />
                        <Route path="/add-goal" element={<AddGoal />} />
                        <Route path="/goal-records" element={<GoalRecords />} />
                        <Route path="/goal-progress" element={<GoalProgress />} />
                        <Route path="/edit-goal/:goalId" element={<EditGoal />} />
                        <Route path="/notifications" element={<Notification />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/notification-settings" element={<NotificationSettings />} />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
