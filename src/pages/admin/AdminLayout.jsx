import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

export default function AdminLayout() {
    const { user, loading, signOut } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="admin-loading">
                <p>Ładowanie...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-logo">
                    <h2>Admin Panel</h2>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin" className={`nav-item ${isActive('/admin') ? 'active' : ''}`}>
                        <span className="nav-icon">📊</span>
                        Dashboard
                    </Link>
                    <Link to="/admin/produkty" className={`nav-item ${location.pathname.startsWith('/admin/produkty') ? 'active' : ''}`}>
                        <span className="nav-icon">📦</span>
                        Produkty
                    </Link>
                    <Link to="/admin/kategorie" className={`nav-item ${location.pathname.startsWith('/admin/kategorie') ? 'active' : ''}`}>
                        <span className="nav-icon">📁</span>
                        Kategorie
                    </Link>
                    <Link to="/admin/zamowienia" className={`nav-item ${location.pathname.startsWith('/admin/zamowienia') ? 'active' : ''}`}>
                        <span className="nav-icon">🛒</span>
                        Zamówienia
                    </Link>
                </nav>

                <div className="admin-user">
                    <p>{user.email}</p>
                    <button onClick={signOut} className="btn btn-secondary btn-small">
                        Wyloguj
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
