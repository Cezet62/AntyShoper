import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import './Admin.css';

const STATUS_LABELS = {
    pending: 'Oczekujące',
    paid: 'Opłacone',
    shipped: 'Wysłane',
    delivered: 'Dostarczone',
    cancelled: 'Anulowane'
};

const STATUS_COLORS = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger'
};

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        try {
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    items:order_items(*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setOrders(data || []);
        } catch (err) {
            console.error('Error loading orders:', err);
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(orderId, newStatus) {
        try {
            const updates = { status: newStatus };
            if (newStatus === 'shipped') {
                updates.shipped_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from('orders')
                .update(updates)
                .eq('id', orderId);

            if (error) throw error;

            setOrders(orders.map(o =>
                o.id === orderId ? { ...o, ...updates } : o
            ));
        } catch (err) {
            alert('Błąd: ' + err.message);
        }
    }

    const formatPrice = (price) => {
        return price?.toLocaleString('pl-PL', { minimumFractionDigits: 2 }) + ' zł';
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('pl-PL', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.status === filter);

    if (loading) {
        return <div className="admin-page"><p>Ładowanie...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="page-header">
                <h1>Zamówienia</h1>
            </div>

            <div className="filters-bar">
                <button
                    className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    Wszystkie ({orders.length})
                </button>
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                    const count = orders.filter(o => o.status === key).length;
                    return (
                        <button
                            key={key}
                            className={`filter-btn ${filter === key ? 'active' : ''}`}
                            onClick={() => setFilter(key)}
                        >
                            {label} ({count})
                        </button>
                    );
                })}
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nr zamówienia</th>
                            <th>Data</th>
                            <th>Klient</th>
                            <th>Produkty</th>
                            <th>Wartość</th>
                            <th>Status</th>
                            <th>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td><strong>{order.order_number}</strong></td>
                                <td>{formatDate(order.created_at)}</td>
                                <td>
                                    <div>
                                        <strong>{order.customer_name}</strong>
                                        <br />
                                        <small>{order.customer_email}</small>
                                    </div>
                                </td>
                                <td>
                                    {order.items?.length || 0} pozycji
                                </td>
                                <td><strong>{formatPrice(order.total)}</strong></td>
                                <td>
                                    <span className={`status-badge ${STATUS_COLORS[order.status]}`}>
                                        {STATUS_LABELS[order.status]}
                                    </span>
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateStatus(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <p className="empty-state">Brak zamówień do wyświetlenia.</p>
                )}
            </div>
        </div>
    );
}
