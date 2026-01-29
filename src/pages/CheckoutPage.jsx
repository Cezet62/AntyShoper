import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = ({ cartItems, clearCart }) => {
    const navigate = useNavigate();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'card'
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            clearCart();
            navigate('/sukces');
        }, 1000);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    if (cartItems.length === 0) {
        return (
            <div className="container section">
                <h2>Twój koszyk jest pusty</h2>
                <button onClick={() => navigate('/')} className="btn btn-primary">Wróć do sklepu</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1>Kasa</h1>

                <form onSubmit={handleSubmit} className="checkout-layout">

                    <div className="checkout-form">
                        <section className="form-section">
                            <h3>Dane do wysyłki</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Imię</label>
                                    <input type="text" name="firstName" required value={formData.firstName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Nazwisko</label>
                                    <input type="text" name="lastName" required value={formData.lastName} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Adres</label>
                                <input type="text" name="address" required value={formData.address} onChange={handleInputChange} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Kod pocztowy</label>
                                    <input type="text" name="zipCode" required value={formData.zipCode} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Miasto</label>
                                    <input type="text" name="city" required value={formData.city} onChange={handleInputChange} />
                                </div>
                            </div>
                        </section>

                        <section className="form-section">
                            <h3>Metoda płatności</h3>
                            <div className="payment-methods">
                                <div
                                    className={`payment-option ${formData.paymentMethod === 'card' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentChange('card')}
                                >
                                    💳 Karta
                                </div>
                                <div
                                    className={`payment-option ${formData.paymentMethod === 'blik' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentChange('blik')}
                                >
                                    📱 BLIK
                                </div>
                                <div
                                    className={`payment-option ${formData.paymentMethod === 'transfer' ? 'selected' : ''}`}
                                    onClick={() => handlePaymentChange('transfer')}
                                >
                                    🏦 Przelew
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="order-summary-sidebar">
                        <div className="summary-card">
                            <h3>Twoje zamówienie</h3>
                            <div className="summary-items">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span>{formatPrice(item.price * item.quantity)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="summary-total-row">
                                <span>Suma:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <button type="submit" className="btn btn-primary btn-full">ZAMAWIAM I PŁACĘ</button>
                        </div>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CheckoutPage;
