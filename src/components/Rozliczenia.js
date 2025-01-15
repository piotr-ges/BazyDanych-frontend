import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';
import { Link } from 'react-router-dom';

const Rozliczenia = ({ isAdmin }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const endpoint = 'rozliczenia/';
            const result = await fetchData(endpoint);
            setData(result);
        };
        getData();
    }, [isAdmin]);

    return (
        <div className="container">
            <h1>Rozliczenia</h1>
            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item.id} className="data-block">
                        <p><strong>ID:</strong> {item.id}</p>
                        <p><strong>Typ:</strong> {item.typ}</p>
                        <p><strong>Kwota:</strong> {item.kwota}</p>
                        <p><strong>Data Rozliczenia:</strong> {item.data_rozliczenia}</p>
                    </div>
                ))
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}
            <Link to="/">Powrót do Home</Link>
        </div>
    );
};

export default Rozliczenia;