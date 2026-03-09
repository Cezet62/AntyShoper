import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function Banners() {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBanners();
    }, []);

    async function loadBanners() {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('sort_order');

            if (error) throw error;
            setBanners(data || []);
        } catch (err) {
            console.error('Error loading banners:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Czy na pewno chcesz usunąć ten baner?')) return;

        try {
            const { error } = await supabase
                .from('banners')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setBanners(banners.filter(b => b.id !== id));
        } catch (err) {
            alert('Błąd podczas usuwania: ' + err.message);
        }
    }

    async function toggleActive(banner) {
        try {
            const { error } = await supabase
                .from('banners')
                .update({ is_active: !banner.is_active })
                .eq('id', banner.id);

            if (error) throw error;
            setBanners(banners.map(b =>
                b.id === banner.id ? { ...b, is_active: !b.is_active } : b
            ));
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    }

    const slotLabels = {
        hero: 'Baner główny (góra strony)',
        promo_main: 'Baner promocyjny (sekcja promocji)'
    };

    if (loading) {
        return <div className="admin-page"><p>Ładowanie...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Banery</h1>
                <Link to="/admin/banery/nowy" className="btn btn-primary">
                    + Dodaj baner
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Podgląd</th>
                            <th>Slot</th>
                            <th>Tytuł</th>
                            <th>Link</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {banners.map(banner => (
                            <tr key={banner.id} className={!banner.is_active ? 'inactive-row' : ''}>
                                <td>
                                    {banner.image_url ? (
                                        <img src={banner.image_url} alt="" className="product-thumb" />
                                    ) : (
                                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Brak</span>
                                    )}
                                </td>
                                <td><code>{slotLabels[banner.slot] || banner.slot}</code></td>
                                <td>
                                    <strong>{banner.title || '—'}</strong>
                                    {banner.subtitle && <small>{banner.subtitle}</small>}
                                </td>
                                <td>
                                    {banner.button_link ? (
                                        <code>{banner.button_link}</code>
                                    ) : '—'}
                                </td>
                                <td>
                                    <button
                                        onClick={() => toggleActive(banner)}
                                        className={`status-badge ${banner.is_active ? 'active' : 'inactive'}`}
                                    >
                                        {banner.is_active ? 'Aktywny' : 'Ukryty'}
                                    </button>
                                </td>
                                <td className="actions-cell">
                                    <Link to={`/admin/banery/${banner.id}`} className="btn btn-small btn-secondary">
                                        Edytuj
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(banner.id)}
                                        className="btn btn-small btn-danger"
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {banners.length === 0 && (
                    <p className="empty-state">Brak banerów. Dodaj pierwszy!</p>
                )}
            </div>
        </div>
    );
}
