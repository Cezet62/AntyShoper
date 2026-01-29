import brakeDisc from '../assets/images/product_brake_disc.png';
import winterTire from '../assets/images/banner_winter_tire.png'; // Using banner image for tires temporarily
import enginePart from '../assets/images/category_engine.png'; // Using category image for engine parts

export const products = [
    {
        id: 1,
        name: 'Tarcze hamulcowe - komplet',
        price: 849.00,
        oldPrice: null,
        image: brakeDisc,
        sku: 'ST45-123DE',
        category: 'hamulce',
        description: 'Wysokiej jakości wentylowane tarcze hamulcowe.',
        specs: { 'Producent': 'Brembo', 'Strona': 'Przód' }
    },
    {
        id: 2,
        name: 'Klocki hamulcowe - komplet',
        price: 145.00,
        oldPrice: 189.00,
        image: brakeDisc,
        sku: 'BR-9988-XL',
        category: 'hamulce',
        description: 'Klocki hamulcowe o wydłużonej żywotności.',
        specs: { 'Producent': 'TRW', 'Strona': 'Przód' }
    },
    {
        id: 3,
        name: 'Zestaw hamulcowy sport',
        price: 1299.00,
        oldPrice: null,
        image: brakeDisc,
        sku: 'SP-RACING-01',
        category: 'hamulce',
        description: 'Kompletny zestaw hamulcowy dla wymagających.',
        specs: { 'Producent': 'EBC', 'Przeznaczenie': 'Sport' }
    },
    {
        id: 4,
        name: 'Opona Zimowa 205/55 R16',
        price: 349.00,
        oldPrice: 420.00,
        image: winterTire,
        sku: 'TR-WINT-16',
        category: 'opony',
        description: 'Opona zimowa z bieżnikiem kierunkowym.',
        specs: { 'Producent': 'Michelin', 'Sezon': 'Zima', 'Rozmiar': '205/55 R16' }
    },
    {
        id: 5,
        name: 'Olej Silnikowy 5W-30 5L',
        price: 189.00,
        oldPrice: null,
        image: enginePart,
        sku: 'OIL-SYN-5L',
        category: 'oleje',
        description: 'Syntetyczny olej silnikowy najnowszej generacji.',
        specs: { 'Producent': 'Castrol', 'Lepkość': '5W-30', 'Pojemność': '5L' }
    },
    {
        id: 6,
        name: 'Filtr Oleju',
        price: 35.00,
        oldPrice: null,
        image: enginePart,
        sku: 'FIL-OIL-01',
        category: 'filtry',
        description: 'Wysokowydajny filtr oleju.',
        specs: { 'Producent': 'Filtron', 'Rodzaj': 'Wkręcany' }
    }
];
