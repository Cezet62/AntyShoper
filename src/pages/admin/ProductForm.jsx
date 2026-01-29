import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import './Admin.css';

export default function ProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        category_id: '',
        compatibility_tags: '',
        images: [],
        is_active: true
    });

    const [variants, setVariants] = useState([
        { id: null, name: 'Domyślny', sku: '', price: '', compare_price: '', stock_quantity: 0, attributes: {} }
    ]);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        loadCategories();
        if (isEditing) {
            loadProduct();
        }
    }, [id]);

    async function loadCategories() {
        const { data } = await supabase
            .from('categories')
            .select('id, name, parent_id')
            .order('sort_order');
        setCategories(data || []);
    }

    async function loadProduct() {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                variants:product_variants(*)
            `)
            .eq('id', id)
            .single();

        if (error) {
            setError('Nie znaleziono produktu');
            return;
        }

        setFormData({
            name: data.name || '',
            slug: data.slug || '',
            description: data.description || '',
            category_id: data.category_id || '',
            compatibility_tags: data.compatibility_tags || '',
            images: data.images || [],
            is_active: data.is_active
        });

        if (data.variants?.length > 0) {
            setVariants(data.variants.map(v => ({
                id: v.id,
                name: v.name || '',
                sku: v.sku || '',
                price: v.price || '',
                compare_price: v.compare_price || '',
                stock_quantity: v.stock_quantity || 0,
                attributes: v.attributes || {}
            })));
        }
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

    function addVariant() {
        setVariants([...variants, {
            id: null,
            name: '',
            sku: '',
            price: '',
            compare_price: '',
            stock_quantity: 0,
            attributes: {}
        }]);
    }

    function updateVariant(index, field, value) {
        setVariants(variants.map((v, i) =>
            i === index ? { ...v, [field]: value } : v
        ));
    }

    function removeVariant(index) {
        if (variants.length === 1) {
            alert('Produkt musi mieć przynajmniej jeden wariant');
            return;
        }
        setVariants(variants.filter((_, i) => i !== index));
    }

    function addImage() {
        if (imageUrl && !formData.images.includes(imageUrl)) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageUrl]
            }));
            setImageUrl('');
        }
    }

    function removeImage(index) {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const productData = {
                name: formData.name,
                slug: formData.slug,
                description: formData.description,
                category_id: formData.category_id || null,
                compatibility_tags: formData.compatibility_tags,
                images: formData.images,
                is_active: formData.is_active
            };

            let productId = id;

            if (isEditing) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', id);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([productData])
                    .select()
                    .single();
                if (error) throw error;
                productId = data.id;
            }

            // Zapisz warianty
            for (const variant of variants) {
                const variantData = {
                    product_id: productId,
                    name: variant.name,
                    sku: variant.sku || null,
                    price: parseFloat(variant.price) || 0,
                    compare_price: variant.compare_price ? parseFloat(variant.compare_price) : null,
                    stock_quantity: parseInt(variant.stock_quantity) || 0,
                    attributes: variant.attributes
                };

                if (variant.id) {
                    // Update existing
                    const { error } = await supabase
                        .from('product_variants')
                        .update(variantData)
                        .eq('id', variant.id);
                    if (error) throw error;
                } else {
                    // Insert new
                    const { error } = await supabase
                        .from('product_variants')
                        .insert([variantData]);
                    if (error) throw error;
                }
            }

            // Usuń usunięte warianty (tylko przy edycji)
            if (isEditing) {
                const existingIds = variants.filter(v => v.id).map(v => v.id);
                if (existingIds.length > 0) {
                    await supabase
                        .from('product_variants')
                        .delete()
                        .eq('product_id', productId)
                        .not('id', 'in', `(${existingIds.join(',')})`);
                }
            }

            navigate('/admin/produkty');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    // Grupowanie kategorii
    const mainCategories = categories.filter(c => !c.parent_id);
    const getSubcategories = (parentId) => categories.filter(c => c.parent_id === parentId);

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>{isEditing ? 'Edytuj produkt' : 'Nowy produkt'}</h1>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-section">
                    <h3>Informacje podstawowe</h3>

                    <div className="form-group">
                        <label>Nazwa produktu *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            required
                            placeholder="np. Olej Castrol EDGE 5W-30"
                        />
                    </div>

                    <div className="form-group">
                        <label>Slug *</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            required
                            placeholder="olej-castrol-edge-5w30"
                        />
                    </div>

                    <div className="form-group">
                        <label>Kategoria</label>
                        <select
                            value={formData.category_id}
                            onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                        >
                            <option value="">— Wybierz kategorię —</option>
                            {mainCategories.map(cat => (
                                <optgroup key={cat.id} label={cat.name}>
                                    <option value={cat.id}>{cat.name}</option>
                                    {getSubcategories(cat.id).map(sub => (
                                        <option key={sub.id} value={sub.id}>↳ {sub.name}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Opis</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={4}
                            placeholder="Szczegółowy opis produktu..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Kompatybilność (tagi pojazdów)</label>
                        <textarea
                            value={formData.compatibility_tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, compatibility_tags: e.target.value }))}
                            rows={2}
                            placeholder="VW Golf VII, Audi A3 8V, Skoda Octavia III 2012-2020"
                        />
                        <small>Rozdziel przecinkami. Używane do wyszukiwania.</small>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.is_active}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                            />
                            Produkt aktywny (widoczny w sklepie)
                        </label>
                    </div>
                </div>

                <div className="form-section">
                    <h3>Zdjęcia</h3>

                    <div className="images-grid">
                        {formData.images.map((img, index) => (
                            <div key={index} className="image-preview">
                                <img src={img} alt="" />
                                <button type="button" onClick={() => removeImage(index)} className="remove-image">✕</button>
                            </div>
                        ))}
                    </div>

                    <div className="form-row">
                        <div className="form-group" style={{ flex: 1 }}>
                            <input
                                type="url"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="URL zdjęcia"
                            />
                        </div>
                        <button type="button" onClick={addImage} className="btn btn-secondary">
                            Dodaj zdjęcie
                        </button>
                    </div>
                </div>

                <div className="form-section">
                    <div className="section-header">
                        <h3>Warianty produktu</h3>
                        <button type="button" onClick={addVariant} className="btn btn-secondary btn-small">
                            + Dodaj wariant
                        </button>
                    </div>

                    {variants.map((variant, index) => (
                        <div key={index} className="variant-card">
                            <div className="variant-header">
                                <span>Wariant {index + 1}</span>
                                {variants.length > 1 && (
                                    <button type="button" onClick={() => removeVariant(index)} className="btn btn-danger btn-small">
                                        Usuń
                                    </button>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nazwa wariantu *</label>
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => updateVariant(index, 'name', e.target.value)}
                                        required
                                        placeholder="np. 4L lub 5W-30 / 4L"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>SKU</label>
                                    <input
                                        type="text"
                                        value={variant.sku}
                                        onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                        placeholder="CASTROL-5W30-4L"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Cena (zł) *</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={variant.price}
                                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                                        required
                                        placeholder="159.99"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Cena przed promocją (zł)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={variant.compare_price}
                                        onChange={(e) => updateVariant(index, 'compare_price', e.target.value)}
                                        placeholder="189.99"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Stan magazynowy</label>
                                    <input
                                        type="number"
                                        value={variant.stock_quantity}
                                        onChange={(e) => updateVariant(index, 'stock_quantity', e.target.value)}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/admin/produkty')} className="btn btn-secondary">
                        Anuluj
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Zapisywanie...' : 'Zapisz produkt'}
                    </button>
                </div>
            </form>
        </div>
    );
}
