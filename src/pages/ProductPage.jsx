import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import './ProductPage.css';

const ProductPage = ({ onAddToCart }) => {
    const { id } = useParams();
    const product = products.find(p => p.id === parseInt(id));
    const [quantity, setQuantity] = useState(1);

    if (!product) {
        return (
            <div className="container section">
                <h2>Nie znaleziono produktu</h2>
                <Link to="/" className="btn btn-secondary">Wróć na główną</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        // In a real app we'd pass quantity as well, but for now just the product
        onAddToCart(product);
    };

    const formatPrice = (price) => {
        return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
    };

    return (
        <div className="product-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/">Strona główna</Link> &gt; <span>{product.name}</span>
                </div>

                <div className="product-layout">
                    <div className="product-gallery">
                        <div className="main-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                    </div>

                    <div className="product-info-panel">
                        <h1 className="product-title">{product.name}</h1>
                        <p className="sku">Kod produktu: {product.sku}</p>

                        <div className="price-block">
                            <span className="price">{formatPrice(product.price)}</span>
                            {product.oldPrice && <span className="old-price">{formatPrice(product.oldPrice)}</span>}
                        </div>

                        <p className="description">{product.description}</p>

                        <div className="add-to-cart-block">
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
                                <input type="text" value={quantity} readOnly />
                                <button onClick={() => setQuantity(q => q + 1)}>+</button>
                            </div>
                            <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                                DO KOSZYKA
                            </button>
                        </div>

                        <div className="specs-block">
                            <h3>Specyfikacja techniczna</h3>
                            <table className="specs-table">
                                <tbody>
                                    {Object.entries(product.specs).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="spec-label">{key}</td>
                                            <td className="spec-value">{value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
