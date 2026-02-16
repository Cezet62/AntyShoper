import { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './SuccessPage.css';

const SuccessPage = ({ clearCart }) => {
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [orderNumber, setOrderNumber] = useState(location.state?.orderNumber || null);

    // Parsuj parametry z URL (Stripe redirect)
    const sessionId = searchParams.get('session_id');
    const orderId = searchParams.get('order');

    useEffect(() => {
        // Wyczyść koszyk po udanej płatności
        if (sessionId || location.state?.orderNumber) {
            clearCart();
        }

        // Pobierz numer zamówienia jeśli przyszliśmy ze Stripe (mamy orderId ale nie orderNumber)
        if (orderId && !orderNumber) {
            supabase
                .from('orders')
                .select('order_number')
                .eq('id', orderId)
                .single()
                .then(({ data }) => {
                    if (data?.order_number) {
                        setOrderNumber(data.order_number);
                    }
                });
        }
    }, []);

    return (
        <div className="success-page">
            <div className="container success-container">
                <div className="success-icon">✅</div>
                <h1>Dziękujemy za zamówienie!</h1>
                {orderNumber && (
                    <p className="order-number">Numer zamówienia: <strong>{orderNumber}</strong></p>
                )}
                {sessionId && (
                    <p>Płatność została przyjęta. Twoje zamówienie jest w trakcie realizacji.</p>
                )}
                {!sessionId && (
                    <p>Twoje zamówienie zostało przyjęte do realizacji. Na Twój adres email wysłaliśmy potwierdzenie.</p>
                )}
                <Link to="/" className="btn btn-primary">WRÓĆ DO SKLEPU</Link>
            </div>
        </div>
    );
};

export default SuccessPage;
