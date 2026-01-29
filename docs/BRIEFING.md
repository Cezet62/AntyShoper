# BRIEFING DLA CLAUDE CODE - AntyShoper

**Data:** 2025-01-29
**Cel:** Kontekst projektu dla sesji w VS Code

---

## 🎯 CO TO ZA PROJEKT

Sklep internetowy z częściami samochodowymi dla Auto-Parts Direct. Frontend (React + Vite) już istnieje i działa. Teraz budujemy backend (Supabase) i panel admina.

**Owner:** Cezary Ziarkowski
**Klient:** Auto-Parts Direct
**Live:** https://anty-shoper.vercel.app/
**Repo:** https://github.com/Cezet62/AntyShoper

---

## 📊 AKTUALNY STATUS

**Faza:** DEVELOPMENT

**Co już działa (frontend):**
- ✅ Katalog produktów (hardcoded)
- ✅ Kategorie
- ✅ Koszyk (dodawanie, usuwanie, ilości)
- ✅ InPost Geowidget (wybór paczkomatu)
- ✅ Przelewy24 (flow płatności — prawdopodobnie testowy)
- ✅ Deploy na Vercel

**Co do zrobienia:**
- ⏳ Supabase: baza danych
- ⏳ Supabase: Edge Functions (płatności, InPost, faktury)
- ⏳ Panel admina
- ⏳ Warianty produktów
- ⏳ Kompatybilność z pojazdami
- ⏳ Faktury PDF
- ⏳ Maile transakcyjne

**Kluczowe decyzje podjęte:**
1. Backend = Supabase (nie osobny serwer Node)
2. Kompatybilność = wersja "light" (pole tekstowe + full-text search, bez bazy pojazdów)
3. Checkout jako gość (bez rejestracji w MVP)
4. Warianty produktów TAK (oleje: lepkość × pojemność)
5. Autocomplete przy tagach → przesunięte do H2

---

## 🗄️ SCHEMAT BAZY DANYCH (DO UTWORZENIA)

```sql
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
  shipping_method TEXT NOT NULL,  -- 'inpost_locker', 'inpost_courier'
  shipping_address JSONB,         -- {locker_id, street, city, postal_code...}
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

-- Indeks full-text dla wyszukiwania
CREATE INDEX idx_products_search ON products 
USING GIN (to_tsvector('simple', name || ' ' || COALESCE(compatibility_tags, '')));
```

---

## 🔧 CO TRZEBA ZROBIĆ NAJPIERW

### Tydzień 1-2: Baza + Panel admina

1. **Założyć projekt Supabase**
   - Utworzyć tabele według schematu powyżej
   - Ustawić RLS (Row Level Security)
   - Utworzyć bucket na zdjęcia

2. **Panel admina (osobna ścieżka /admin)**
   - Auth: logowanie przez Supabase Auth
   - CRUD kategorii
   - CRUD produktów z wariantami
   - Upload zdjęć do Supabase Storage

3. **Podłączyć frontend do bazy**
   - Produkty z Supabase zamiast hardcoded
   - Kategorie z Supabase

### Dane wejściowe potrzebne od Cezarego:
- Dostęp do konta Supabase (lub utworzyć nowy projekt)
- Decyzja: panel admina w tym samym repo czy osobne?
- Przykładowe produkty z wariantami do testów

---

## 🛠️ STACK TECHNOLOGICZNY

| Warstwa | Technologia | Status |
|---------|-------------|--------|
| Frontend | React + Vite | ✅ Gotowe |
| Styling | Tailwind CSS | ✅ Gotowe |
| Backend | Supabase | ⏳ Do zrobienia |
| Baza danych | PostgreSQL (Supabase) | ⏳ Do zrobienia |
| Storage | Supabase Storage | ⏳ Do zrobienia |
| Auth (admin) | Supabase Auth | ⏳ Do zrobienia |
| Płatności | Przelewy24 API | ⏳ Edge Function |
| Dostawa | InPost ShipX API | ⏳ Edge Function |
| Faktury | PDF (react-pdf lub własne) | ⏳ Do zrobienia |
| Maile | Resend | ⏳ Do zrobienia |
| Hosting frontend | Vercel | ✅ Gotowe |

---

## 📁 STRUKTURA PROJEKTU (SUGEROWANA)

```
AntyShoper/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Category.jsx
│   │   ├── Product.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   └── admin/           # Panel admina
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Categories.jsx
│   │       ├── Products.jsx
│   │       ├── ProductForm.jsx
│   │       └── Orders.jsx
│   ├── lib/
│   │   └── supabase.js      # Klient Supabase
│   ├── hooks/
│   └── utils/
├── supabase/
│   └── functions/           # Edge Functions
│       ├── create-payment/
│       ├── payment-webhook/
│       ├── create-shipment/
│       └── generate-invoice/
├── docs/
│   ├── START.md
│   ├── PLAN.md
│   ├── DECYZJE.md
│   ├── BRIEFING.md
│   └── WIZJA.md
└── ...
```

---

## ⚠️ WAŻNE KONTEKSTY

1. **Frontend już istnieje** — nie zaczynamy od zera. Sprawdź strukturę w repo przed zmianami.

2. **Warianty są kluczowe** — produkty typu olej mają warianty (lepkość × pojemność). Każdy wariant ma swoją cenę i stan magazynowy.

3. **Kompatybilność "light"** — jedno pole tekstowe, nie baza pojazdów. Format: "Audi A4 B8 2008-2015, BMW 3 E90 2005-2012". Wyszukiwanie full-text.

4. **Klucze API muszą być w Edge Functions** — nigdy w kodzie frontu. Dotyczy: Przelewy24, InPost, Resend.

5. **Ten projekt ma być szablonem** — kod powinien być na tyle generyczny, żeby można go użyć dla innych sklepów w przyszłości.

---

## 🚀 JAK ZACZĄĆ SESJĘ

Powiedz Claude Code:

> "Przeczytaj BRIEFING.md — to kontekst projektu. Sprawdź też obecną strukturę w src/. Potem powiedz mi co rozumiesz i od czego zaczynamy."

---

**Gotowe do pracy w VS Code!**
