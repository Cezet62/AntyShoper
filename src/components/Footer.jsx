import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section about">
                    <h5>sklep</h5>
                    <p>
                        Nowoczesne rozwiązanie dla branży motoryzacyjnej, stanowiące idealną propozycję dla firm poszukujących profesjonalnego i estetycznego sklepu internetowego.
                    </p>
                </div>

                <div className="footer-section links">
                    <h5>Informacje</h5>
                    <ul>
                        <li><Link to="/o-nas">O nas</Link></li>
                        <li><Link to="/kontakt">Kontakt</Link></li>
                        <li><Link to="/regulamin">Regulamin</Link></li>
                        <li><Link to="/polityka-prywatnosci">Polityka prywatności</Link></li>
                    </ul>
                </div>

                <div className="footer-section account">
                    <h5>Sklep</h5>
                    <ul>
                        <li><Link to="/koszyk">Koszyk</Link></li>
                        <li><Link to="/">Wszystkie produkty</Link></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h5>Kontakt</h5>
                    <p>Ulica Przykładowa 123</p>
                    <p>00-000 Warszawa</p>
                    <p>+48 123 456 789</p>
                    <p>kontakt@sklep.pl</p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 sklep. Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
