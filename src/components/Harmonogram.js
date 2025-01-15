import React, { useEffect, useState, useContext } from 'react';
import { fetchData} from '../api';
import { AuthContext } from '../context/AuthContext'; // Importujemy kontekst autoryzacji
import './Common.css'; // Importujemy wspólny plik CSS
import { Link } from 'react-router-dom';

const Harmonogram = () => {
    const [data, setData] = useState([]);
    const { user } = useContext(AuthContext); // Sprawdzamy użytkownika

    useEffect(() => {
        const getData = async () => {
            const result = await fetchData('spotkania/');
            setData(result);
        };
        getData();
    }, []);

    const handleDelete = async (id) => {
        if (user && user.is_staff) {
            try {
                console.log(`Usuwanie spotkania z ID: ${id}`);
                
                // Wysłanie zapytania DELETE
                await fetchData(`spotkania/${id}/`, {
                    method: 'DELETE',
                });
    
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

            {user && user.is_staff && (
                <div>
                    <Link to="/dodaj-spotkanie">
                        <button className='btn btn-success'>Dodaj Spotkanie</button>
                    </Link>
                </div>
            )}

            {data.length > 0 ? (
                data.map((item) => (
                    <div key={item.id} className="data-block">
                        <p><strong>Tytuł:</strong> {item.tytul}</p>
                        <p><strong>Data Spotkania:</strong> {item.data_spotkania}</p>
                        <p><strong>Czas Spotkania:</strong> {item.czas_spotkania}</p>

                        {/* Przycisk szczegółów - przekierowanie do strony szczegółów spotkania */}
                        <Link to={`/spotkanie/${item.id}`}>
                            <button className='btn btn-success button-spacing'>Szczegóły</button>
                        </Link>

                        {user && user.is_staff && (
                            <button onClick={() => handleDelete(item.id)} className='btn btn-danger button-spacing'>Usuń</button>
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

