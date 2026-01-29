-- =============================================
-- AntyShoper - Przykładowe dane
-- Wykonaj w Supabase SQL Editor PO schema.sql
-- =============================================

-- Kategorie główne
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Części', 'czesci', 'Części zamienne do samochodów', 1),
('Oleje i płyny', 'oleje', 'Oleje silnikowe, płyny eksploatacyjne', 2),
('Opony', 'opony', 'Opony letnie, zimowe, całoroczne', 3),
('Narzędzia', 'narzedzia', 'Narzędzia warsztatowe', 4),
('Akcesoria', 'akcesoria', 'Akcesoria samochodowe', 5);

-- Podkategorie dla "Części"
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Hamulce', 'hamulce', id, 1 FROM categories WHERE slug = 'czesci';

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Filtry', 'filtry', id, 2 FROM categories WHERE slug = 'czesci';

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Zawieszenie', 'zawieszenie', id, 3 FROM categories WHERE slug = 'czesci';

-- Podkategorie dla "Oleje"
INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Oleje silnikowe', 'oleje-silnikowe', id, 1 FROM categories WHERE slug = 'oleje';

INSERT INTO categories (name, slug, parent_id, sort_order)
SELECT 'Płyny hamulcowe', 'plyny-hamulcowe', id, 2 FROM categories WHERE slug = 'oleje';

-- =============================================
-- PRODUKTY
-- =============================================

-- Olej Castrol EDGE 5W-30 (z wariantami pojemności)
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Castrol EDGE 5W-30 LL',
  'castrol-edge-5w30-ll',
  'W pełni syntetyczny olej silnikowy Castrol EDGE z technologią Fluid Titanium. Idealny do nowoczesnych silników benzynowych i diesla wymagających specyfikacji VW 504 00 / 507 00.',
  id,
  'VW, Audi, Skoda, Seat, BMW Longlife-04, Mercedes MB 229.51',
  ARRAY['https://images.unsplash.com/photo-1635784063388-1ff609e44c6c?w=500']
FROM categories WHERE slug = 'oleje-silnikowe';

-- Warianty dla Castrol EDGE
INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock_quantity, attributes)
SELECT id, 'CASTROL-EDGE-5W30-1L', '1L', 45.99, 52.99, 50, '{"volume": "1L", "viscosity": "5W-30"}'
FROM products WHERE slug = 'castrol-edge-5w30-ll';

INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock_quantity, attributes)
SELECT id, 'CASTROL-EDGE-5W30-4L', '4L', 159.99, 189.99, 30, '{"volume": "4L", "viscosity": "5W-30"}'
FROM products WHERE slug = 'castrol-edge-5w30-ll';

INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock_quantity, attributes)
SELECT id, 'CASTROL-EDGE-5W30-5L', '5L', 189.99, 219.99, 25, '{"volume": "5L", "viscosity": "5W-30"}'
FROM products WHERE slug = 'castrol-edge-5w30-ll';

-- Klocki hamulcowe Brembo
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Klocki hamulcowe Brembo P85075',
  'klocki-brembo-p85075',
  'Wysokiej jakości klocki hamulcowe Brembo. Doskonałe właściwości hamowania, niska emisja pyłu, cicha praca.',
  id,
  'VW Golf VII, Audi A3 8V, Skoda Octavia III, Seat Leon III',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500']
FROM categories WHERE slug = 'hamulce';

-- Wariant dla klocków (jeden wariant = przód)
INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'BREMBO-P85075', 'Komplet przód', 189.00, 15, '{"position": "front", "type": "disc"}'
FROM products WHERE slug = 'klocki-brembo-p85075';

-- Filtr oleju MANN
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Filtr oleju MANN W712/95',
  'filtr-oleju-mann-w712-95',
  'Oryginalnej jakości filtr oleju MANN-FILTER. Skuteczna filtracja, ochrona silnika.',
  id,
  'VW 1.4 TSI, 1.6 TDI, Audi A1, A3, Skoda Fabia, Octavia, Seat Ibiza, Leon',
  ARRAY['https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=500']
