import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

const CheckoutPage = ({ cartItems, clearCart }) => {
    const navigate = useNavigate();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const geoWidgetRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'card'
    });

    const [deliveryMethod, setDeliveryMethod] = useState('courier');
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [showGeoWidget, setShowGeoWidget] = useState(false);

    // Ładowanie skryptu GeoWidget InPost
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://geowidget.inpost.pl/inpost-geowidget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Nasłuchiwanie na wybór paczkomatu
    useEffect(() => {
        const handlePointSelect = (event) => {
            const point = event.detail;
            setSelectedLocker({
                name: point.name,
                address: point.address?.line1 || point.address_details?.street,
                city: point.address?.line2 || point.address_details?.city,
                postCode: point.address_details?.post_code
            });
            setShowGeoWidget(false);
        };

        document.addEventListener('inpost.geowidget.point.selected', handlePointSelect);
        return () => {
            document.removeEventListener('inpost.geowidget.point.selected', handlePointSelect);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Walidacja paczkomatu
        if (deliveryMethod === 'inpost' && !selectedLocker) {
            alert('Proszę wybrać paczkomat');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            clearCart();
            navigate('/sukces');
        }, 1000);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    const deliveryCost = deliveryMethod === 'inpost' ? 9.99 : 14.99;
    const totalWithDelivery = total + deliveryCost;

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
                            <h3>Metoda dostawy</h3>
                            <div className="delivery-methods">
                                <div
                                    className={`delivery-option ${deliveryMethod === 'courier' ? 'selected' : ''}`}
                                    onClick={() => {
                                        setDeliveryMethod('courier');
                                        setSelectedLocker(null);
                                    }}
                                >
                                    <span className="delivery-icon">🚚</span>
                                    <div className="delivery-info">
                                        <span className="delivery-name">Kurier DPD</span>
                                        <span className="delivery-price">14,99 zł</span>
                                    </div>
                                </div>
                                <div
                                    className={`delivery-option ${deliveryMethod === 'inpost' ? 'selected' : ''}`}
                                    onClick={() => setDeliveryMethod('inpost')}
                                >
                                    <span className="delivery-icon">📦</span>
                                    <div className="delivery-info">
                                        <span className="delivery-name">Paczkomat InPost</span>
                                        <span className="delivery-price">9,99 zł</span>
                                    </div>
                                </div>
                            </div>

                            {deliveryMethod === 'inpost' && (
                                <div className="inpost-section">
                                    {selectedLocker ? (
                                        <div className="selected-locker">
                                            <div className="locker-info">
                                                <strong>{selectedLocker.name}</strong>
                                                <p>{selectedLocker.address}</p>
                                                <p>{selectedLocker.postCode} {selectedLocker.city}</p>
                                            </div>
                                            <button
                                                type="button"
                                                className="btn btn-secondary btn-small"
                                                onClick={() => setShowGeoWidget(true)}
                                            >
                                                Zmień
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-secondary btn-full"
                                            onClick={() => setShowGeoWidget(true)}
                                        >
                                            📍 Wybierz paczkomat
                                        </button>
                                    )}
                                </div>
                            )}
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
                            <div className="summary-subtotal">
                                <span>Produkty:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="summary-delivery">
                                <span>Dostawa ({deliveryMethod === 'inpost' ? 'Paczkomat' : 'Kurier'}):</span>
                                <span>{formatPrice(deliveryCost)}</span>
                            </div>
                            <div className="summary-total-row">
                                <span>Razem:</span>
                                <span>{formatPrice(totalWithDelivery)}</span>
                            </div>
                            <button type="submit" className="btn btn-primary btn-full">ZAMAWIAM I PŁACĘ</button>
                        </div>
                    </div>

                </form>
            </div>

            {/* Modal z GeoWidget InPost */}
            {showGeoWidget && (
                <div className="geowidget-modal" onClick={() => setShowGeoWidget(false)}>
                    <div className="geowidget-container" onClick={(e) => e.stopPropagation()}>
                        <div className="geowidget-header">
                            <h3>Wybierz paczkomat</h3>
                            <button
                                type="button"
                                className="geowidget-close"
                                onClick={() => setShowGeoWidget(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <inpost-geowidget
                            ref={geoWidgetRef}
                            onpoint="onPointSelected"
                            token="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzQlpXVzFNZzVlQnpDYU1XU3JvTlBjRWFveFpXcW9Ua2FuZVB3X291LWxvIn0.eyJleHAiOjIwMzIwNDU4NTMsImlhdCI6MTcxNjY4NTg1MywianRpIjoiZTA0MWI2OTEtMTZhMy00MjMxLWI4MjgtN2E3NWMyN2Q2YjM5IiwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbnBvc3QucGwvYXV0aC9yZWFsbXMvZXh0ZXJuYWwiLCJzdWIiOiJmOjEyNDc1MDUxLTFjMDMtNGU1OS1iYTBjLTJiNDU2OTdlODUxNzp0R3RwS1NqRDFMSVdXU0tWLWZvLTdvZ2lCNnVKLXdEa0lKYjNBd29kYU5FIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoic2hpcHgiLCJzZXNzaW9uX3N0YXRlIjoiNjUzOTM3YmMtMGJlNC00N2QxLTk1NjctNGU2YWQ2YjQ0ZTk2IiwiYWNyIjoiMSIsInNjb3BlIjoib3BlbmlkIGFwaTphcGlwb2ludHMiLCJzaWQiOiI2NTM5MzdiYy0wYmU0LTQ3ZDEtOTU2Ny00ZTZhZDZiNDRlOTYiLCJhbGxvd2VkX3JlZmVycmVycyI6IiIsInV1aWQiOiI5YTFiNTAzZi1jMGEzLTQxY2MtYjRmNi1iYmU5Mzk5NDQ5YzMifQ.Vz4FwrJd3Cg3yRXZbU5CbLjdM2sN6t5YOd7B8UyWb8cIu4W9X6D2F8EtQvXmLn5P3K4I1HdG0JfR7YmN9AwzQ"
                            language="pl"
                            config="parcelcollect"
                        ></inpost-geowidget>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
