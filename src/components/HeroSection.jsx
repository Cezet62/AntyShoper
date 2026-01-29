import React from 'react';
import './HeroSection.css';
import heroBg from '../assets/images/hero_mechanic_suv.png';

const HeroSection = () => {
    return (
        <section className="hero-section" style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.8)), url(${heroBg})`
        }}>
            <div className="container hero-content">
                <h1 className="hero-title">
                    CZĘŚCI I AKCESORIA <br />
                    <span className="subtitle">DLA TWOJEGO SAMOCHODU</span>
                </h1>
                <p className="hero-description">
                    NA WYCIĄGNIĘCIE RĘKI!
                </p>

                <div className="hero-buttons">
                    <button className="btn btn-primary">KUP I ZAINSTALUJ</button>
                    <button className="btn btn-secondary">ZOBACZ DEMO</button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
