import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    const productUrl = `/produkt/${product.slug || product.id}`;

    // Domyślny wariant (pierwszy) do dodania do koszyka
    const defaultVariant = product.variants?.[0];

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            variantId: defaultVariant?.id,
            name: product.name,
            variantName: defaultVariant?.name,
            price: product.price,
            image: product.image,
            sku: product.sku
        };
        onAddToCart(cartItem);
    };

    return (
        <div className="product-card">
            <Link to={productUrl} className="product-image">
                <img src={product.image} alt={product.name} />
            </Link>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>+</button>
            <div className="product-details">
                <Link to={productUrl}><h4>{product.name}</h4></Link>
                <p className="product-code">Kod produktu: {product.sku}</p>
                <div className="product-price">
                    <span className="current-price">{formatPrice(product.price)}</span>
                    {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                </div>
                {product.hasVariants && (
                    <p className="variants-hint">Dostępne warianty</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
