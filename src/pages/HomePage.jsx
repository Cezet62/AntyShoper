import React from 'react';
import { Helmet } from 'react-helmet-async';
import HeroSection from '../components/HeroSection';
import BrandSelector from '../components/BrandSelector';
import FeaturesBar from '../components/FeaturesBar';
import CategoryGrid from '../components/CategoryGrid';
import ProductShowcase from '../components/ProductShowcase';

const HomePage = ({ onAddToCart }) => {
    return (
        <>
            <Helmet>
                <title>AutoPartsDirect — Części samochodowe online</title>
                <meta name="description" content="AutoPartsDirect — Twój sklep z częściami samochodowymi online. Największy wybór części do aut europejskich, japońskich i amerykańskich." />
                <meta property="og:title" content="AutoPartsDirect — Części samochodowe online" />
                <meta property="og:description" content="Największy wybór części samochodowych online. Szybka dostawa, konkurencyjne ceny." />
                <meta property="og:type" content="website" />
            </Helmet>
            <HeroSection />
            <FeaturesBar />
            <BrandSelector />
            <CategoryGrid />
            <ProductShowcase onAddToCart={onAddToCart} />
        </>
    );
};

export default HomePage;
