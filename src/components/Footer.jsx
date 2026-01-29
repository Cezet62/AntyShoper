import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <div className="footer-section about">
                    <h5>CarParts</h5>
                    <p>
                        CarParts to nowoczesne rozwiązanie dla branży motoryzacyjnej, stanowiące idealną propozycję dla firm poszukujących profesjonalnego i estetycznego sklepu internetowego.
                    </p>
                </div>

                <div className="footer-section links">
                    <h5>Informacje</h5>
                    <ul>
                        <li><a href="#">O nas</a></li>
                        <li><a href="#">Kontakt</a></li>
                        <li><a href="#">Regulamin</a></li>
                        <li><a href="#">Polityka prywatności</a></li>
                    </ul>
                </div>

                <div className="footer-section account">
                    <h5>Moje konto</h5>
                    <ul>
                        <li><a href="#">Logowanie</a></li>
                        <li><a href="#">Rejestracja</a></li>
                        <li><a href="#">Historia zamówień</a></li>
                        <li><a href="#">Koszyk</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h5>Kontakt</h5>
                    <p>Ulica Przykładowa 123</p>
                    <p>00-000 Warszawa</p>
                    <p>+48 123 456 789</p>
                    <p>sklep@carparts.pl</p>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>&copy; 2026 CarParts. Wszelkie prawa zastrzeżone.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
