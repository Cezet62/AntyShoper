import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import { getCategories } from '../lib/api';

import engineImg from '../assets/images/category_engine.png';
import coolingImg from '../assets/images/category_cooling.png';
import electricalImg from '../assets/images/category_electrical.png';
import wheelImg from '../assets/images/category_wheel.png';
import brakesImg from '../assets/images/category_brakes.png';
import filtersImg from '../assets/images/category_filters.png';
import exhaustImg from '../assets/images/category_exhaust.png';
import suspensionImg from '../assets/images/category_suspension.png';

// Fallback obrazków po slug — mapuje slug kategorii na lokalne assety
const fallbackImages = {
    // Kategorie główne
    'czesci': engineImg,
    'oleje': engineImg,
    'opony': wheelImg,
    'narzedzia': engineImg,
    'akcesoria': wheelImg,
    // Podkategorie
    'silnik': engineImg,
    'chlodzenie': coolingImg,
    'elektryka': electricalImg,
    'kola': wheelImg,
    'hamulce': brakesImg,
    'filtry': filtersImg,
    'wydech': exhaustImg,
    'zawieszenie': suspensionImg,
    'oleje-silnikowe': engineImg,
    'plyny-hamulcowe': brakesImg,
    'plyny-chlodnicze': coolingImg,
    'opony-letnie': wheelImg,
    'opony-zimowe': wheelImg,
    'opony-całoroczne': wheelImg,
    'tarcze-hamulcowe': brakesImg,
    'klocki-hamulcowe': brakesImg,
};

function getFallbackImage(slug) {
    if (fallbackImages[slug]) return fallbackImages[slug];
    // Spróbuj dopasować częściowo
    for (const [key, img] of Object.entries(fallbackImages)) {
        if (slug.includes(key) || key.includes(slug)) return img;
    }
    return engineImg;
}

const CategoryGrid = () => {
    const [displayCategories, setDisplayCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCategories()
            .then(data => {
                const mainCats = data.filter(c => !c.parent_id);
                const subCats = data.filter(c => c.parent_id);

                // Jeśli jest co najmniej 8 kategorii głównych, pokaż je
                if (mainCats.length >= 8) {
                    setDisplayCategories(mainCats.slice(0, 8));
                } else {
                    // Uzupełnij podkategoriami do 8 kafelków
                    const combined = [...mainCats];
                    for (const sub of subCats) {
                        if (combined.length >= 8) break;
                        // Nie dodawaj duplikatów (gdyby slug się powtórzył)
                        if (!combined.find(c => c.id === sub.id)) {
                            combined.push(sub);
                        }
                    }
                    setDisplayCategories(combined.slice(0, 8));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="category-section">
                <div className="container">
                    <h3 className="section-title">KATEGORIE</h3>
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>Ładowanie kategorii...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="category-section">
            <div className="container">
                <h3 className="section-title">KATEGORIE</h3>
                <div className="category-grid">
                    {displayCategories.map(cat => (
                        <div key={cat.id} className="category-card">
                            <div className="category-image-wrapper">
                                <img
                                    src={cat.image_url || getFallbackImage(cat.slug)}
                                    alt={cat.name}
                                />
                            </div>
                            <div className="category-info">
                                <h4>{cat.name.toUpperCase()}</h4>
                                <p>{cat.description || ''}</p>
                                <Link to={`/kategoria/${cat.slug}`} className="category-link">Zobacz więcej &gt;</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryGrid;
