import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import ProductCard from '../components/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
    const { id } = useParams(); // id is the category slug, e.g., 'hamulce'

    // Simple filter
    const categoryProducts = products.filter(p => p.category === id);

    return (
        <div className="category-page">
            <div className="container">
                <div className="breadcrumb">
                    <Link to="/">Strona główna</Link> &gt; <span>{id.toUpperCase()}</span>
                </div>

                <div className="category-layout">
                    <aside className="filters-sidebar">
                        <h3>Filtry</h3>
                        <div className="filter-group">
                            <h4>Cena</h4>
                            <div className="price-inputs">
                                <input type="text" placeholder="Od" /> - <input type="text" placeholder="Do" />
                            </div>
                        </div>
                        <div className="filter-group">
                            <h4>Marka</h4>
                            <label><input type="checkbox" /> Brembo</label>
                            <label><input type="checkbox" /> TRW</label>
                            <label><input type="checkbox" /> Bosch</label>
                        </div>
                        <button className="btn btn-primary btn-full">Filtruj</button>
                    </aside>

                    <div className="category-content">
                        <div className="category-header">
                            <h1>Kategoria: {id.toUpperCase()}</h1>
                            <span>Znaleziono {categoryProducts.length} produktów</span>
                        </div>

                        {categoryProducts.length > 0 ? (
                            <div className="category-products-grid">
                                {categoryProducts.map(product => (
                                    <ProductCard key={product.id} product={product} onAddToCart={() => alert('Dodano!')} />
                                ))}
                            </div>
                        ) : (
                            <div className="no-products">
                                <p>Brak produktów w tej kategorii.</p>
                                <Link to="/" className="btn btn-secondary">Wróć na stronę główną</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;
