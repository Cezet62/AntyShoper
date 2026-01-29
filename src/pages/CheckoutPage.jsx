import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../lib/api';
import './CheckoutPage.css';

const CheckoutPage = ({ cartItems, clearCart }) => {
    const navigate = useNavigate();
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const geoWidgetContainerRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'card'
    });

    const [deliveryMethod, setDeliveryMethod] = useState('courier');
    const [selectedLocker, setSelectedLocker] = useState(null);
    const [showGeoWidget, setShowGeoWidget] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Ładowanie skryptu EasyPack InPost
    useEffect(() => {
        // Dodaj CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://geowidget.easypack24.net/css/easypack.css';
        document.head.appendChild(link);

        // Dodaj skrypt
        const script = document.createElement('script');
        script.src = 'https://geowidget.easypack24.net/js/sdk-for-javascript.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            if (document.head.contains(link)) {
                document.head.removeChild(link);
            }
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    // Inicjalizacja mapy EasyPack gdy modal jest otwarty
    useEffect(() => {
        if (showGeoWidget && geoWidgetContainerRef.current && window.easyPack) {
            // Wyczyść kontener
            geoWidgetContainerRef.current.innerHTML = '';

            // Utwórz div dla mapy
            const mapDiv = document.createElement('div');
            mapDiv.id = 'easypack-map';
            geoWidgetContainerRef.current.appendChild(mapDiv);

            // Inicjalizuj mapę
            window.easyPack.init({
                defaultLocale: 'pl',
                mapType: 'osm',
                searchType: 'osm',
                points: {
                    types: ['parcel_locker']
                },
                map: {
                    initialTypes: ['parcel_locker']
                }
            });

            window.easyPack.mapWidget('easypack-map', function(point) {
                setSelectedLocker({
                    name: point.name,
                    address: point.address.line1,
                    city: point.address.line2,
                    postCode: point.address_details?.post_code || ''
                });
                setShowGeoWidget(false);
            });
        }
    }, [showGeoWidget]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePaymentChange = (method) => {
        setFormData(prev => ({ ...prev, paymentMethod: method }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Walidacja paczkomatu
        if (deliveryMethod === 'inpost' && !selectedLocker) {
            alert('Proszę wybrać paczkomat');
            return;
        }

        setIsSubmitting(true);

        try {
            const order = await createOrder({
                customerData: formData,
                cartItems,
                deliveryMethod,
                deliveryCost,
                selectedLocker
            });

            clearCart();
            navigate('/sukces', { state: { orderNumber: order.order_number } });
        } catch (err) {
            console.error('Order error:', err);
            setError('Wystąpił błąd podczas składania zamówienia. Spróbuj ponownie.');
        } finally {
            setIsSubmitting(false);
        }
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
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" name="email" required value={formData.email} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Telefon</label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Opcjonalnie" />
                                </div>
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
                            {error && <div className="checkout-error">{error}</div>}
                            <button type="submit" className="btn btn-primary btn-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Przetwarzanie...' : 'ZAMAWIAM I PŁACĘ'}
                            </button>
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
                        <div ref={geoWidgetContainerRef} className="geowidget-wrapper"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
