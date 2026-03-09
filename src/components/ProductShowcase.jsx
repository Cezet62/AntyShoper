import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ProductShowcase.css';
import winterBannerFallback from '../assets/images/banner_winter_tire.png';
import { useFeaturedProducts } from '../hooks/useProducts';
import { getBannerBySlot } from '../lib/api';
import ProductCard from './ProductCard';

const ProductShowcase = ({ onAddToCart }) => {
    const { products: featuredProducts, loading } = useFeaturedProducts(3);
    const [promoBanner, setPromoBanner] = useState(null);

    useEffect(() => {
        getBannerBySlot('promo_main')
            .then(data => setPromoBanner(data))
            .catch(() => {});
    }, []);

    const bannerImage = promoBanner?.image_url || winterBannerFallback;
    const bannerTitle = promoBanner?.title || 'JUŻ CZAS';
    const bannerSubtitle = promoBanner?.subtitle || 'NA ZMIANĘ OPON';
    const bannerButtonText = promoBanner?.button_text || 'SPRAWDŹ';
    const bannerButtonLink = promoBanner?.button_link || '/kategoria/opony';

    return (
        <div id="promocje" className="product-showcase">
            <div className="container showcase-container">

                <div className="promo-banner" style={{ backgroundImage: `url(${bannerImage})` }}>
                    <div className="promo-content">
                        <h3 className="promo-title">{bannerTitle}</h3>
                        <p className="promo-subtitle">{bannerSubtitle}</p>
                        <Link to={bannerButtonLink} className="btn-promo" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                            {bannerButtonText}
                        </Link>
                    </div>
                </div>

                <div className="products-section">
                    <div className="products-header">
                        <h3>PROMOCJE <span className="highlight-text">Wybrane najlepsze oferty</span></h3>
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
