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

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/add-exercise" element={<AddExercise />} />
                    <Route path="/exercise-records" element={<ExerciseRecords />} />
                    <Route path="/exercise-detail/:recordId" element={<ExerciseDetail />} />
                    <Route path="/add-goal" element={<AddGoal />} />
                    <Route path="/goal-records" element={<GoalRecords />} />
                    <Route path="/goal-progress" element={<GoalProgress />} />
                    <Route path="/edit-goal/:goalId" element={<EditGoal />} />
                    <Route path="/notifications" element={<Notification />} />
                    <Route path="profile" element={<Profile />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
