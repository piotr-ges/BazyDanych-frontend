import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
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
import DodajMieszkaniec from './components/DodajMieszkaniec';
import RozliczenieDetails from './components/RozliczenieDetails';


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
            
            window.location.href = "/";
        } else {
            alert('Login failed');
        }
    };

    const handleLogout = () => {
        setUsername('');
        setPassword('');
        setIsLoggedIn(false);
        setIsAdmin(false);
        localStorage.removeItem('token');

        window.location.href = "/login";
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
                                <Route path="/" element={<Home handleLogout={handleLogout} />} />
                                <Route path="/mieszkaniec" element={<Mieszkaniec isAdmin={isAdmin} />} />
                                <Route path="/stworz-mieszkanca/" element={<Mieszkaniec isAdmin={isAdmin}/>} />
                                <Route path="/uchwala" element={<Uchwala isAdmin={isAdmin}/>} />
                                <Route path="/harmonogram" element={<Harmonogram isAdmin={isAdmin}/>} />
                                <Route path="/usterka" element={<Usterka isAdmin={isAdmin} />} />
                                <Route path="/usterki/admin/:id" element={<Usterka isAdmin={isAdmin} />} />
                                <Route path="/liczniki" element={<Licznik isAdmin={isAdmin}/>} />
                                <Route path="/rozliczenia" element={<Rozliczenia isAdmin={isAdmin}/>} />
                                <Route path="*" element={<Navigate to="/" />} />
                                <Route path="/dodaj-spotkanie" element={<DodajSpotkanie />} /> {/* Trasa do formularza */}
                                <Route path="/spotkanie/:id" element={<SpotkanieDetails isAdmin={isAdmin} />} /> {/* Trasa do szczegółów spotkania */}
                                <Route path="/mieszkaniec/dodaj" element={<DodajMieszkaniec isAdmin={isAdmin} />} />
                                <Route path="/rozliczenie/details/:id" element={<RozliczenieDetails />} />

                            </Routes>
                        </>
                    )}
                </div>
            </Router>
        </AuthProvider>
    );
};
export default App;