import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success('Produkt dodany do koszyka!');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (id, quantity) => {
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <div className="app">
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
          }
        }} />
        <Header cartCount={cartCount} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
            <Route path="/kategoria/:id" element={<CategoryPage />} />
            <Route path="/produkt/:id" element={<ProductPage onAddToCart={addToCart} />} />
            <Route path="/koszyk" element={<CartPage cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
            <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} clearCart={clearCart} />} />
            <Route path="/sukces" element={<SuccessPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
