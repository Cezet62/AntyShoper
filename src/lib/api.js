import { supabase } from './supabase';

// =============================================
// KATEGORIE
// =============================================

export async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

    if (error) throw error;
    return data;
}

export async function getCategoryBySlug(slug) {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) throw error;
    return data;
}

// =============================================
// PRODUKTY
// =============================================

export async function getProducts() {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getProductBySlug(slug) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq('slug', slug)
        .single();

    if (error) throw error;
    return data;
}

export async function getProductsByCategory(categorySlug) {
    // Najpierw znajdź kategorię
    const category = await getCategoryBySlug(categorySlug);

    // Pobierz produkty z tej kategorii i podkategorii
    const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .or(`id.eq.${category.id},parent_id.eq.${category.id}`);

    const categoryIds = categories.map(c => c.id);

    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq('is_active', true)
        .in('category_id', categoryIds)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function getFeaturedProducts(limit = 6) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data;
}

export async function searchProducts(query) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(*),
            variants:product_variants(*)
        `)
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,compatibility_tags.ilike.%${query}%,description.ilike.%${query}%`);

    if (error) throw error;
    return data;
}

// =============================================
// HELPER: Mapowanie produktu do formatu frontend
// =============================================

export function mapProductToFrontend(product) {
    // Znajdź najtańszy wariant jako domyślny
    const variants = product.variants || [];
    const defaultVariant = variants.length > 0
        ? variants.reduce((min, v) => v.price < min.price ? v : min, variants[0])
        : null;

    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: defaultVariant?.price || 0,
        oldPrice: defaultVariant?.compare_price || null,
        image: product.images?.[0] || '/placeholder.jpg',
        images: product.images || [],
        sku: defaultVariant?.sku || '',
        category: product.category?.slug || '',
        categoryName: product.category?.name || '',
        compatibility: product.compatibility_tags || '',
        variants: variants.map(v => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price,
            oldPrice: v.compare_price,
            stock: v.stock_quantity,
            attributes: v.attributes || {}
        })),
        hasVariants: variants.length > 1
    };
}
