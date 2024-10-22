import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import AddExercise from './components/AddExercise';
import ExerciseRecords from './components/ExerciseRecords'; // ExerciseRecords 컴포넌트 추가
import AddGoal from './components/AddGoal'; // AddGoal 컴포넌트 추가
import GoalRecords from './components/GoalRecords'; // GoalRecords 컴포넌트 추가
import EditGoal from './components/EditGoal'; // EditGoal 컴포넌트 추가

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/add-exercise" element={<AddExercise />} />
                <Route path="/exercise-records" element={<ExerciseRecords />} /> {/* 운동 기록 조회 페이지 */}
                <Route path="/add-goal" element={<AddGoal />} /> {/* 목표 추가 페이지 */}
                <Route path="/goal-records" element={<GoalRecords />} /> {/* 목표 조회 페이지 */}
                <Route path="/edit-goal/:goalId" element={<EditGoal />} /> {/* 목표 수정 페이지 */}
            </Routes>
        </Router>
    );
}

export default App;
