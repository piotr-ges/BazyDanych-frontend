import React, { useEffect, useState } from 'react';
import { fetchData } from '../api';
import './Common.css'; // Importujemy wspólny plik CSS
import { Link } from 'react-router-dom';

const Harmonogram = ({ isAdmin }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const result = await fetchData('spotkania/');
            setData(result);
        };
        getData();
    }, []); // Ładowanie danych tylko raz przy pierwszym renderze

    const handleDelete = async (id) => {
        if (isAdmin) {
            try {
                console.log(`Usuwanie spotkania z ID: ${id}`);
                await fetchData(`spotkania/${id}/`, { method: 'DELETE' });

                // Usuwamy spotkanie z lokalnego stanu
                setData((prevData) => prevData.filter((item) => item.id !== id));

                alert('Spotkanie zostało usunięte');
            } catch (error) {
                console.error('Błąd przy usuwaniu spotkania:', error);
                alert('Nie udało się usunąć spotkania');
            }
        } else {
            alert('Tylko administrator może usunąć spotkanie');
        }
    };

    return (
        <div className="container">
            <h1>Harmonogramy</h1>

            {/* Wyświetlanie przycisków tylko dla administratora */}
            {isAdmin && (
                <div>
                    <Link to="/dodaj-spotkanie">
                        <button className="btn btn-success">Dodaj Spotkanie</button>
                    </Link>
                </div>
            )}

            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item.id} className="data-block">
                        <p><strong>Tytuł:</strong> {item.tytul}</p>
                        <p><strong>Data Spotkania:</strong> {item.data_spotkania}</p>
                        <p><strong>Czas Spotkania:</strong> {item.czas_spotkania}</p>

                        <Link to={`/spotkanie/${item.id}`}>
                            <button className="btn btn-success button-spacing">Szczegóły</button>
                        </Link>

                        {/* Przycisk usuwania dostępny tylko dla admina */}
                        {isAdmin && (
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="btn btn-danger button-spacing"
                            >
                                Usuń
                            </button>
                        )}
                    </div>
                ))
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}
        </div>
    );
};

export default Harmonogram;

