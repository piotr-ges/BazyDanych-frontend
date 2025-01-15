import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';
import './Common.css'; // Import the common CSS file
import { Link } from 'react-router-dom';

const Mieszkaniec = ({ isAdmin }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const endpoint = isAdmin ? 'users/' : 'users/';
            const result = await fetchData(endpoint);
            setData(result);
        };
        getData();
    }, [isAdmin]);

    return (
        <div className="container">
            <h1>Mieszkańcy</h1>
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
                    </div>
                ))
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}
            <Link to="/" className="button">Powrót do Home</Link>
        </div>
    );
};

export default Mieszkaniec;