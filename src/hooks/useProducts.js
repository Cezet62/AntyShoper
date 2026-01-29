import { useState, useEffect } from 'react';
import {
    getProducts,
    getProductBySlug,
    getProductsByCategory,
    getFeaturedProducts,
    searchProducts,
    mapProductToFrontend
} from '../lib/api';

export function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data.map(mapProductToFrontend));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    return { products, loading, error };
}

export function useProduct(slug) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!slug) return;

        async function load() {
            try {
                setLoading(true);
                const data = await getProductBySlug(slug);
                setProduct(mapProductToFrontend(data));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [slug]);

    return { product, loading, error };
}

export function useProductsByCategory(categorySlug) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categorySlug) return;

        async function load() {
            try {
                setLoading(true);
                const data = await getProductsByCategory(categorySlug);
                setProducts(data.map(mapProductToFrontend));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [categorySlug]);

    return { products, loading, error };
}

export function useFeaturedProducts(limit = 6) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                setLoading(true);
                const data = await getFeaturedProducts(limit);
                setProducts(data.map(mapProductToFrontend));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [limit]);

    return { products, loading, error };
}

export function useProductSearch(query) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setProducts([]);
            return;
        }

        async function load() {
            try {
                setLoading(true);
                const data = await searchProducts(query);
                setProducts(data.map(mapProductToFrontend));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        // Debounce
        const timer = setTimeout(load, 300);
        return () => clearTimeout(timer);
    }, [query]);

    return { products, loading, error };
}
