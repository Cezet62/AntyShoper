import React from 'react';
import './BrandSelector.css';

const brands = [
    'Hyundai', 'Mitsubishi', 'Audi', 'Jaguar', 'BMW', 'Mini', 'Polestar', 'Ford', 'Chevrolet', 'Fiat', 'Mercedes'
];

const BrandSelector = () => {
    return (
        <div className="brand-selector">
            <div className="container">
                <h3 className="section-title">WYBIERZ MARKĘ POJAZDU</h3>
                <div className="brands-track">
                    {brands.map((brand, index) => (
                        <div key={index} className="brand-item">
                            <span className="brand-logo-placeholder">{brand[0]}</span>
                            <span className="brand-name">{brand}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BrandSelector;
