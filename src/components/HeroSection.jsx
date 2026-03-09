import React, { useState, useEffect } from 'react';
import './HeroSection.css';
import heroBgFallback from '../assets/images/hero_mechanic_suv.webp';
import { getBannerBySlot } from '../lib/api';

const HeroSection = () => {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        getBannerBySlot('hero')
            .then(data => setBanner(data))
            .catch(() => {});
    }, []);

    const bgImage = banner?.image_url || heroBgFallback;
    const title = banner?.title || 'CZĘŚCI I AKCESORIA';
    const subtitle = banner?.subtitle || 'DLA TWOJEGO SAMOCHODU';

    return (
        <section className="hero-section" style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${bgImage})`
        }}>
            <div className="container hero-content">
                <h1 className="hero-title">
                    {title} <br />
                    <span className="subtitle">{subtitle}</span>
                </h1>
                {banner?.button_text && banner?.button_link && (
                    <a href={banner.button_link} className="hero-cta" style={{
                        display: 'inline-block',
                        marginTop: '20px',
                        padding: '12px 30px',
                        background: 'var(--color-accent)',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '1rem'
                    }}>
                        {banner.button_text}
                    </a>
                )}
            </div>
        </section>
    );
};

export default HeroSection;
