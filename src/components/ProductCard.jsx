import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    return (
        <div className="product-card">
            <Link to={`/produkt/${product.id}`} className="product-image">
                <img src={product.image} alt={product.name} />
            </Link>
            <button className="add-to-cart-btn" onClick={() => onAddToCart(product)}>+</button>
            <div className="product-details">
                <Link to={`/produkt/${product.id}`}><h4>{product.name}</h4></Link>
                <p className="product-code">Kod produktu: {product.sku}</p>
                <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
