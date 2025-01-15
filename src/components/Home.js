import React from 'react';
import { Link } from 'react-router-dom';
import './Common.css'; // Importujemy wspólny plik CSS

const Home = ({ handleLogout }) => {
    return (
        <div className='home-container'>
            <h1 className='home-title'>Home</h1>
            <ul className="menu">
                <li><Link to="/mieszkaniec" className="menu-item">Mieszkańcy</Link></li>
                <li><Link to="/uchwala" className="menu-item">Uchwaly</Link></li>
                <li><Link to="/harmonogram" className="menu-item">Harmonogram</Link></li>
                <li><Link to="/usterka" className="menu-item">Usterki</Link></li>
                <li><Link to= "/liczniki" className="menu-item">Liczniki</Link></li>
                <li><Link to ="/rozliczenia" className="menu-item">Rozliczenia</Link></li>
            </ul>
            <button className="btn btn-primary logout-button" onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;