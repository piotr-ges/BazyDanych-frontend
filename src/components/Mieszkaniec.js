import React, { useEffect, useState } from 'react';
import { fetchData, postData, updateData, deleteData } from '../api';
import './Common.css';
import { Link } from 'react-router-dom';

const Mieszkaniec = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        username: '',
        first_name: '',
        last_name: '',
        adres: '',
        telefon: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const endpoint = 'users/';
            const result = await fetchData(endpoint);
            setData(result);
        };
        getData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isAdmin && !formData.id) {
                await postData('users/', formData);
            } else {
                await updateData(`users/${formData.id}/`, formData);
            }
            setFormData({
                id: '',
                username: '',
                first_name: '',
                last_name: '',
                adres: '',
                telefon: '',
                email: '',
                password: ''
            });
            setError(null);
        } catch (err) {
            console.error("Error updating data:", err);
            setError("Something went wrong while updating data.");
        }
        
    };

    const handleCancel = () => {
        // Przywracamy formularz do pustego stanu
        setFormData({
            id: '',
            username: '',
            first_name: '',
            last_name: '',
            adres: '',
            telefon: '',
            email: '',
            password: ''
        });
    };

    const handleDelete = async (id) => {
        if (isAdmin) {
            try {
                // Wysłanie zapytania DELETE
                await deleteData(`users/${id}/`);

                // Po usunięciu usuwamy użytkownika z listy w stanie
                setData((prevData) => prevData.filter((item) => item.id !== id));

                alert('Mieszkaniec został usunięty');
            } catch (error) {
                console.error('Błąd przy usuwaniu mieszkańca:', error);
                alert('Nie udało się usunąć mieszkańca');
            }
        } else {
            alert('Tylko administrator może usunąć mieszkańca');
        }
    };

    return (
        <div className="container">
            <h1>Mieszkańcy</h1>
            {error && <p className="error">{error}</p>}
            {isAdmin && (
                <Link to="/mieszkaniec/dodaj" className="btn btn-success">
                    Dodaj Mieszkańca
                </Link>
            )}
            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item.id} className="data-block">
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Username:</strong> {item.username}</p>
                        <p><strong>First Name:</strong> {item.first_name}</p>
                        <p><strong>Last Name:</strong> {item.last_name}</p>
                        <p><strong>Adres:</strong> {item.adres}</p>
                        <p><strong>Telefon:</strong> {item.telefon}</p>
                        <p><strong>Email:</strong> {item.email}</p>
                        {!isAdmin && (
                            <button onClick={() => setFormData(item)} className='btn btn-success'>Edytuj</button>
                        )}
                        {isAdmin && (
                            <button onClick={() => handleDelete(item.id)} className='btn btn-danger button-spacing'>Usuń</button>
                        )}
                    </div>
                ))
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}
            {!isAdmin && formData.id && (
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="form">
                        <div className='mb-3'>
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                placeholder="First Name"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                placeholder="Last Name"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="text"
                                name="adres"
                                value={formData.adres}
                                onChange={handleChange}
                                placeholder="Adres"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="text"
                                name="telefon"
                                value={formData.telefon}
                                onChange={handleChange}
                                placeholder="Telefon"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="form-control"
                                required
                            />
                        </div>
                        <div className='mb-3'>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                                className="form-control"
                            />
                        </div>
                        <div className="d-flex justify-content-between">
                            <button type="submit" className='btn btn-success'>Zaktualizuj dane</button>
                            <button type="button" onClick={handleCancel} className='btn btn-secondary'>Anuluj</button>
                        </div>
                    </form>
                </div>
            )}
            <Link to="/" className="btn btn-secondary mt-4">Powrót do Home</Link>
        </div>
    );
};

export default Mieszkaniec;



