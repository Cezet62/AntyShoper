
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = ({ cartCount }) => {
    return (
        <header className="header">
            <div className="top-bar">
                <div className="container top-bar-content">
                    <div className="contact-info">
                        <span>SKLEP STACJONARNY: 09:00 - 17:00</span>
                        <span className="separator">|</span>
                        <span>+48 123 456 789</span>
                    </div>
                    <div className="user-links">
                        <Link to="/login">Zaloguj się</Link>
                    </div>
                </div>
            </div>

            <div className="main-header">
                <div className="container main-header-content">
                    <Link to="/" className="logo">
                        <span className="logo-icon">⚙️</span>
                        <span className="logo-text">CarParts</span>
                    </Link>

                    <div className="search-bar">
                        <input type="text" placeholder="Szukaj..." />
                        <button className="search-btn">🔍</button>
                    </div>

                    <div className="header-actions">
                        <Link to="/wishlist" className="action-item">❤️</Link>
                        <Link to="/account" className="action-item">👤</Link>
                        <Link to="/koszyk" className="action-item" style={{ position: 'relative' }}>
                            🛒
                            {cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    backgroundColor: 'var(--color-accent)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>{cartCount}</span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            <nav className="navigation">
                <div className="container">
                    <ul className="nav-list">
                        <li><Link to="/kategoria/czesci">CZĘŚCI</Link></li>
                        <li><Link to="/kategoria/oleje">OLEJE I PŁYNY</Link></li>
                        <li><Link to="/kategoria/opony">OPONY</Link></li>
                        <li><Link to="/kategoria/narzedzia">NARZĘDZIA</Link></li>
                        <li><Link to="/kategoria/akcesoria">AKCESORIA</Link></li>
                        <li><Link to="/kategoria/promocje">PROMOCJE</Link></li>
                        <li><Link to="/kategoria/wyprzedaz">WYPRZEDAŻ</Link></li>
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
