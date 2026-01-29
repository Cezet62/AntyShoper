import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SuccessPage.css';

const SuccessPage = () => {
    const location = useLocation();
    const orderNumber = location.state?.orderNumber;

    return (
        <div className="success-page">
            <div className="container success-container">
                <div className="success-icon">✅</div>
                <h1>Dziękujemy za zamówienie!</h1>
                {orderNumber && (
                    <p className="order-number">Numer zamówienia: <strong>{orderNumber}</strong></p>
                )}
                <p>Twoje zamówienie zostało przyjęte do realizacji. Na Twój adres email wysłaliśmy potwierdzenie.</p>
                <Link to="/" className="btn btn-primary">WRÓĆ DO SKLEPU</Link>
            </div>
        </div>
    );
};

export default SuccessPage;
