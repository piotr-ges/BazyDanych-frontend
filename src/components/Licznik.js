import React, { useEffect, useState } from 'react';
import { fetchData, deleteData, updateData, postData } from '../api'; // Funkcje API
import { Link } from 'react-router-dom';

const Licznik = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [newLicznik, setNewLicznik] = useState({ typ_licznika: '', odczyt: '', data_odczytu: '', mieszkaniec: '' });
    const [users, setUsers] = useState([]);  // Lista użytkowników
    const [editLicznik, setEditLicznik] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const endpoint = 'liczniki/';
            try {
                const result = await fetchData(endpoint);
                setData(result);
            } catch (error) {
                console.error("Błąd pobierania danych:", error);
            }
        };

        const getUsers = async () => {
            const usersEndpoint = 'users/';  // Endpoint do pobierania użytkowników
            try {
                const result = await fetchData(usersEndpoint);
                setUsers(result);  // Ustawienie użytkowników do wyboru
            } catch (error) {
                console.error("Błąd pobierania użytkowników:", error);
            }
        };

        getData();
        getUsers();
    }, []);

    const handleDelete = async (id) => {
        const endpoint = `liczniki/${id}/`;
        try {
            await deleteData(endpoint);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error("Błąd podczas usuwania:", error);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        const endpoint = `liczniki/${id}/`;
        try {
            await updateData(endpoint, updatedData);
            setData(data.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
            setEditLicznik(null);  // Zamknięcie formularza edycji po zapisaniu
        } catch (error) {
            console.error("Błąd podczas edytowania:", error);
        }
    };

    const handleAddLicznik = async () => {
        const endpoint = 'liczniki/';
        try {
            const result = await postData(endpoint, newLicznik);
            setData([...data, result]); // Dodanie nowego licznika do listy
            setNewLicznik({ typ_licznika: '', odczyt: '', data_odczytu: '', mieszkaniec: '' }); // Resetowanie formularza
        } catch (error) {
            console.error("Błąd podczas dodawania:", error);
        }
    };

    return (
        <div className="container">
            <h1>Liczniki</h1>
            
            {/* Formularz dodawania licznika */}
            {isAdmin && (
                <div className="add-licznik-form">
                    <h3>Dodaj nowy licznik</h3>
                    <select 
                        value={newLicznik.typ_licznika} 
                        onChange={(e) => setNewLicznik({ ...newLicznik, typ_licznika: e.target.value })}>
                        <option value="woda">Woda</option>
                        <option value="gaz">Gaz</option>
                        <option value="prąd">Prąd</option>
                    </select>
                    <input 
                        type="number" 
                        placeholder="Odczyt" 
                        value={newLicznik.odczyt} 
                        onChange={(e) => setNewLicznik({ ...newLicznik, odczyt: e.target.value })} 
                    />
                    <input 
                        type="date" 
                        value={newLicznik.data_odczytu} 
                        onChange={(e) => setNewLicznik({ ...newLicznik, data_odczytu: e.target.value })} 
                    />
                    <select 
                        value={newLicznik.mieszkaniec} 
                        onChange={(e) => setNewLicznik({ ...newLicznik, mieszkaniec: e.target.value })}>
                        <option value="">Wybierz mieszkańca</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                    <button onClick={handleAddLicznik} className='btn btn-success button-spacing2'>Dodaj licznik</button>
                </div>
            )}

            {/* Wyświetlanie liczników */}
            {data.length > 0 ? (
                data.map((item) => {
                    // Szukamy użytkownika na podstawie id mieszkania
                    const user = users.find((user) => user.id === item.mieszkaniec);
                    return (
                        <div key={item.id} className="data-block">
                            <p><strong>ID:</strong> {item.id}</p>
                            <p><strong>Typ:</strong> {item.typ_licznika}</p>
                            <p><strong>Wartość:</strong> {item.odczyt}</p>
                            <p><strong>Data Odczytu:</strong> {item.data_odczytu}</p>

                            {/* Wyświetlanie imienia i nazwiska mieszkańca przypisanego do licznika */}
                            {user && (
                                <p><strong>Mieszkaniec:</strong> {user.first_name} {user.last_name}</p>
                            )}

                            {isAdmin && (
                                <div>
                                    <button onClick={() => handleDelete(item.id)} className='btn btn-danger button-spacing2 button-spacing'>Usuń</button>
                                    <button onClick={() => setEditLicznik(item)} className='btn btn-success'>Edytuj</button>
                                </div>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}

            {/* Formularz edycji licznika */}
            {editLicznik && (
                <div className="edit-licznik-form">
                    <h3>Edytuj licznik</h3>
                    <select 
                        value={editLicznik.typ_licznika} 
                        onChange={(e) => setEditLicznik({ ...editLicznik, typ_licznika: e.target.value })}>
                        <option value="woda">Woda</option>
                        <option value="gaz">Gaz</option>
                        <option value="prąd">Prąd</option>
                    </select>
                    <input 
                        type="number" 
                        value={editLicznik.odczyt} 
                        onChange={(e) => setEditLicznik({ ...editLicznik, odczyt: e.target.value })} 
                    />
                    <input 
                        type="date" 
                        value={editLicznik.data_odczytu} 
                        onChange={(e) => setEditLicznik({ ...editLicznik, data_odczytu: e.target.value })} 
                    />
                    <select 
                        value={editLicznik.mieszkaniec} 
                        onChange={(e) => setEditLicznik({ ...editLicznik, mieszkaniec: e.target.value })}>
                        <option value="">Wybierz mieszkańca</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                    <button onClick={() => handleUpdate(editLicznik.id, editLicznik)} className='btn btn-success button-spacing2 button-spacing'>Zaktualizuj licznik</button>
                    <button onClick={() => setEditLicznik(null)} className='btn btn-secondary'>Anuluj</button>
                </div>
            )}

            <Link to="/" className='btn btn-dark'>Powrót do Home</Link>
        </div>
    );
};

export default Licznik;