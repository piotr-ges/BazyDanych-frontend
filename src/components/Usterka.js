import React, { useEffect, useState } from 'react';
import { fetchData, postData, updateData } from '../api';
import { Link, useParams } from 'react-router-dom';
import './Common.css'; // Import the common CSS file
import './Usterka.css'

const Usterka = ({ isAdmin }) => {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const [newUsterka, setNewUsterka] = useState('');
    const [usterka, setUsterka] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getData = async () => {
            if (id) {
                const result = await fetchData(`usterki/admin/${id}/`);
                setUsterka(result);
                setNewStatus(result.status);
            } else {
                const result = await fetchData('usterki/');
                setData(result);
            }
        };

        const getUsers = async () => {
            const usersResult = await fetchData('users/');
            setUsers(usersResult);
        };

        getData();
        getUsers();
    }, [id, isAdmin]);

    const handleAddUsterka = async () => {
        if (isAdmin) {
            alert('Admins cannot add new issues');
            return;
        }
        try {
            console.log('Adding usterka:', { opis: newUsterka });
            const result = await postData('usterki/', { opis: newUsterka });
            setData([...data, result]);
            setNewUsterka('');
        } catch (error) {
            console.error('Error adding usterka:', error);
            console.error('Error details:', error.response ? error.response.data : error.message);
            alert('Failed to add usterka');
        }
    };

    const handleUpdateUsterka = async () => {
        if (!isAdmin) {
            alert('Only admins can change the status');
            return;
        }
        try {
            const result = await updateData(`usterki/admin/${id}/`, { status: newStatus });
            setUsterka(result);
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating usterka:', error);
            alert('Failed to update usterka');
        }
    };

    const handleStatusChange = (id, status) => {
        setData(data.map(item => item.id === id ? { ...item, status } : item));
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            console.log('Updating status:', { id, status });
            const result = await updateData(`usterki/admin/${id}/`, { status });
            setData(data.map(item => item.id === id ? result : item));
            alert('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const getUserName = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.first_name} ${user.last_name}` : 'Nieznany mieszkaniec';
    };

    const getUserAddress = (userId) => {
        const user = users.find(u => u.id === userId);
        return user ? `${user.adres}` : 'Nieznany mieszkaniec';
    };

    if (id && usterka) {
        return (
            <div className="container">
                <h1>Usterka</h1>
                <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{usterka.status}</p>
                <p>{usterka.opis}</p>
                <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                >
                    <option value="nowa">Nowa</option>
                    <option value="w trakcie">W trakcie</option>
                    <option value="naprawiona">Naprawiona</option>
                </select>
                <button onClick={handleUpdateUsterka} className='btn btn-success'>Zaktualizuj status</button>
                
                <Link to="/" className="button" >Powrót do Home</Link>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>Usterki</h1>
            {data.map((item) => (
                <div key={item.id} className="usterka-block">
                    <p style={{ fontSize: '1.5em', fontWeight: 'bold' }}><strong>Status:</strong> {item.status}</p>
                    <p><strong>Mieszkaniec:</strong> {getUserName(item.mieszkaniec)}</p>
                    <p><strong>Adres:</strong> {getUserAddress(item.mieszkaniec)}</p>
                    <p><strong>Opis:</strong> {item.opis}</p>
                    {isAdmin && (
                        <div>
                            <select
                                value={item.status}
                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            >
                                <option value="nowa">Nowa</option>
                                <option value="w trakcie">W trakcie</option>
                                <option value="naprawiona">Naprawiona</option>
                            </select>
                            <button onClick={() => handleUpdateStatus(item.id, item.status)} className='btn btn-success button-spacing2'>Zaktualizuj status</button>
                        </div>
                    )}
                </div>
            ))}
            <Link to="/" className="button">Powrót do Home</Link>
            {!isAdmin && (
                <div>
                    <input
                        type="text"
                        value={newUsterka}
                        onChange={(e) => setNewUsterka(e.target.value)}
                        placeholder="Dodaj nową usterkę"
                    />
                    <button onClick={handleAddUsterka}>Dodaj</button>
                </div>
            )}
        </div>
    );
};

export default Usterka;