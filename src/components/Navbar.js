import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles.css';

function Navbar() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [navAuth, setNavAuth] = useState(isAuthenticated);

    useEffect(() => {
        setNavAuth(isAuthenticated);
    }, [isAuthenticated]);

    const handleLogout = () => {
        logout();
        alert('You have been logged out.');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <h2>Fitness Tracker</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                {!navAuth ? (
                    <>
                        <li><Link to="/register">Register</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/add-exercise">Add Exercise</Link></li>
                        <li><Link to="/exercise-records">Exercise Records</Link></li>
                        <li><Link to="/add-goal">Add Goal</Link></li>
                        <li><Link to="/goal-records">Goal Records</Link></li>
                        <li><Link to="/profile">Profile</Link></li>
                        <li>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
