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
        .maybeSingle();

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
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function getProductsByCategory(categorySlug) {
    // Najpierw znajdź kategorię
    const category = await getCategoryBySlug(categorySlug);

    // Jeśli kategoria nie istnieje, zwróć pustą tablicę
    if (!category) {
        return [];
    }

    // Pobierz produkty z tej kategorii i podkategorii
    const { data: categories } = await supabase
        .from('categories')
        .select('id')
        .or(`id.eq.${category.id},parent_id.eq.${category.id}`);

    const categoryIds = categories?.map(c => c.id) || [];

    if (categoryIds.length === 0) {
        return [];
    }

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
    return data || [];
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
// ZAMÓWIENIA
// =============================================

export async function createOrder(orderData) {
    const { customerData, cartItems, deliveryMethod, deliveryCost, selectedLocker } = orderData;

    // Oblicz sumy
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + deliveryCost;

    // Przygotuj adres dostawy
    let shippingAddress = {};
    if (deliveryMethod === 'inpost' && selectedLocker) {
        shippingAddress = {
            type: 'inpost_locker',
            locker_name: selectedLocker.name,
            locker_address: selectedLocker.address,
            locker_city: selectedLocker.city,
            locker_post_code: selectedLocker.postCode
        };
    } else {
        shippingAddress = {
            type: 'courier',
            street: customerData.address,
            city: customerData.city,
            post_code: customerData.zipCode
        };
    }

    // Utwórz zamówienie
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([{
            customer_email: customerData.email,
            customer_phone: customerData.phone || null,
            customer_name: `${customerData.firstName} ${customerData.lastName}`,
            shipping_method: deliveryMethod === 'inpost' ? 'inpost_locker' : 'dpd',
            shipping_address: shippingAddress,
            shipping_cost: deliveryCost,
            payment_method: customerData.paymentMethod,
            subtotal: subtotal,
            total: total,
            status: 'pending',
            payment_status: 'pending'
        }])
        .select()
        .single();

    if (orderError) throw orderError;

    // Dodaj pozycje zamówienia
    const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.id,
        variant_id: item.variantId || null,
        product_name: item.name,
        variant_name: item.variantName || null,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

    if (itemsError) throw itemsError;

    return order;
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
        image: product.images?.[0] || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%231e293b'/%3E%3Ctext x='200' y='190' text-anchor='middle' fill='%2364748b' font-family='sans-serif' font-size='16'%3EBrak zdj%C4%99cia%3C/text%3E%3Cpath d='M175 230 l15-20 10 12 15-18 20 26z' fill='%2364748b'/%3E%3Ccircle cx='190' cy='218' r='6' fill='%2364748b'/%3E%3C/svg%3E",
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

// =============================================
// STORAGE: Upload i zarządzanie obrazami
// =============================================

export async function uploadImage(file, folder = 'products') {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

    const { data, error } = await supabase
        .storage
        .from('product-images')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
        });

    if (error) throw error;

    const { data: { publicUrl } } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(data.path);

    return publicUrl;
}

export async function deleteImage(imageUrl) {
    const url = new URL(imageUrl);
    const pathParts = url.pathname.split('/storage/v1/object/public/product-images/');
    if (pathParts.length < 2) return;

    const filePath = pathParts[1];

    const { error } = await supabase
        .storage
        .from('product-images')
        .remove([filePath]);

    if (error) throw error;
}
