-- =============================================
-- Banery — dynamiczne obrazki na stronie głównej
-- Wykonaj w Supabase SQL Editor
-- =============================================

-- Tabela banerów
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot TEXT NOT NULL,              -- 'hero', 'promo_main', itd.
  title TEXT,
  subtitle TEXT,
  button_text TEXT,
  button_link TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indeks na slot (szybkie wyszukiwanie)
CREATE INDEX idx_banners_slot ON banners(slot);

-- Trigger updated_at (reużycie istniejącej funkcji)
CREATE TRIGGER banners_updated_at
  BEFORE UPDATE ON banners
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Publiczny odczyt aktywnych banerów
CREATE POLICY "Active banners are viewable by everyone"
ON banners FOR SELECT
USING (is_active = true);

-- Admin może wszystko z banerami
CREATE POLICY "Admin full access to banners"
ON banners FOR ALL
USING (auth.role() = 'authenticated');

-- =============================================
-- Domyślne banery (sloty)
-- =============================================

INSERT INTO banners (slot, title, subtitle, button_text, button_link, sort_order) VALUES
  ('hero', 'CZĘŚCI I AKCESORIA', 'DLA TWOJEGO SAMOCHODU', NULL, NULL, 1),
  ('promo_main', 'JUŻ CZAS', 'NA ZMIANĘ OPON', 'SPRAWDŹ', '/kategoria/opony', 2);