FROM categories WHERE slug = 'filtry';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'MANN-W712-95', 'Standard', 35.00, 100, '{"type": "oil_filter"}'
FROM products WHERE slug = 'filtr-oleju-mann-w712-95';

-- Filtr powietrza
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Filtr powietrza MANN C27009',
  'filtr-powietrza-mann-c27009',
  'Filtr powietrza MANN-FILTER. Wysoka skuteczność filtracji, długa żywotność.',
  id,
  'VW Golf VII 1.4 TSI, Audi A3 1.4 TFSI, Skoda Octavia III 1.4 TSI',
  ARRAY['https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500']
FROM categories WHERE slug = 'filtry';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'MANN-C27009', 'Standard', 65.00, 40, '{"type": "air_filter"}'
FROM products WHERE slug = 'filtr-powietrza-mann-c27009';

-- Amortyzator
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Amortyzator przód Bilstein B4',
  'amortyzator-bilstein-b4-przod',
  'Amortyzator gazowy Bilstein B4. Jakość OE, komfort jazdy i stabilność.',
  id,
  'VW Golf VII, Audi A3 8V, Skoda Octavia III 2012-2020',
  ARRAY['https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500']
FROM categories WHERE slug = 'zawieszenie';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'BILSTEIN-B4-VW7-L', 'Lewy', 320.00, 8, '{"position": "front", "side": "left"}'
FROM products WHERE slug = 'amortyzator-bilstein-b4-przod';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'BILSTEIN-B4-VW7-R', 'Prawy', 320.00, 8, '{"position": "front", "side": "right"}'
FROM products WHERE slug = 'amortyzator-bilstein-b4-przod';

-- Płyn hamulcowy
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Płyn hamulcowy ATE TYP 200 DOT 4',
  'plyn-hamulcowy-ate-dot4',
  'Syntetyczny płyn hamulcowy klasy DOT 4. Wysoka temperatura wrzenia, doskonała ochrona przed korozją.',
  id,
  'Uniwersalny - wszystkie pojazdy wymagające DOT 4',
  ARRAY['https://images.unsplash.com/photo-1635784063388-1ff609e44c6c?w=500']
FROM categories WHERE slug = 'plyny-hamulcowe';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'ATE-DOT4-1L', '1L', 42.00, 60, '{"volume": "1L", "type": "DOT 4"}'
FROM products WHERE slug = 'plyn-hamulcowy-ate-dot4';

-- Mobil 1 ESP (drugi olej z wariantami lepkości)
INSERT INTO products (name, slug, description, category_id, compatibility_tags, images)
SELECT
  'Mobil 1 ESP Formula',
  'mobil-1-esp-formula',
  'Syntetyczny olej silnikowy Mobil 1 ESP. Doskonała ochrona silnika, kompatybilny z filtrami cząstek stałych.',
  id,
  'VW 504 00 / 507 00, BMW LL-04, Mercedes MB 229.51, Porsche C30',
  ARRAY['https://images.unsplash.com/photo-1635784063388-1ff609e44c6c?w=500']
FROM categories WHERE slug = 'oleje-silnikowe';

-- Warianty Mobil 1 - różne lepkości
INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock_quantity, attributes)
SELECT id, 'MOBIL1-ESP-5W30-4L', '5W-30 4L', 179.99, 199.99, 20, '{"volume": "4L", "viscosity": "5W-30"}'
FROM products WHERE slug = 'mobil-1-esp-formula';

INSERT INTO product_variants (product_id, sku, name, price, compare_price, stock_quantity, attributes)
SELECT id, 'MOBIL1-ESP-0W30-4L', '0W-30 4L', 199.99, 229.99, 15, '{"volume": "4L", "viscosity": "0W-30"}'
FROM products WHERE slug = 'mobil-1-esp-formula';

INSERT INTO product_variants (product_id, sku, name, price, stock_quantity, attributes)
SELECT id, 'MOBIL1-ESP-5W30-1L', '5W-30 1L', 55.99, 35, '{"volume": "1L", "viscosity": "5W-30"}'
FROM products WHERE slug = 'mobil-1-esp-formula';
