import React from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const CartPage = ({ cartItems, removeFromCart, updateQuantity }) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    return (
        <div className="cart-page">
            <div className="container">
                <h1>Twój Koszyk</h1>

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <p>Twój koszyk jest pusty.</p>
                        <Link to="/" className="btn btn-primary">Wróć do sklepu</Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map(item => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-image">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                    <div className="item-details">
                                        <h3>{item.name}</h3>
                                        <p className="item-sku">Kod: {item.sku}</p>
                                    </div>
                                    <div className="item-quantity">
                                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="item-price">
                                        {formatPrice(item.price * item.quantity)}
                                    </div>
                                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3>Podsumowanie</h3>
                            <div className="summary-row">
                                <span>Wartość koszyka:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Dostawa:</span>
                                <span>0,00 zł</span>
                            </div>
                            <div className="summary-total">
                                <span>Do zapłaty:</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <Link to="/checkout" className="btn btn-primary btn-full checkout-btn" style={{ display: 'block', textAlign: 'center' }}>PRZEJDŹ DO PŁATNOŚCI</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
