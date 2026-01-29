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

// Admin
import { AuthProvider } from './contexts/AuthContext';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import CategoryForm from './pages/admin/CategoryForm';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Orders from './pages/admin/Orders';

function App() {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      // Unikalne ID = produkt + wariant
      const cartId = product.variantId ? `${product.id}-${product.variantId}` : product.id;
      const existing = prev.find(item => item.cartId === cartId);
      if (existing) {
        const newQuantity = existing.quantity + (product.quantity || 1);
        return prev.map(item => item.cartId === cartId ? { ...item, quantity: newQuantity } : item);
      }
      return [...prev, { ...product, cartId, quantity: product.quantity || 1 }];
    });
    toast.success('Produkt dodany do koszyka!');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const updateQuantity = (cartId, quantity) => {
    setCartItems(prev => prev.map(item => item.cartId === cartId ? { ...item, quantity } : item));
  };

  const removeFromCart = (cartId) => {
    setCartItems(prev => prev.filter(item => item.cartId !== cartId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <AuthProvider>
      <Router>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
          }
        }} />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="kategorie" element={<Categories />} />
            <Route path="kategorie/nowa" element={<CategoryForm />} />
            <Route path="kategorie/:id" element={<CategoryForm />} />
            <Route path="produkty" element={<Products />} />
            <Route path="produkty/nowy" element={<ProductForm />} />
            <Route path="produkty/:id" element={<ProductForm />} />
            <Route path="zamowienia" element={<Orders />} />
          </Route>

          {/* Shop Routes */}
          <Route path="/*" element={
            <div className="app">
              <Header cartCount={cartCount} />
              <main>
                <Routes>
                  <Route path="/" element={<HomePage onAddToCart={addToCart} />} />
                  <Route path="/kategoria/:id" element={<CategoryPage onAddToCart={addToCart} />} />
                  <Route path="/produkt/:slug" element={<ProductPage onAddToCart={addToCart} />} />
                  <Route path="/koszyk" element={<CartPage cartItems={cartItems} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />} />
                  <Route path="/checkout" element={<CheckoutPage cartItems={cartItems} clearCart={clearCart} />} />
                  <Route path="/sukces" element={<SuccessPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
