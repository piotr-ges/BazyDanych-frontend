import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';
import './Common.css'; // Import the common CSS file

const Uchwala = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const result = await fetchData('uchwaly/');
            setData(result);
        };
        getData();
    }, []);

    return (
        <div className="container">
            <h1>Uchwały</h1>
            {data.map((item) => (
                <div key={item.id} className="data-block">
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Tytuł:</strong> {item.tytul}</p>
                    <p><strong>Opis:</strong> {item.opis}</p>
                    <p><strong>Data Przyjęcia:</strong> {item.data_przyjecia}</p>
                </div>
            ))}
        </div>
    );
};

export default Uchwala;