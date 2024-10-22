// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add-exercise">Add Exercise</Link></li>
                <li><Link to="/exercise-records">Exercise Records</Link></li>
                <li><Link to="/add-goal">Add Goal</Link></li>
                <li><Link to="/goal-records">Goal Records</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
            </ul>
        </nav>
    );
}

export default Navbar;
