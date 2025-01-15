import React, { useEffect, useState } from 'react';
import { fetchData } from '../api'; // Funkcja API do pobierania danych
import { useParams } from 'react-router-dom'; // Hook do pobierania parametrów z URL
import { Link } from 'react-router-dom';

const RozliczenieDetails = () => {
    const { id } = useParams(); // Pobieramy id rozliczenia z URL
    const [rozliczenie, setRozliczenie] = useState(null); // Stan przechowujący dane rozliczenia
    const [user, setUser] = useState(null); // Stan przechowujący dane użytkownika

    useEffect(() => {
        const getRozliczenieDetails = async () => {
            try {
                // Pobranie danych o rozliczeniu na podstawie id
                const endpoint = `rozliczenia/${id}/`;
                const result = await fetchData(endpoint);
                setRozliczenie(result);

                // Pobranie danych o mieszkańcu
                const userEndpoint = `users/${result.mieszkaniec}`;
                const userResult = await fetchData(userEndpoint);
                setUser(userResult);
            } catch (error) {
                console.error("Błąd pobierania danych szczegółowych:", error);
            }
        };

        getRozliczenieDetails();
    }, [id]);

    if (!rozliczenie || !user) {
        return <p>Ładowanie danych...</p>;
    }

    return (
        <div className="container">
            <h1>Szczegóły Rozliczenia</h1>
            <div className="rozliczenie-details">
                <p><strong>Kwota:</strong> {rozliczenie.kwota} PLN</p>
                <p><strong>Data Rozliczenia:</strong> {rozliczenie.data_rozliczenia}</p>
                <p><strong>Status:</strong> {rozliczenie.status}</p>
                <p><strong>Opis:</strong> {rozliczenie.opis || "Brak opisu"}</p>
                <p><strong>Mieszkaniec:</strong> {user.first_name} {user.last_name}</p>
            </div>
            <Link to="/rozliczenia" className='btn btn-dark'>Powrót do rozliczeń</Link>
        </div>
    );
};

export default RozliczenieDetails;