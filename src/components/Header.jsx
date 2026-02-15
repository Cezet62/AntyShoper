
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/images/logo_autopartsdirect.png';
import { getCategories } from '../lib/api';
import { useProductSearch } from '../hooks/useProducts';

const Header = ({ cartCount }) => {
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef(null);
    const { products: searchResults, loading: searchLoading } = useProductSearch(searchQuery);

    useEffect(() => {
        getCategories().then(data => setCategories(data.filter(c => !c.parent_id)));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                        <img src={logo} alt="AutoPartsDirect" style={{ height: '40px', marginRight: '10px' }} />
                        <span className="logo-text">sklep</span>
                    </Link>

                    <div className="search-bar" ref={searchRef}>
                        <input
                            type="text"
                            placeholder="Szukaj części..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowResults(true);
                            }}
                            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                        />
                        <button className="search-btn">🔍</button>
                        {showResults && searchQuery.length >= 2 && (
                            <div className="search-dropdown">
                                {searchLoading ? (
                                    <div className="search-loading">Szukam...</div>
                                ) : searchResults.length > 0 ? (
                                    searchResults.slice(0, 6).map(product => (
                                        <Link
                                            key={product.id}
                                            to={`/produkt/${product.slug}`}
                                            className="search-result-item"
                                            onClick={() => {
                                                setShowResults(false);
                                                setSearchQuery('');
                                            }}
                                        >
                                            <img src={product.image} alt={product.name} className="search-result-image" />
                                            <div className="search-result-info">
                                                <span className="search-result-name">{product.name}</span>
                                                <span className="search-result-price">{product.price.toFixed(2)} zł</span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="search-no-results">Brak wyników dla "{searchQuery}"</div>
                                )}
                            </div>
                        )}
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
                        {categories.map(cat => (
                            <li key={cat.id}><Link to={`/kategoria/${cat.slug}`}>{cat.name.toUpperCase()}</Link></li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Header;
