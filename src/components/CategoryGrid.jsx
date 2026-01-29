import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import engineImg from '../assets/images/category_engine.png';
import wheelImg from '../assets/images/category_wheel.png';

const categories = [
    { name: 'SILNIK', description: 'Mocna strona', image: engineImg, slug: 'silnik' },
    { name: 'CHŁODZENIE', description: 'Zawsze właściwa temperatura', image: wheelImg, slug: 'chlodzenie' }, // Placeholder
    { name: 'ELEKTRYKA', description: 'Bezawaryjne działanie', image: engineImg, slug: 'elektryka' }, // Placeholder
    { name: 'KOŁA', description: 'Bezpiecznia jazda', image: wheelImg, slug: 'kola' },
    { name: 'HAMULCE', description: 'Pewne zatrzymanie', image: wheelImg, slug: 'hamulce' }, // Placeholder
    { name: 'FILTRY', description: 'Czysty silnik', image: engineImg, slug: 'filtry' }, // Placeholder
    { name: 'WYDECH', description: 'Cicha praca', image: wheelImg, slug: 'wydech' }, // Placeholder
    { name: 'ZAWIESZENIE', description: 'Komfort jazdy', image: engineImg, slug: 'zawieszenie' }, // Placeholder
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
