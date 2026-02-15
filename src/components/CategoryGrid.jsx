import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import engineImg from '../assets/images/category_engine.png';
import coolingImg from '../assets/images/category_cooling.png';
import electricalImg from '../assets/images/category_electrical.png';
import wheelImg from '../assets/images/category_wheel.png';
import brakesImg from '../assets/images/category_brakes.png';
import filtersImg from '../assets/images/category_filters.png';
import exhaustImg from '../assets/images/category_exhaust.png';
import suspensionImg from '../assets/images/category_suspension.png';

const categories = [
    { name: 'SILNIK', description: 'Mocna strona', image: engineImg, slug: 'silnik' },
    { name: 'CHŁODZENIE', description: 'Zawsze właściwa temperatura', image: coolingImg, slug: 'chlodzenie' },
    { name: 'ELEKTRYKA', description: 'Bezawaryjne działanie', image: electricalImg, slug: 'elektryka' },
    { name: 'KOŁA', description: 'Bezpiecznia jazda', image: wheelImg, slug: 'kola' },
    { name: 'HAMULCE', description: 'Pewne zatrzymanie', image: brakesImg, slug: 'hamulce' },
    { name: 'FILTRY', description: 'Czysty silnik', image: filtersImg, slug: 'filtry' },
    { name: 'WYDECH', description: 'Cicha praca', image: exhaustImg, slug: 'wydech' },
    { name: 'ZAWIESZENIE', description: 'Komfort jazdy', image: suspensionImg, slug: 'zawieszenie' },
];

const CategoryGrid = () => {
    return (
        <div className="category-section">
            <div className="container">
                <h3 className="section-title">KATEGORIE</h3>
                <div className="category-grid">
                    {categories.map((cat, index) => (
                        <div key={index} className="category-card">
                            <div className="category-image-wrapper">
                                <img src={cat.image} alt={cat.name} />
                            </div>
                            <div className="category-info">
                                <h4>{cat.name}</h4>
                                <p>{cat.description}</p>
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
