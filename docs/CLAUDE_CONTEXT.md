# KONTEKST DLA CLAUDE - AntyShoper

**Ostatnia aktualizacja:** 2025-01-29

---

## 🎯 O PROJEKCIE

Sklep internetowy z częściami samochodowymi. Frontend React + Vite, backend Supabase.

- **Live:** https://anty-shoper.vercel.app/
- **Admin:** https://anty-shoper.vercel.app/admin/login
- **Repo:** https://github.com/Cezet62/AntyShoper
- **Supabase:** https://uolutxrdimlopgxvmogv.supabase.co

---

## ✅ CO ZROBIONE

### Infrastruktura
- [x] Frontend React + Vite na Vercel
- [x] Supabase - baza danych PostgreSQL
- [x] Routing SPA (vercel.json)
- [x] Zmienne środowiskowe na Vercel (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### Baza danych (Supabase)
- [x] Tabele: categories, products, product_variants, orders, order_items
- [x] RLS (Row Level Security) skonfigurowane
- [x] Triggery: auto-update timestamps, generowanie numeru zamówienia (APD-YYYYMMDD-XXXX)
- [x] Indeksy full-text search
- [x] Seed data: 5 kategorii, 7 produktów, 12 wariantów

### Sklep (frontend)
- [x] Strona główna z produktami z Supabase
- [x] Strony kategorii (dynamiczne)
- [x] Strona produktu z wariantami (selektor wariantów)
- [x] Koszyk (obsługa wariantów przez cartId)
- [x] Checkout z wyborem dostawy (Kurier/Paczkomat InPost)
- [x] InPost EasyPack SDK (wybór paczkomatu bez tokena)
- [x] Zapisywanie zamówień do bazy
- [x] Strona sukcesu z numerem zamówienia

### Panel Admina (/admin/*)
- [x] Logowanie przez Supabase Auth
- [x] Dashboard ze statystykami
- [x] CRUD kategorii
- [x] CRUD produktów z wariantami
- [x] Lista zamówień z filtrami statusów
- [x] Zmiana statusu zamówienia

---

## ⏳ DO ZROBIENIA

1. **Upload zdjęć** - Supabase Storage (teraz tylko URLe)
2. **Przelewy24** - integracja płatności (Edge Function)
3. **InPost ShipX** - tworzenie przesyłek (Edge Function)
4. **Faktury PDF** - generowanie
5. **Maile transakcyjne** - Resend (potwierdzenie zamówienia)

---

## 🔧 WAŻNE TECHNICZNE

### Struktura plików
```
src/
├── components/       # Header, Footer, ProductCard, ProductShowcase
├── contexts/         # AuthContext (Supabase Auth)
├── hooks/            # useProducts, useProduct, useFeaturedProducts
├── lib/
│   ├── supabase.js   # Klient Supabase
│   └── api.js        # Funkcje API (getProducts, createOrder, etc.)
├── pages/
│   ├── admin/        # Panel admina (AdminLayout, Dashboard, Products, etc.)
│   └── *.jsx         # Strony sklepu
supabase/
├── schema.sql        # Schemat bazy (DO WYKONANIA W SQL EDITOR)
├── seed.sql          # Dane testowe
└── migrations/       # Migracje (001_allow_guest_orders.sql)
```

### Kluczowe hooki
- `useProducts()` - wszystkie produkty
- `useProduct(slug)` - jeden produkt po slug
- `useProductsByCategory(categorySlug)` - produkty w kategorii
- `useFeaturedProducts(limit)` - polecane produkty

### Koszyk - obsługa wariantów
- `cartId` = `${productId}-${variantId}` (unikalne ID w koszyku)
- Produkty z wariantami mają `variantId`, `variantName`

### RLS Policies
- Produkty/kategorie: publiczny odczyt
- Zamówienia: INSERT dla wszystkich (checkout jako gość), SELECT/UPDATE dla authenticated (admin)

---

## 📝 DECYZJE PODJĘTE

1. Panel admina w tym samym repo (nie osobne)
2. Checkout jako gość (bez rejestracji)
3. Kompatybilność "light" - pole tekstowe, nie baza pojazdów
4. InPost EasyPack SDK (nie GeoWidget - nie wymaga tokena)
5. Warianty produktów - każdy ma swoją cenę i stan magazynowy

---

## 🚀 JAK KONTYNUOWAĆ

Powiedz Claude:
> "Przeczytaj docs/CLAUDE_CONTEXT.md i docs/BRIEFING.md - kontynuujemy projekt AntyShoper"

Lub konkretnie:
> "Przeczytaj docs/CLAUDE_CONTEXT.md - chcę dodać [upload zdjęć / płatności / etc.]"
