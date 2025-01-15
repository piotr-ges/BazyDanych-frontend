import React, { useState } from 'react';
import { postData } from '../api';
import { useNavigate } from 'react-router-dom';


const DodajMieszkaniec = ({ isAdmin }) => {
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        adres: '',
        telefon: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await postData('users/', formData);
            navigate('/mieszkaniec'); // Przekierowanie po dodaniu mieszkańca
        } catch (err) {
            console.error("Error adding resident:", err);
            setError("Nie udało się dodać mieszkańca.");
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
            <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
                <h1 className="text-center mb-4">Dodaj Mieszkańca</h1>
                {error && <p className="alert alert-danger">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            placeholder='Username'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            placeholder='Imię'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            placeholder='Nazwisko'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="adres"
                            name="adres"
                            value={formData.adres}
                            onChange={handleChange}
                            required
                            placeholder='Adres'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            id="telefon"
                            name="telefon"
                            value={formData.telefon}
                            onChange={handleChange}
                            required
                            placeholder='Telefon'
                        />
                    </div>
                    <div className="mb-3">
                        
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder='Email'
                        />
                    </div>
                    <div className="mb-3">
                        
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder='Hasło'
                        />
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="submit" className="btn btn-success">Dodaj Mieszkańca</button>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate('/mieszkaniec')}
                        >
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DodajMieszkaniec;