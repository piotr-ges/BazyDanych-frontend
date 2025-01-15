import React, { createContext, useState, useEffect } from 'react';
import { getUserInfo } from '../api'; // Zakładamy, że masz funkcję `getUserInfo` w api.js

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkUserStatus = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const userInfo = await getUserInfo();
                if (userInfo) {
                    setUser(userInfo);
                    setIsLoggedIn(true);
                }
            } else {
                setIsLoggedIn(false);
                setUser(null);
            }
        };
        checkUserStatus();
    }, []); // Ładuj status użytkownika tylko raz przy pierwszym renderze

    const login = (userInfo) => {
        setUser(userInfo);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};