import React from 'react';
import './FeaturesBar.css';

const features = [
    { icon: '↩️', title: '14 dni', subtitle: 'na zwrot i wymianę' },
    { icon: '🚚', title: 'Szybka wysyłka', subtitle: 'Dla zapytań do 12:00' },
    { icon: '✅', title: 'Kontrola jakości', subtitle: 'Każdy produkt sprawdzamy' },
    { icon: '🛡️', title: 'Bezpieczna wysyłka', subtitle: 'Ubezpieczona paczka' },
    { icon: '🏭', title: 'Własny magazyn', subtitle: 'Towar mamy na miejscu' },
];

const FeaturesBar = () => {
    return (
        <div className="features-bar">
            <div className="container features-container">
                {features.map((feature, index) => (
                    <div key={index} className="feature-item">
                        <div className="feature-icon">{feature.icon}</div>
                        <div className="feature-text">
                            <div className="feature-title">{feature.title}</div>
                            <div className="feature-subtitle">{feature.subtitle}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesBar;
