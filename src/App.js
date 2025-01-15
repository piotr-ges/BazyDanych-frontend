import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { login, getUserInfo } from './api';
import Home from './components/Home';
import Mieszkaniec from './components/Mieszkaniec';
import Uchwala from './components/Uchwala';
import Harmonogram from './components/Harmonogram';
import Usterka from './components/Usterka';
import Licznik from './components/Licznik';
import Rozliczenia from './components/Rozliczenia';
import Login from './components/Login';
import { AuthProvider } from './context/AuthContext'; // Importujemy AuthProvider
import DodajSpotkanie from './components/DodajSpotkanie';
import SpotkanieDetails from './components/SpotkanieDetails';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const loginResult = await login(username, password);
        if (loginResult.token) {
            setIsLoggedIn(true);
            const userInfo = await getUserInfo();
            setIsAdmin(userInfo.is_staff);
        } else {
            alert('Login failed');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); // Usuwamy token z localStorage
        setIsLoggedIn(false);  // Ustawiamy stan na false
        setIsAdmin(false);  // Ustawiamy admina na false
        alert('Wylogowano pomyślnie!');
    };

    useEffect(() => {
        const checkUserInfo = async () => {
            if (isLoggedIn) {
                const userInfo = await getUserInfo();
                setIsAdmin(userInfo.is_staff);
            }
        };
        checkUserInfo();
    }, [isLoggedIn]);

    useEffect(() => {
        const checkUserInfo = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                const userInfo = await getUserInfo();
                if (userInfo) {
                    setIsLoggedIn(true);
                    setIsAdmin(userInfo.is_staff);
                } else {
                    localStorage.removeItem('token');
                }
            }
        };
        checkUserInfo();
    }, []);

    return (
        <AuthProvider>
            <Router>
                <div>
                    {!isLoggedIn ? (
                        <Login
                            username={username}
                            setUsername={setUsername}
                            password={password}
                            setPassword={setPassword}
                            handleLogin={handleLogin}
                        />
                        
                    ) : (
                        <>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/mieszkaniec" element={<Mieszkaniec />} />
                                <Route path="/uchwala" element={<Uchwala />} />
                                <Route path="/harmonogram" element={<Harmonogram />} />
                                <Route path="/usterka" element={<Usterka isAdmin={isAdmin} />} />
                                <Route path="/usterki/admin/:id" element={<Usterka isAdmin={isAdmin} />} />
                                <Route path="/liczniki" element={<Licznik />} />
                                <Route path="/rozliczenia" element={<Rozliczenia />} />
                                <Route path="*" element={<Navigate to="/" />} />
                                <Route path="/dodaj-spotkanie" element={<DodajSpotkanie />} /> {/* Trasa do formularza */}
                                <Route path="/spotkanie/:id" element={<SpotkanieDetails />} /> {/* Trasa do szczegółów spotkania */}
                            </Routes>
                        </>
                    )}
                </div>
            </Router>
        </AuthProvider>
    );
};
export default App;