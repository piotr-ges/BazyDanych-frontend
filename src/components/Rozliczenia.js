import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Rozliczenie.css'
import { fetchData, updateData, postData, deleteData } from '../api'; // Funkcje API


const Rozliczenia = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);  // Lista użytkowników
    const [editRozliczenie, setEditRozliczenie] = useState(null);  // Edytowane rozliczenie
    const [addRozliczenie, setAddRozliczenie] = useState({});  // Dane nowego rozliczenia

    useEffect(() => {
        const getData = async () => {
            const endpoint = 'rozliczenia/';
            const result = await fetchData(endpoint);
            const sortedData = result.sort((a, b) => new Date(b.data_rozliczenia) - new Date(a.data_rozliczenia));
            setData(sortedData);
        };

        const getUsers = async () => {
            const usersEndpoint = 'users/';  // Endpoint do pobierania użytkowników
            const result = await fetchData(usersEndpoint);
            setUsers(result);
        };

        getData();
        getUsers();
    }, [isAdmin]);

    const handleDelete = async (id) => {
        const endpoint = `rozliczenia/${id}/`;
        try {
            await deleteData(endpoint);
            setData(data.filter(item => item.id !== id));
        } catch (error) {
            console.error("Błąd podczas usuwania:", error);
        }
    };

    const handleUpdate = async (id, updatedData) => {
        const endpoint = `rozliczenia/${id}/`;
        try {
            await updateData(endpoint, updatedData);
            setData(data.map(item => (item.id === id ? { ...item, ...updatedData } : item)));
            setEditRozliczenie(null);  // Zamknięcie formularza edycji po zapisaniu
        } catch (error) {
            console.error("Błąd podczas edytowania:", error);
        }
    };

    const handleAddRozliczenie = async () => {
        const endpoint = 'rozliczenia/';
        try {
            const result = await postData(endpoint, addRozliczenie);
            setData([...data, result]); // Dodanie nowego rozliczenia do listy
            setAddRozliczenie({}); // Resetowanie formularza
        } catch (error) {
            console.error("Błąd podczas dodawania:", error);
        }
    };

    return (
        <div className="container">
            <h1>Rozliczenia</h1>
            
            {/* Formularz dodawania rozliczenia */}
            {isAdmin && (
                <div className="add-rozliczenie-form">
                <h3>Dodaj nowe rozliczenie</h3>
                <div className="row align-items-center g-2">
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={addRozliczenie?.status || ''}
                            onChange={(e) => setAddRozliczenie({ ...addRozliczenie, status: e.target.value })}
                        >
                            <option value="oczekujące">Oczekujące</option>
                            <option value="zrealizowane">Zrealizowane</option>
                            <option value="anulowane">Anulowane</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Kwota"
                            value={addRozliczenie?.kwota || ''}
                            onChange={(e) => setAddRozliczenie({ ...addRozliczenie, kwota: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <input
                            type="date"
                            className="form-control"
                            value={addRozliczenie?.data_rozliczenia || ''}
                            onChange={(e) => setAddRozliczenie({ ...addRozliczenie, data_rozliczenia: e.target.value })}
                        />
                    </div>
                    <div className="col-md-3">
                        <select
                            className="form-select"
                            value={addRozliczenie?.mieszkaniec || ''}
                            onChange={(e) => setAddRozliczenie({ ...addRozliczenie, mieszkaniec: e.target.value })}
                        >
                            <option value="">Wybierz mieszkańca</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-12 d-flex justify-content-center mt-4 mb-4">
                        <textarea
                            className="form-control"
                            placeholder="Opis"
                            value={addRozliczenie?.opis || ''}
                            onChange={(e) => setAddRozliczenie({ ...addRozliczenie, opis: e.target.value })}
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="col-md-1">
                        <button className="btn btn-success" onClick={handleAddRozliczenie}>
                            Dodaj
                        </button>
                    </div>
                </div>
            </div>
            )}

            {/* Wyświetlanie rozliczeń */}
            {data.length > 0 ? (
                <table className="rozliczenia-table">
                    <thead>
                        <tr>
                            <th>Kwota</th>
                            <th>Data Rozliczenia</th>
                            <th>Mieszkaniec</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => {
                            const user = users.find((user) => user.id === item.mieszkaniec);
                            return (
                                <tr key={item.id}>
                                    <td>{item.kwota}</td>
                                    <td>{item.data_rozliczenia}</td>
                                    <td>{user ? `${user.first_name} ${user.last_name}` : 'Brak danych'}</td>
                                    <td>{item.status}</td>
                                    <td>
                                        {isAdmin && (
                                            <>
                                                <button onClick={() => setEditRozliczenie(item)} className='btn btn-success button-spacing'>Edytuj</button>
                                                <button onClick={() => handleDelete(item.id)} className='btn btn-danger button-spacing'>Usuń</button>
                                            
                                            </>
                                        )}
                                    <Link to={`/rozliczenie/details/${item.id}`}>
                                        <button className='btn btn-primary button-spacing'>Szczegóły</button>
                                    </Link>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            ) : (
                <p>Brak danych do wyświetlenia</p>
            )}

            {/* Formularz edycji rozliczenia */}
            {editRozliczenie && (
                <div className="edit-rozliczenie-form mt-4">
                    <h3>Edytuj rozliczenie</h3>
                    <div className="row g-2">
                        <div className="col-md-3">
                            <select
                                className="form-select"
                                value={editRozliczenie.status}
                                onChange={(e) => setEditRozliczenie({ ...editRozliczenie, status: e.target.value })}
                            >
                                <option value="oczekujące">Oczekujące</option>
                                <option value="zrealizowane">Zrealizowane</option>
                                <option value="anulowane">Anulowane</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Kwota"
                                value={editRozliczenie.kwota}
                                onChange={(e) => setEditRozliczenie({ ...editRozliczenie, kwota: e.target.value })}
                            />
                        </div>
                        <div className="col-md-3">
                            <input
                                type="date"
                                className="form-control"
                                value={editRozliczenie.data_rozliczenia}
                                onChange={(e) => setEditRozliczenie({ ...editRozliczenie, data_rozliczenia: e.target.value })}
                            />
                        </div>
                        <div className="col-md-4">
                            <select
                                className="form-select"
                                value={editRozliczenie.mieszkaniec}
                                onChange={(e) => setEditRozliczenie({ ...editRozliczenie, mieszkaniec: e.target.value })}
                            >
                                <option value="">Wybierz mieszkańca</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.first_name} {user.last_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-12 d-flex justify-content-center mt-4">
                            <textarea
                                className="form-control"
                                placeholder="Opis"
                                value={editRozliczenie.opis || ''}
                                onChange={(e) => setEditRozliczenie({ ...editRozliczenie, opis: e.target.value })}
                                rows="3"
                            ></textarea>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-md-6">
                            <button
                                className="btn btn-success w-100"
                                onClick={() => handleUpdate(editRozliczenie.id, editRozliczenie)}
                            >
                                Zaktualizuj rozliczenie
                            </button>
                        </div>
                        <div className="col-md-6">
                            <button
                                className="btn btn-secondary w-100"
                                onClick={() => setEditRozliczenie(null)}
                            >
                                Anuluj
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Link to="/" className='btn btn-dark'>Powrót do Home</Link>
        </div>
    );
};

export default Rozliczenia;
