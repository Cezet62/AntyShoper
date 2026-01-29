import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function CategoryForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        sort_order: 0
    });
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadCategory();
        }
    }, [id]);

    async function loadCategories() {
        const { data } = await supabase
            .from('categories')
            .select('id, name')
            .order('name');
        setCategories(data || []);
    }

    async function loadCategory() {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setError('Nie znaleziono kategorii');
            return;
        }

        setFormData({
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            parent_id: data.parent_id || '',
            sort_order: data.sort_order || 0
        });
    }

    function generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[ąá]/g, 'a')
            .replace(/[ćč]/g, 'c')
            .replace(/[ęé]/g, 'e')
            .replace(/[łĺ]/g, 'l')
            .replace(/[ńň]/g, 'n')
            .replace(/[óô]/g, 'o')
            .replace(/[śš]/g, 's')
            .replace(/[źżž]/g, 'z')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    function handleNameChange(e) {
        const name = e.target.value;
        setFormData(prev => ({
            ...prev,
            name,
            slug: isEditing ? prev.slug : generateSlug(name)
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const dataToSave = {
                ...formData,
                parent_id: formData.parent_id || null
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('categories')
                    .update(dataToSave)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('categories')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            navigate('/admin/kategorie');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>{isEditing ? 'Edytuj kategorię' : 'Nowa kategoria'}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                    <label>Nazwa *</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        required
                        placeholder="np. Oleje silnikowe"
                    />
                </div>

                <div className="form-group">
                    <label>Slug *</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                        placeholder="oleje-silnikowe"
                    />
                    <small>URL-friendly identyfikator (bez polskich znaków)</small>
                </div>

                <div className="form-group">
                    <label>Opis</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        placeholder="Krótki opis kategorii..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Kategoria nadrzędna</label>
                        <select
                            value={formData.parent_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, parent_id: e.target.value }))}
                        >
                            <option value="">— Brak (kategoria główna) —</option>
                            {categories
                                .filter(c => c.id !== id)
                                .map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))
                            }
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Kolejność sortowania</label>
                        <input
                            type="number"
                            value={formData.sort_order}
                            onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/kategorie')} className="btn btn-secondary">
                        Anuluj
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Zapisywanie...' : 'Zapisz'}
                    </button>
                </div>
            </form>
        </div>
    );
}
