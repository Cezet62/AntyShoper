import React from 'react';
import HeroSection from '../components/HeroSection';
import BrandSelector from '../components/BrandSelector';
import FeaturesBar from '../components/FeaturesBar';
import CategoryGrid from '../components/CategoryGrid';
import ProductShowcase from '../components/ProductShowcase';

const HomePage = ({ onAddToCart }) => {
    return (
        <>
            <HeroSection />
            <FeaturesBar />
            <BrandSelector />
            <CategoryGrid />
            <ProductShowcase onAddToCart={onAddToCart} />
        </>
    );
};

export default HomePage;
