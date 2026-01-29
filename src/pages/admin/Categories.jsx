import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*, parent:categories!parent_id(name)')
                .order('sort_order');

            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error('Error loading categories:', err);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm('Czy na pewno chcesz usunąć tę kategorię?')) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCategories(categories.filter(c => c.id !== id));
        } catch (err) {
            alert('Błąd podczas usuwania: ' + err.message);
        }
    }

    if (loading) {
        return <div className="admin-page"><p>Ładowanie...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Kategorie</h1>
                <Link to="/admin/kategorie/nowa" className="btn btn-primary">
                    + Dodaj kategorię
                </Link>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nazwa</th>
                            <th>Slug</th>
                            <th>Kategoria nadrzędna</th>
                            <th>Kolejność</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id}>
                                <td><strong>{category.name}</strong></td>
                                <td><code>{category.slug}</code></td>
                                <td>{category.parent?.name || '—'}</td>
                                <td>{category.sort_order}</td>
                                <td className="actions-cell">
                                    <Link to={`/admin/kategorie/${category.id}`} className="btn btn-small btn-secondary">
                                        Edytuj
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(category.id)}
                                        className="btn btn-small btn-danger"
                                    >
                                        Usuń
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {categories.length === 0 && (
                    <p className="empty-state">Brak kategorii. Dodaj pierwszą!</p>
                )}
            </div>
        </div>
    );
}
