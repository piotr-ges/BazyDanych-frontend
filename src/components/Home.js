import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <ul>
                <li><Link to="/mieszkaniec">Mieszkaniec</Link></li>
                <li><Link to="/uchwala">Uchwala</Link></li>
                <li><Link to="/harmonogram">Harmonogram</Link></li>
                <li><Link to="/usterka">Usterka</Link></li>
                <li><Link to= "/liczniki">Licznik</Link></li>
                <li><Link to ="/rozliczenia">Rozliczenia</Link></li>
            </ul>
        </div>
    );
};

export default Home;