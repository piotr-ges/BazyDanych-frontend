import React, { useState, useEffect, useContext } from 'react';
import { fetchData } from '../api';
import { useParams } from 'react-router-dom';  // Używamy hooka do pobrania parametru id z URL
import { AuthContext } from '../context/AuthContext';


const SpotkanieDetails = ({ isAdmin }) => {
    const { id } = useParams();  // Pobieramy id spotkania z URL
    const [spotkanie, setSpotkanie] = useState(null);
    const [isEditing, setIsEditing] = useState(false); // Czy jesteśmy w trybie edycji
    const { user } = useContext(AuthContext);

    const [tytul, setTytul] = useState('');
    const [dataSpotkania, setDataSpotkania] = useState('');
    const [czasSpotkania, setCzasSpotkania] = useState('');
    const [opis, setOpis] = useState('');

    const getSpotkanieDetails = async () => {
        const result = await fetchData(`spotkania/${id}/`);
        setSpotkanie(result);

        // Wypełniamy pola formularza danymi z API
        setTytul(result.tytul);
        setDataSpotkania(result.data_spotkania);
        setCzasSpotkania(result.czas_spotkania);
        setOpis(result.opis);
    };

    useEffect(() => {
        getSpotkanieDetails();
    }, [id]);

    const isUserEnrolled = () => {
        return Array.isArray(spotkanie?.uczestnicy) && spotkanie.uczestnicy.some(
            (uczestnik) => uczestnik.id === user.id
        );
    };

    const handleEnroll = async () => {
        try {
            await fetchData(`spotkania/${id}/register/`, {
                method: 'POST',
            });

            await getSpotkanieDetails();
        } catch (error) {
            console.error('Błąd podczas zapisywania:', error);
            alert('Nie udało się zapisać na spotkanie.');
        }
    };

    const handleUnenroll = async () => {
        try {
            await fetchData(`spotkania/${id}/unregister/`, {
                method: 'POST',
            });

            // Usuwamy użytkownika z listy uczestników
            setSpotkanie((prev) => ({
                ...prev,
                uczestnicy: prev.uczestnicy.filter((uczestnik) => uczestnik.id !== user.id),
            }));

            alert('Zostałeś wypisany ze spotkania.');
        } catch (error) {
            console.error('Błąd podczas wypisywania:', error);
            alert('Nie udało się wypisać ze spotkania.');
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const updatedSpotkanie = {
            tytul,
            data_spotkania: dataSpotkania,
            czas_spotkania: czasSpotkania,
            opis,
        };

        try {
            const response = await fetchData(`spotkania/${id}/`, {
                method: 'PUT',
                body: JSON.stringify(updatedSpotkanie),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response) {
                setSpotkanie((prev) => ({
                    ...response,
                    uczestnicy: response.uczestnicy || prev.uczestnicy || [], // Zachowujemy uczestników
                }));
                alert('Dane spotkania zostały zaktualizowane');
                setIsEditing(false); // Wyłączamy tryb edycji
            }
        } catch (error) {
            console.error('Błąd przy aktualizacji spotkania:', error);
            alert('Nie udało się zaktualizować danych spotkania');
        }
    };

    return (
        <div className="container">
            {spotkanie ? (
                <>
                    <h1>Szczegóły Spotkania</h1>
                    {isEditing ? (
                        // Formularz edycji
                        <form onSubmit={handleEditSubmit}>
                            <div>
                                <label>Tytuł:</label>
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
                                <label htmlFor = 'meetingDescriptionFormControl'>Opis:</label>
                                <textarea
                                    value={opis}
                                    onChange={(e) => setOpis(e.target.value)}
                                    required
                                    class = 'form-control' id='meetingDescriptionFormControl'
                                />
                            </div>
                            <button type="submit" className='btn btn-success button-spacing'>Zapisz zmiany</button>
                            <button type="button" onClick={() => setIsEditing(false)} className='btn btn-secondary button-spacing'>
                                Anuluj
                            </button>
                        </form>
                    ) : (
                        // Wyświetlanie szczegółów spotkania
                        <>
                            <p><strong>Tytuł:</strong> {spotkanie.tytul}</p>
                            <p><strong>Data Spotkania:</strong> {spotkanie.data_spotkania}</p>
                            <p><strong>Czas Spotkania:</strong> {spotkanie.czas_spotkania}</p>
                            <p><strong>Opis Spotkania:</strong> {spotkanie.opis}</p>

                            <h3>Uczestnicy:</h3>
                            {spotkanie.uczestnicy && spotkanie.uczestnicy.length > 0 ? (
                                <ul>
                                    {spotkanie.uczestnicy.map((uczestnik) => (
                                        <li key={uczestnik.id}>
                                            {uczestnik.first_name} {uczestnik.last_name}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Brak zapisanych uczestników.</p>
                            )}

                            {/* Przycisk Edytuj widoczny tylko dla administratora */}
                            {isAdmin && (
                                <button onClick={() => setIsEditing(true)} className='btn btn-success button-spacing'>Edytuj</button>
                            )}

                            {/* Przycisk zapisu lub wypisu */}
                            {user && (isUserEnrolled() ? (
                                    <button onClick={handleUnenroll} className='btn btn-danger button-spacing'>Wypisz się</button>
                                ) : (
                                    <button onClick={handleEnroll} className='btn btn-success button-spacing'>Zapisz się</button>
                                )
                            )}
                        </>
                    )}
                </>
            ) : (
                <p>Ładowanie szczegółów spotkania...</p>
            )}
        </div>
    );
};

export default SpotkanieDetails;
