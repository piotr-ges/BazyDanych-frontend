import React, { useEffect, useState } from 'react';
import { fetchData, postData, deleteData, updateData } from '../api'; // Import updateData function
import './Uchwala.css'; // Import the specific CSS file

const Uchwala = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        tytul: '',
        opis: ''
    });
    const [editId, setEditId] = useState(null); // State to track the ID of the uchwala being edited
    const [error, setError] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const result = await fetchData('uchwaly/');
            setData(result);
        };
        getData();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateData(`uchwaly/${editId}/`, formData);
                setEditId(null);
            } else {
                await postData('uchwaly/', formData);
            }
            setFormData({
                tytul: '',
                opis: ''
            });
            setError(null);
            const result = await fetchData('uchwaly/');
            setData(result);
        } catch (err) {
            console.error("Error creating/updating uchwala:", err);
            setError("Something went wrong while creating/updating uchwala.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteData(`uchwaly/${id}/`);
            const result = await fetchData('uchwaly/');
            setData(result);
        } catch (err) {
            console.error("Error deleting uchwala:", err);
            setError("Something went wrong while deleting uchwala.");
        }
    };

    const handleEdit = (item) => {
        setFormData({
            tytul: item.tytul,
            opis: item.opis
        });
        setEditId(item.id);
    };

    return (
        <div className="container">
            <h1 className="header">Uchwały</h1>
            {error && <p className="error">{error}</p>}
            
            <ul className="list">
                {data.map((item) => (
                    <li key={item.id} className="list-item">
                        
                        <p><strong>Tytuł:</strong> {item.tytul}</p>
                        <p><strong>Opis:</strong> {item.opis}</p>
                        <p><strong>Data Przyjęcia:</strong> {item.data_przyjecia}</p>
                        {isAdmin && (
                            <>
                                <button onClick={() => handleEdit(item)} className='button'>Edytuj</button>
                                <button onClick={() => handleDelete(item.id)} className='button button-delete'>Usuń</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>

            {isAdmin && (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="tytul" value={formData.tytul} onChange={handleChange} placeholder="Tytuł" required />
                    <textarea name="opis" value={formData.opis} onChange={handleChange} placeholder="Opis" required className='form-control'/>
                    <button type="submit" className='button button-add'>{editId ? 'Zaktualizuj' : 'Dodaj'} Uchwałę</button>
                </form>
            )}
            <button onClick={() => window.location.href = '/'} className='button button-home'>Powrót do Home</button>
        </div>
    );
};

export default Uchwala;