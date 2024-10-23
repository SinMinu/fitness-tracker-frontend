// src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [jwtToken, setJwtToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const login = (token, user) => {
        setJwtToken(token);
        setIsAuthenticated(true);
        setUser(user);
    };

    const logout = () => {
        setJwtToken(null);
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ jwtToken, isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
