import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    category:categories(name),
                    variants:product_variants(id, name, price, stock_quantity)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Czy na pewno chcesz usunąć ten produkt?')) return;

        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setProducts(products.filter(p => p.id !== id));
        } catch (err) {
            alert('Błąd podczas usuwania: ' + err.message);
        }
    }

    async function toggleActive(id, currentStatus) {
        try {
            const { error } = await supabase
                .from('products')
                .update({ is_active: !currentStatus })
                .eq('id', id);

            if (error) throw error;
            setProducts(products.map(p =>
                p.id === id ? { ...p, is_active: !currentStatus } : p
            ));
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    }

    const formatPrice = (price) => {
        return price?.toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + ' zł';
    };

    if (loading) {
        return <div className="admin-page"><p>Ładowanie...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Produkty</h1>
                <Link to="/admin/produkty/nowy" className="btn btn-primary">
                    + Dodaj produkt
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Produkt</th>
                            <th>Kategoria</th>
                            <th>Warianty</th>
                            <th>Cena od</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => {
                            const minPrice = product.variants?.length > 0
                                ? Math.min(...product.variants.map(v => v.price))
                                : 0;
                            const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock_quantity || 0), 0) || 0;

                            return (
                                <tr key={product.id} className={!product.is_active ? 'inactive-row' : ''}>
                                    <td>
                                        <div className="product-cell">
                                            {product.images?.[0] && (
                                                <img src={product.images[0]} alt="" className="product-thumb" />
                                            )}
                                            <div>
                                                <strong>{product.name}</strong>
                                                <small>{product.slug}</small>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{product.category?.name || '—'}</td>
                                    <td>
                                        {product.variants?.length || 0} wariantów
                                        <br />
                                        <small>{totalStock} szt. łącznie</small>
                                    </td>
                                    <td>{formatPrice(minPrice)}</td>
                                    <td>
                                        <button
                                            onClick={() => toggleActive(product.id, product.is_active)}
                                            className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}
                                        >
                                            {product.is_active ? 'Aktywny' : 'Nieaktywny'}
                                        </button>
                                    </td>
                                    <td className="actions-cell">
                                        <Link to={`/admin/produkty/${product.id}`} className="btn btn-small btn-secondary">
                                            Edytuj
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="btn btn-small btn-danger"
                                        >
                                            Usuń
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {products.length === 0 && (
                    <p className="empty-state">Brak produktów. Dodaj pierwszy!</p>
                )}
            </div>
        </div>
    );
}
