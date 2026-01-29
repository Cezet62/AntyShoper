import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function Dashboard() {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        orders: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [productsRes, categoriesRes, ordersRes, pendingRes] = await Promise.all([
                    supabase.from('products').select('id', { count: 'exact', head: true }),
                    supabase.from('categories').select('id', { count: 'exact', head: true }),
                    supabase.from('orders').select('id', { count: 'exact', head: true }),
                    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending')
                ]);

                setStats({
                    products: productsRes.count || 0,
                    categories: categoriesRes.count || 0,
                    orders: ordersRes.count || 0,
                    pendingOrders: pendingRes.count || 0
                });
            } catch (err) {
                console.error('Error loading stats:', err);
            } finally {
                setLoading(false);
            }
        }

        loadStats();
    }, []);

    if (loading) {
        return <div className="admin-page"><p>Ładowanie...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Dashboard</h1>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{stats.products}</h3>
                        <p>Produktów</p>
                    </div>
                    <Link to="/admin/produkty" className="stat-link">Zobacz →</Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">📁</div>
                    <div className="stat-info">
                        <h3>{stats.categories}</h3>
                        <p>Kategorii</p>
                    </div>
                    <Link to="/admin/kategorie" className="stat-link">Zobacz →</Link>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">🛒</div>
                    <div className="stat-info">
                        <h3>{stats.orders}</h3>
                        <p>Zamówień</p>
                    </div>
                    <Link to="/admin/zamowienia" className="stat-link">Zobacz →</Link>
                </div>

                <div className="stat-card highlight">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-info">
                        <h3>{stats.pendingOrders}</h3>
                        <p>Oczekujących</p>
                    </div>
                    <Link to="/admin/zamowienia?status=pending" className="stat-link">Zobacz →</Link>
                </div>
            </div>

            <div className="quick-actions">
                <h2>Szybkie akcje</h2>
                <div className="actions-grid">
                    <Link to="/admin/produkty/nowy" className="action-card">
                        <span className="action-icon">➕</span>
                        <span>Dodaj produkt</span>
                    </Link>
                    <Link to="/admin/kategorie/nowa" className="action-card">
                        <span className="action-icon">📁</span>
                        <span>Dodaj kategorię</span>
                    </Link>
                    <Link to="/" target="_blank" className="action-card">
                        <span className="action-icon">🌐</span>
                        <span>Zobacz sklep</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
