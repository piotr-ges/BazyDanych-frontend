import React, { useEffect, useState } from 'react';
import { fetchData, postData, deleteData } from '../api'; // Import deleteData function
import './Common.css'; // Import the common CSS file

const Uchwala = ({ isAdmin }) => {
    const [data, setData] = useState([]);
    const [formData, setFormData] = useState({
        tytul: '',
        opis: ''
    });
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
            await postData('uchwaly/', formData);
            setFormData({
                tytul: '',
                opis: ''
            });
            setError(null);
            const result = await fetchData('uchwaly/');
            setData(result);
        } catch (err) {
            console.error("Error creating uchwala:", err);
            setError("Something went wrong while creating uchwala.");
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

    return (
        <div className="container">
            <h1>Uchwały</h1>
            {error && <p className="error">{error}</p>}
            
            {data.map((item) => (
                <div key={item.id} className="data-block">
                    <p><strong>ID:</strong> {item.id}</p>
                    <p><strong>Tytuł:</strong> {item.tytul}</p>
                    <p><strong>Opis:</strong> {item.opis}</p>
                    <p><strong>Data Przyjęcia:</strong> {item.data_przyjecia}</p>
                    {isAdmin && <button onClick={() => handleDelete(item.id)} className='btn btn-danger'>Usuń</button>}
                </div>
            ))}

                {isAdmin && (
                <form onSubmit={handleSubmit}>
                    <input type="text" name="tytul" value={formData.tytul} onChange={handleChange} placeholder="Tytuł" required />
                    <textarea name="opis" value={formData.opis} onChange={handleChange} placeholder="Opis" required class = 'form-control'/>
                    <button type="submit" className='btn btn-primary'>Dodaj Uchwałę</button>
                </form>
                )}
        </div>
    );
};

export default Uchwala;