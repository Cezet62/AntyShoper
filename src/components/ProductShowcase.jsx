import React from 'react';
import { Link } from 'react-router-dom';
import './ProductShowcase.css';
import winterBanner from '../assets/images/banner_winter_tire.png';
import { useFeaturedProducts } from '../hooks/useProducts';
import ProductCard from './ProductCard';

const ProductShowcase = ({ onAddToCart }) => {
    const { products: featuredProducts, loading } = useFeaturedProducts(3);

    return (
        <div className="product-showcase">
            <div className="container showcase-container">

                <div className="promo-banner" style={{ backgroundImage: `url(${winterBanner})` }}>
                    <div className="promo-content">
                        <h3 className="promo-title">JUŻ CZAS</h3>
                        <p className="promo-subtitle">NA ZMIANĘ OPON</p>
                        <Link to="/kategoria/opony" className="btn-promo" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>SPRAWDŹ</Link>
                    </div>
                </div>

                <div className="products-section">
                    <div className="products-header">
                        <h3>PROMOCJE <span className="highlight-text">Wybrane najlepsze oferty</span></h3>
                        <div className="products-nav">
                            <button>&lt;</button>
                            <button>&gt;</button>
                        </div>
                    </div>

                    <div className="products-grid">
                        {loading ? (
                            <p>Ładowanie...</p>
                        ) : (
                            featuredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductShowcase;
