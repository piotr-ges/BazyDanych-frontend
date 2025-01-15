import React, { useState, useContext } from 'react';
import { postData } from '../api';
import { AuthContext } from '../context/AuthContext';

const DodajSpotkanie = () => {
    const { user } = useContext(AuthContext);
    const [tytul, setTytul] = useState('');
    const [dataSpotkania, setDataSpotkania] = useState('');
    const [czasSpotkania, setCzasSpotkania] = useState('');
    const [opis, setOpis] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.is_staff) {
            alert('Tylko administrator może dodać spotkanie');
            return;
        }

        try {
            const spotkanie = {
                tytul,
                data_spotkania: dataSpotkania,
                czas_spotkania: czasSpotkania,
                opis,
            };

            const response = await postData('spotkania/', spotkanie);

            if (response) {
                alert('Spotkanie zostało dodane');
                // Możesz dodać logikę do przekierowania lub resetowania formularza
                setTytul('');
                setDataSpotkania('');
                setCzasSpotkania('');
                setOpis('');
            }
        } catch (error) {
            console.error('Błąd przy dodawaniu spotkania:', error);
            alert('Nie udało się dodać spotkania');
        }
    };

    return (
        <div className="container">
            <h1>Dodaj nowe spotkanie</h1>
            {user && user.is_staff ? (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Tytuł Spotkania:</label>
                        <input
                            type="text"
                            value={tytul}
                            onChange={(e) => setTytul(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Data Spotkania:</label>
                        <input
                            type="date"
                            value={dataSpotkania}
                            onChange={(e) => setDataSpotkania(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Czas Spotkania:</label>
                        <input
                            type="time"
                            value={czasSpotkania}
                            onChange={(e) => setCzasSpotkania(e.target.value)}
                            required
                        />
                    </div>
                    <div className = 'form-group'>
                        <label htmlFor = 'meetingDescriptionFormControl'>Opis Spotkania:</label>
                        <textarea
                            value={opis}
                            onChange={(e) => setOpis(e.target.value)}
                            required
                            class = 'form-control' id='meetingDescriptionFormControl'
                            placeholder='Wpisz opis spotkania...'
                        />
                    </div>
                    <button type="submit">Dodaj Spotkanie</button>
                </form>
            ) : (
                <p>Nie masz uprawnień do dodawania spotkań.</p>
            )}
        </div>
    );
};

export default DodajSpotkanie;