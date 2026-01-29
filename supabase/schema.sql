-- =============================================
-- AntyShoper - Schemat bazy danych
-- Wykonaj w Supabase SQL Editor
-- =============================================

-- Kategorie
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id),
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Produkty
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  compatibility_tags TEXT,  -- "Audi A4 B8 2008-2015, BMW 3 E90"
  images TEXT[],            -- array of URLs
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Warianty produktów (cena, stan magazynowy)
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE,
  name TEXT NOT NULL,       -- "5W-30 / 4L"
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),  -- cena przed promocją
  stock_quantity INTEGER DEFAULT 0,
  attributes JSONB,         -- {"viscosity": "5W-30", "volume": "4L"}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Zamówienia
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',  -- pending, paid, shipped, delivered, cancelled

  -- Dane klienta
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_name TEXT NOT NULL,

  -- Dane do faktury (opcjonalne)
  invoice_company TEXT,
  invoice_nip TEXT,
  invoice_address TEXT,

  -- Adres dostawy
  shipping_method TEXT NOT NULL,  -- 'inpost_locker', 'inpost_courier', 'dpd'
  shipping_address JSONB,         -- {locker_id, locker_name, street, city, postal_code...}
  shipping_cost DECIMAL(10,2),

  -- Płatność
  payment_method TEXT DEFAULT 'przelewy24',
  payment_id TEXT,                -- ID transakcji Przelewy24
  payment_status TEXT DEFAULT 'pending',

  -- Kwoty
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,

  -- Tracking
  tracking_number TEXT,
  shipped_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pozycje zamówienia
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant_id UUID REFERENCES product_variants(id),
  product_name TEXT NOT NULL,     -- snapshot nazwy
  variant_name TEXT,              -- snapshot wariantu
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL
);

-- =============================================
-- INDEKSY
-- =============================================

-- Full-text search na produktach
CREATE INDEX idx_products_search ON products
USING GIN (to_tsvector('simple', name || ' ' || COALESCE(description, '') || ' ' || COALESCE(compatibility_tags, '')));

-- Szybkie wyszukiwanie po slug
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Produkty w kategorii
CREATE INDEX idx_products_category ON products(category_id);

-- Warianty produktu
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- Zamówienia po statusie i dacie
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Włącz RLS na wszystkich tabelach
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Polityki dla kategorii (publiczny odczyt)
CREATE POLICY "Categories are viewable by everyone"
ON categories FOR SELECT
USING (true);

-- Polityki dla produktów (publiczny odczyt aktywnych)
CREATE POLICY "Active products are viewable by everyone"
ON products FOR SELECT
USING (is_active = true);

-- Polityki dla wariantów (publiczny odczyt aktywnych)
CREATE POLICY "Active variants are viewable by everyone"
ON product_variants FOR SELECT
USING (is_active = true);

-- Polityki dla zamówień (klient widzi tylko swoje po email - w przyszłości)
-- Na razie brak publicznego dostępu
CREATE POLICY "Orders are not publicly viewable"
ON orders FOR SELECT
USING (false);

CREATE POLICY "Order items are not publicly viewable"
ON order_items FOR SELECT
USING (false);

-- =============================================
-- POLITYKI DLA ADMINA (authenticated users)
-- =============================================

-- Admin może wszystko z kategoriami
CREATE POLICY "Admin full access to categories"
ON categories FOR ALL
USING (auth.role() = 'authenticated');

-- Admin może wszystko z produktami
CREATE POLICY "Admin full access to products"
ON products FOR ALL
USING (auth.role() = 'authenticated');

-- Admin może wszystko z wariantami
CREATE POLICY "Admin full access to variants"
ON product_variants FOR ALL
USING (auth.role() = 'authenticated');

-- Admin może wszystko z zamówieniami
CREATE POLICY "Admin full access to orders"
ON orders FOR ALL
USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to order items"
ON order_items FOR ALL
USING (auth.role() = 'authenticated');

-- =============================================
-- FUNKCJE POMOCNICZE
-- =============================================

-- Automatyczna aktualizacja updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger dla products
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger dla orders
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Generowanie numeru zamówienia
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'APD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
                     LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_generate_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION generate_order_number();
