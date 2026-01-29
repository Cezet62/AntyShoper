import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import './ProductPage.css';

const ProductPage = ({ onAddToCart }) => {
    const { slug } = useParams();
    const { product, loading, error } = useProduct(slug);
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(null);

    // Ustaw domyślny wariant gdy produkt się załaduje
    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    if (loading) {
        return (
            <div className="container section">
                <p>Ładowanie produktu...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="container section">
                <h2>Nie znaleziono produktu</h2>
                <Link to="/" className="btn btn-secondary">Wróć na główną</Link>
            </div>
        );
    }

    const currentPrice = selectedVariant?.price || product.price;
    const currentOldPrice = selectedVariant?.oldPrice || product.oldPrice;
    const currentSku = selectedVariant?.sku || product.sku;
    const currentStock = selectedVariant?.stock || 0;

    const handleAddToCart = () => {
        const cartItem = {
            id: product.id,
            variantId: selectedVariant?.id,
            name: product.name,
            variantName: selectedVariant?.name,
            price: currentPrice,
            image: product.image,
            sku: currentSku,
            quantity: quantity
        };
        onAddToCart(cartItem);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    return (
        <div className="product-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/">Strona główna</Link>
                    {product.categoryName && (
                        <>
                            {' '}&gt; <Link to={`/kategoria/${product.category}`}>{product.categoryName}</Link>
                        </>
                    )}
                    {' '}&gt; <span>{product.name}</span>
                </div>

                <div className="product-layout">
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-info-panel">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="sku">Kod produktu: {currentSku}</p>

                        <div className="price-block">
                            <span className="price">{formatPrice(currentPrice)}</span>
                            {currentOldPrice && <span className="old-price">{formatPrice(currentOldPrice)}</span>}
                        </div>

                        {/* Selektor wariantów */}
                        {product.hasVariants && product.variants.length > 1 && (
                            <div className="variants-block">
                                <h4>Wybierz wariant:</h4>
                                <div className="variants-options">
                                    {product.variants.map(variant => (
                                        <button
                                            key={variant.id}
                                            className={`variant-btn ${selectedVariant?.id === variant.id ? 'selected' : ''}`}
                                            onClick={() => setSelectedVariant(variant)}
                                        >
                                            {variant.name}
                                            <span className="variant-price">{formatPrice(variant.price)}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="description">{product.description}</p>

                        {product.compatibility && (
                            <div className="compatibility-block">
                                <h4>Pasuje do:</h4>
                                <p>{product.compatibility}</p>
                            </div>
                        )}

                        <div className="stock-info">
                            {currentStock > 0 ? (
                                <span className="in-stock">✓ Dostępny ({currentStock} szt.)</span>
                            ) : (
                                <span className="out-of-stock">✗ Niedostępny</span>
                            )}
                        </div>

                        <div className="add-to-cart-block">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button onClick={() => setQuantity(q => Math.min(currentStock, q + 1))}>+</button>
                            </div>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={handleAddToCart}
                                disabled={currentStock === 0}
                            >
                                DO KOSZYKA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
