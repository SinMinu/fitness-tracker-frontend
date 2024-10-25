// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState(localStorage.getItem('jwtToken') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('jwtToken'));
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

    const login = (token, user) => {
        setJwtToken(token);
        setIsAuthenticated(true);
        setUser(user);
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const logout = () => {
        setJwtToken(null);
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('user');
    };

    // 토큰이 있을 때만 페이지가 새로고침될 때 사용자 정보를 유지
    useEffect(() => {
        const storedToken = localStorage.getItem('jwtToken');
        const storedUser = localStorage.getItem('user');
        if (storedToken && storedUser) {
            setJwtToken(storedToken);
            setIsAuthenticated(true);
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ jwtToken, isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
