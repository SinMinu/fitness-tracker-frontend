// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import InactivityHandler from './components/InactivityHandler';
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
import GoalProgress from './components/GoalProgress';
import ExerciseDetail from './components/ExerciseDetail';
import CalendarPage from './components/CalendarPage';
import ExerciseChart from './components/CombinedView';
import ExerciseRecommendations from './components/ExerciseRecommendations';
import theme from './createTheme';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <InactivityHandler> {/* Router 내부로 이동 */}
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
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/calendar" element={<CalendarPage />} />
                        </Routes>
                    </InactivityHandler>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
