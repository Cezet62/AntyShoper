import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import ImageUpload from '../../components/ImageUpload';
import './Admin.css';

export default function BannerForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        slot: 'hero',
        title: '',
        subtitle: '',
        button_text: '',
        button_link: '',
        image_url: '',
        is_active: true,
        sort_order: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditing) {
            loadBanner();
        }
    }, [id]);

    async function loadBanner() {
        const { data, error } = await supabase
            .from('banners')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            setError('Nie znaleziono banera');
            return;
        }

        setFormData({
            slot: data.slot || 'hero',
            title: data.title || '',
            subtitle: data.subtitle || '',
            button_text: data.button_text || '',
            button_link: data.button_link || '',
            image_url: data.image_url || '',
            is_active: data.is_active,
            sort_order: data.sort_order || 0
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const dataToSave = {
                ...formData,
                title: formData.title || null,
                subtitle: formData.subtitle || null,
                button_text: formData.button_text || null,
                button_link: formData.button_link || null,
                image_url: formData.image_url || null
            };

            if (isEditing) {
                const { error } = await supabase
                    .from('banners')
                    .update(dataToSave)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('banners')
                    .insert([dataToSave]);
                if (error) throw error;
            }

            navigate('/admin/banery');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const slotOptions = [
        { value: 'hero', label: 'Baner główny (hero) — duży baner na górze strony' },
        { value: 'promo_main', label: 'Baner promocyjny — obok sekcji promocji' }
    ];

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>{isEditing ? 'Edytuj baner' : 'Nowy baner'}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <h3>Ustawienia banera</h3>

                    <div className="form-group">
                        <label>Slot (miejsce na stronie) *</label>
                        <select
                            value={formData.slot}
                            onChange={(e) => setFormData(prev => ({ ...prev, slot: e.target.value }))}
                        >
                            {slotOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <small>Wybierz gdzie baner ma się wyświetlać na stronie głównej</small>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            Baner aktywny (widoczny na stronie)
                        </label>
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

                <div className="form-section">
                    <h3>Zdjęcie banera</h3>

                    <ImageUpload
                        onUpload={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
                        folder="banners"
                        currentImage={formData.image_url || undefined}
                    />
                    <small style={{ display: 'block', marginTop: '10px', color: '#64748b' }}>
                        Zalecany rozmiar: Hero — 1920x600px, Promo — 600x400px
                    </small>
                </div>

                <div className="form-section">
                    <h3>Treść</h3>

                    <div className="form-group">
                        <label>Tytuł</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="np. CZĘŚCI I AKCESORIA"
                        />
                    </div>

                    <div className="form-group">
                        <label>Podtytuł</label>
                        <input
                            type="text"
                            value={formData.subtitle}
                            onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                            placeholder="np. DLA TWOJEGO SAMOCHODU"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Tekst przycisku</label>
                            <input
                                type="text"
                                value={formData.button_text}
                                onChange={(e) => setFormData(prev => ({ ...prev, button_text: e.target.value }))}
                                placeholder="np. SPRAWDŹ"
                            />
                        </div>
                        <div className="form-group">
                            <label>Link przycisku</label>
                            <input
                                type="text"
                                value={formData.button_link}
                                onChange={(e) => setFormData(prev => ({ ...prev, button_link: e.target.value }))}
                                placeholder="np. /kategoria/opony"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/banery')} className="btn btn-secondary">
                        Anuluj
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Zapisywanie...' : 'Zapisz baner'}
                    </button>
                </div>
            </form>
        </div>
    );
}
