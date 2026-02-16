# AUDYT PROJEKTU: AntyShoper (AutoPartsDirect)

**Data audytu:** 2026-02-15
**Ostatnia aktualizacja:** 2026-02-16 (płatności Stripe)
**Produkcja:** https://anty-shoper.vercel.app/
**Admin panel:** https://anty-shoper.vercel.app/admin/login

---

## 1. STRUKTURA I ARCHITEKTURA

### Stack technologiczny

| Warstwa | Technologia | Wersja |
|---------|------------|--------|
| Frontend | React (SPA) | 19.2.0 |
| Build tool | Vite | 7.2.4 |
| Routing | react-router-dom | 7.13.0 |
| Backend/DB | Supabase (PostgreSQL) | 2.93.3 |
| SEO | react-helmet-async | 2.0.5 |
| Płatności | Stripe Checkout (P24/BLIK/karty) | 14 |
| Edge Functions | Supabase Edge Functions (Deno) | - |
| Notyfikacje | react-hot-toast | 2.6.0 |
| Styling | CSS (custom properties) | - |
| Hosting | Vercel (SPA rewrite) | - |

**UWAGA:** Projekt NIE używa Next.js. Jest to klasyczne SPA (Single Page Application) na React + Vite, z client-side routingiem. Vercel serwuje `index.html` dla wszystkich ścieżek (konfiguracja w `vercel.json`). Plik `.npmrc` z `legacy-peer-deps=true` rozwiązuje konflikt peer dependencies react-helmet-async z React 19.

### Struktura plików

```
src/
├── App.jsx                    # Router + stan koszyka (localStorage)
├── main.jsx                   # Entry point + ErrorBoundary + HelmetProvider
├── index.css                  # Globalne style + CSS variables
├── App.css                    # NIEUŻYWANY (resztki szablonu Vite)
│
├── assets/images/             # 12 obrazków (logo, hero, 8x kategorie, banner, produkt)
│
├── components/
│   ├── Header.jsx/.css        # Nawigacja dynamiczna, wyszukiwarka z dropdown, koszyk
│   ├── Footer.jsx/.css        # Stopka z linkami do stron informacyjnych
│   ├── HeroSection.jsx/.css   # Baner główny
│   ├── FeaturesBar.jsx/.css   # Pasek USP (zwroty, wysyłka, jakość)
│   ├── BrandSelector.jsx/.css # Selektor marek aut (dekoracyjny)
│   ├── CategoryGrid.jsx/.css  # Siatka kategorii -- dynamiczna z API
│   ├── ProductCard.jsx/.css   # Karta produktu
│   ├── ProductShowcase.jsx/.css # Promocje + produkty wyróżnione
│   ├── ImageUpload.jsx/.css   # Upload obrazków do Supabase Storage (drag & drop)
│   └── ErrorBoundary.jsx      # Przechwytywanie błędów React
│
├── contexts/
│   └── AuthContext.jsx        # Autentykacja admin (Supabase Auth)
│
├── hooks/
│   └── useProducts.js         # 5 hooków: useProducts, useProduct, useProductsByCategory,
│                              #   useFeaturedProducts, useProductSearch (z debounce 300ms)
│
├── lib/
│   ├── supabase.js            # Inicjalizacja klienta Supabase
│   └── api.js                 # Funkcje API: CRUD kategorii, produktów, zamówień,
│                              #   uploadImage, deleteImage
│
supabase/
├── config.toml                # Konfiguracja Supabase CLI
├── schema.sql                 # Schemat bazy danych
├── seed.sql                   # Dane testowe
├── migrations/                # Migracje SQL
└── functions/
    ├── create-checkout-session/index.ts  # Edge Function: tworzy sesję Stripe Checkout
    └── stripe-webhook/index.ts           # Edge Function: odbiera webhook Stripe → aktualizuje zamówienie
│
├── data/
│   └── products.js            # NIEUŻYWANY mock data (6 produktów)
│
└── pages/
    ├── HomePage.jsx           # Strona główna + SEO Helmet
    ├── CategoryPage.jsx/.css  # Lista produktów w kategorii + SEO
    ├── ProductPage.jsx/.css   # Strona produktu z wariantami + SEO
    ├── CartPage.jsx/.css      # Koszyk + SEO
    ├── CheckoutPage.jsx/.css  # Checkout z InPost GeoWidget + SEO
    ├── SuccessPage.jsx/.css   # Potwierdzenie zamówienia
    ├── AboutPage.jsx          # O nas
    ├── ContactPage.jsx        # Kontakt (formularz frontend-only)
    ├── RegulaminPage.jsx      # Regulamin sklepu
    ├── PrivacyPage.jsx        # Polityka prywatności (RODO)
    ├── InfoPage.css           # Wspólne style stron informacyjnych
    │
    └── admin/
        ├── Admin.css          # Style panelu admin
        ├── AdminLogin.jsx     # Logowanie admin
        ├── AdminLayout.jsx    # Layout z sidebarrem + guard auth
        ├── Dashboard.jsx      # Statystyki
        ├── Categories.jsx     # Lista kategorii
        ├── CategoryForm.jsx   # Formularz kategorii + upload obrazka
        ├── Products.jsx       # Lista produktów
        ├── ProductForm.jsx    # Formularz produktu + warianty + upload obrazków
        └── Orders.jsx         # Lista zamówień + zmiana statusu

public/
├── robots.txt                 # SEO: blokuje /admin/, /checkout, /koszyk
└── sitemap.xml                # SEO: statyczny sitemap (5 głównych stron)
```

### Schemat bazy danych (Supabase)

```
categories           products              product_variants
├── id (UUID PK)     ├── id (UUID PK)      ├── id (UUID PK)
├── name             ├── name              ├── product_id (FK)
├── slug (UNIQUE)    ├── slug (UNIQUE)     ├── sku (UNIQUE)
├── description      ├── description       ├── name
├── image_url        ├── category_id (FK)  ├── price
├── sort_order       ├── compatibility     ├── compare_price
├── parent_id        ├── images[]          ├── stock_quantity
└── timestamps       ├── is_active         ├── attributes (JSONB)
                     └── timestamps        └── is_active

orders                        order_items
├── id (UUID PK)              ├── id (UUID PK)
├── order_number (auto)       ├── order_id (FK)
├── customer_email/phone/name ├── product_id (FK)
├── shipping_method           ├── variant_id (FK)
├── shipping_address (JSONB)  ├── product_name (snapshot)
├── shipping_cost             ├── variant_name (snapshot)
├── payment_method/id/status  ├── quantity
├── subtotal, total           ├── unit_price
├── status                    └── total_price
├── tracking_number
└── timestamps
```

**RLS (Row Level Security):**
- Produkty/Kategorie: publiczny SELECT
- Zamówienia: publiczny INSERT (guest checkout), admin: pełny dostęp
- Triggery: auto `updated_at`, auto generowanie `order_number` (APD-YYYYMMDD-XXXX)
- Indeksy: full-text search na produktach, slug lookups, status zamówień

### Routing aplikacji

| Ścieżka | Komponent | Status |
|----------|-----------|--------|
| `/` | HomePage | ✅ Działa + SEO |
| `/kategoria/:slug` | CategoryPage | ✅ Działa + SEO |
| `/produkt/:slug` | ProductPage | ✅ Działa + SEO |
| `/koszyk` | CartPage | ✅ Działa + SEO |
| `/checkout` | CheckoutPage | ✅ Działa + SEO + Stripe redirect |
| `/sukces` | SuccessPage | ✅ Działa + obsługa powrotu ze Stripe |
| `/o-nas` | AboutPage | ✅ Działa |
| `/kontakt` | ContactPage | ✅ Działa (formularz frontend-only) |
| `/regulamin` | RegulaminPage | ✅ Działa |
| `/polityka-prywatnosci` | PrivacyPage | ✅ Działa |
| `/admin/login` | AdminLogin | ✅ Działa |
| `/admin` | Dashboard | ✅ Działa (chronione) |
| `/admin/kategorie` | Categories | ✅ Działa (CRUD) |
| `/admin/produkty` | Products | ✅ Działa (CRUD + upload) |
| `/admin/zamowienia` | Orders | ✅ Działa |
| `/login` | - | **BRAK** (link w Header) |
| `/wishlist` | - | **BRAK** (link w Header) |
| `/account` | - | **BRAK** (link w Header) |

---

## 2. CO JEST GOTOWE I DZIAŁA

### W pełni ukończone

- **Panel administracyjny** -- kompletny z autentykacją Supabase Auth
  - Dashboard z live statystykami (produkty, kategorie, zamówienia, oczekujące)
  - CRUD kategorii z hierarchią (parent/child) + upload obrazka
  - CRUD produktów z wieloma wariantami (cena, SKU, stan magazynowy, atrybuty JSONB) + upload wielu obrazków
  - Lista zamówień z filtrowaniem po statusie i zmianą statusu
  - Auto-generowanie slugów z polskimi znakami
  - Toggle aktywności produktów
  - Komponent ImageUpload z drag & drop, resize do 1024px, walidacja 10MB

- **Strona produktu** (`ProductPage.jsx`) -- kompletna
  - Selektor wariantów z dynamiczną ceną i SKU
  - Informacja o stanie magazynowym per wariant
  - Breadcrumb nawigacja
  - Informacje o kompatybilności (pasuje do jakich aut)
  - Ilość + dodaj do koszyka z walidacją stocku
  - SEO meta tagi (dynamiczny title, description, og:image)

- **Koszyk** (`CartPage.jsx`) -- kompletny
  - Dodawanie produktów z wariantami (unikalne ID: `productId-variantId`)
  - Zmiana ilości z walidacją stanu magazynowego, toast z limitem
  - Usuwanie pozycji
  - Persystencja w localStorage (klucz: `antyshoper-cart`)
  - Koszt dostawy: "obliczany przy kasie"
  - Podsumowanie cenowe

- **Checkout + Płatności** (`CheckoutPage.jsx`) -- kompletny z bramką płatności
  - Formularz danych klienta
  - Wybór metody dostawy: Kurier DPD (14,99 zł) lub Paczkomat InPost (9,99 zł)
  - Integracja InPost EasyPack GeoWidget (mapa do wyboru paczkomatu)
  - Tworzenie zamówienia w Supabase (status: pending)
  - Redirect na Stripe Checkout z metodami: Przelewy24, BLIK, karty
  - Obsługa błędów (toast notification)

- **Stripe Checkout** -- kompletna integracja płatności
  - Supabase Edge Function `create-checkout-session`: tworzy sesję Stripe z line_items (produkty + dostawa), P24/BLIK/karty, locale PL, waluta PLN
  - Supabase Edge Function `stripe-webhook`: odbiera eventy `checkout.session.completed` / `expired`, aktualizuje `payment_status` i `payment_id` w Supabase (service_role bypass RLS)
  - SuccessPage: parsuje `session_id` z URL, pobiera `order_number` z DB, czyści koszyk
  - CORS dla produkcji (`anty-shoper.vercel.app`) i localhost
  - Kwoty w groszach (PLN × 100), dostawa jako osobna pozycja

- **Wyszukiwarka** -- działająca w Header
  - Hook `useProductSearch` z debounce 300ms
  - Dropdown z wynikami (max 6)
  - Wyszukiwanie po nazwie, opisie i tagach kompatybilności

- **Dynamiczne kategorie**
  - Header: nawigacja zaciągana z API
  - CategoryGrid: kategorie z API z fallback na lokalne obrazki
  - Breadcrumb z prawdziwą nazwą kategorii z DB

- **Strony informacyjne** -- kompletne
  - O nas (`/o-nas`) -- sekcje: firma, eksperci, misja, wartości
  - Kontakt (`/kontakt`) -- formularz + dane kontaktowe (formularz frontend-only)
  - Regulamin (`/regulamin`) -- pełne warunki sprzedaży
  - Polityka prywatności (`/polityka-prywatnosci`) -- zgodna z RODO

- **SEO**
  - react-helmet-async na wszystkich stronach sklepowych
  - Dynamiczne title, meta description, Open Graph per strona
  - robots.txt (blokuje admin, checkout, koszyk)
  - sitemap.xml (statyczny -- 5 głównych stron)

- **API layer** (`lib/api.js`) -- kompletny
  - CRUD kategorii i produktów
  - Wyszukiwanie pełnotekstowe (ilike)
  - Tworzenie zamówień z pozycjami
  - Upload/delete obrazków (Supabase Storage)
  - Mapowanie danych Supabase → frontend

- **Custom hooks** (`hooks/useProducts.js`) -- 5 hooków z loading/error states i debounce

- **Baza danych** -- pełny schemat z RLS, triggerami, indeksami, seed data

- **Deploy** -- Vercel z poprawną konfiguracją SPA + .npmrc dla React 19

### Komponenty UI -- gotowe

- Header z logo, dynamiczną nawigacją, wyszukiwarką i badge'em koszyka
- Footer z linkami do stron informacyjnych
- HeroSection z banerem i gradientem
- FeaturesBar (USP: zwroty, wysyłka, jakość)
- CategoryGrid z 8 dedykowanymi obrazkami kategorii
- ProductCard z ceną, starą ceną, wariantem
- ImageUpload z drag & drop i podglądem
- ErrorBoundary (przechwytywanie błędów React)
- Toast notifications (react-hot-toast)

---

## 3. CO JEST ZACZĘTE ALE NIEDOKOŃCZONE

### Średni priorytet

| Element | Plik | Problem |
|---------|------|---------|
| **Filtry kategorii** | `CategoryPage.jsx` | Sidebar z filtrami (cena, marka) -- czysty HTML bez logiki. Checkboxy i input'y nie robią nic. Przycisk "Filtruj" bez onClick |
| **Selektor marek** | `BrandSelector.jsx` | 11 hardcoded marek z placeholder logo (pierwsza litera). Kliknięcie nie filtruje produktów |
| **Carousel** | `ProductShowcase.jsx:27-28` | Przyciski `<` i `>` bez logiki -- statyczna siatka 3 produktów |
| **Formularz kontaktowy** | `ContactPage.jsx` | Frontend-only -- pokazuje alert po wysłaniu, brak integracji z emailem |
| **Sitemap** | `public/sitemap.xml` | Statyczny -- nie zawiera dynamicznych URL kategorii i produktów |

### Niski priorytet

| Element | Plik | Problem |
|---------|------|---------|
| **Header linki** | `Header.jsx` | Linki do `/login`, `/wishlist`, `/account` -- trasy nie istnieją |
| **Footer -- sekcja konto** | `Footer.jsx` | Logowanie, Rejestracja, Historia zamówień -- `href="#"` (brak stron klienta) |
| **Nieużywany plik** | `src/data/products.js` | Legacy mock data (6 produktów), nie jest importowany nigdzie |
| **Nieużywany plik** | `src/App.css` | Resztki szablonu Vite (animacja logo), nie jest używany |

---

## 4. CZEGO BRAKUJE DO DZIAŁAJĄCEGO SKLEPU

### Krytyczne (MVP -- przyjęcie pierwszego zamówienia)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| ~~1~~ | ~~**Bramka płatności**~~ | ✅ **ZROBIONE** -- Stripe Checkout z P24/BLIK/kartami via Supabase Edge Functions | ~~Duży~~ |

### Ważne (kompletny sklep)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| 2 | **Filtry kategorii** | Implementacja filtrowania po cenie i marce na CategoryPage | Średni |
| 3 | **Potwierdzenie email** | Wysyłka emaila po złożeniu zamówienia (Resend/SendGrid) | Średni |
| 4 | **Backend formularza kontaktowego** | Email z formularza kontaktowego (Edge Function + Resend) | Mały |
| 5 | **Dynamiczny sitemap** | Generowanie sitemap z URL kategorii i produktów | Mały |

### Nice-to-have (profesjonalny sklep)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| 6 | **Konta klientów** | Rejestracja, logowanie, historia zamówień, profil | Duży |
| 7 | **Śledzenie zamówień** | Strona statusu zamówienia dla klienta (po numerze + email) | Średni |
| 8 | **Panel zamówień -- detale** | Podgląd szczegółów zamówienia w adminie (pozycje, adres, locker) | Mały |
| 9 | **InPost ShipX** | Tworzenie przesyłek InPost z panelu admin (Edge Function) | Duży |
| 10 | **Faktury PDF** | Generowanie faktur/paragonów | Średni |
| 11 | **Newsletter** | Zapis na newsletter, kampanie email | Średni |
| 12 | **Opinie produktów** | Recenzje klientów przy produktach | Średni |
| 13 | **Logo marek** | Prawdziwe logo marek zamiast placeholder liter w BrandSelector | Mały |
| 14 | **Carousel produktów** | Działające przewijanie w ProductShowcase | Mały |
| 15 | **Strona 404** | Dedykowana strona dla nieistniejących ścieżek | Mały |

---

## 5. PROBLEMY I BŁĘDY

### Problemy funkcjonalne

| Priorytet | Problem | Lokalizacja | Opis |
|-----------|---------|-------------|------|
| ŚREDNI | Brak walidacji formularza checkout | `CheckoutPage.jsx` | Tylko HTML5 `required` i `type="email"`. Brak walidacji kodu pocztowego, telefonu, min. długości |
| NISKI | Formularz kontaktowy bez backendu | `ContactPage.jsx` | Formularz pokazuje alert, ale nie wysyła emaila |
| NISKI | Statyczny sitemap | `public/sitemap.xml` | Brak dynamicznych URL produktów i kategorii |

### Problemy z nawigacją

| Link | Lokalizacja | Problem |
|------|-------------|---------|
| "Zaloguj się" | Header | Link do `/login` -- trasa nie istnieje |
| Wishlist (serce) | Header | Link do `/wishlist` -- trasa nie istnieje |
| Account (osoba) | Header | Link do `/account` -- trasa nie istnieje |
| Logowanie | Footer | `href="#"` -- brak strony klienta |
| Rejestracja | Footer | `href="#"` -- brak strony klienta |
| Historia zamówień | Footer | `href="#"` -- brak strony klienta |

### Nieużywane pliki (do usunięcia)

| Plik | Powód |
|------|-------|
| `src/data/products.js` | Legacy mock data, nigdzie nie importowany |
| `src/App.css` | Resztki szablonu Vite, nie używany przez App.jsx |
| `public/vite.svg` | Domyślny plik Vite, nie używany |

### Jakość kodu -- pozytywne

- Brak TODO/FIXME/HACK w kodzie
- Brak skomentowanego kodu
- 15+ bloków try/catch z poprawną obsługą błędów
- ErrorBoundary na najwyższym poziomie
- Spójne nazewnictwo (camelCase w kodzie, polski UI)
- Dobre separation of concerns (hooks, components, api, pages)
- `console.error` tylko w catch -- poprawne użycie
- Poprawne formatowanie cen (locale pl-PL)
- SEO Helmet na wszystkich stronach sklepowych

---

## 6. PLAN DZIAŁANIA

### FAZA 1: Quick fixy UX ✅ UKOŃCZONA

```
✅ Persystencja koszyka (localStorage)
✅ Fix placeholder image (inline SVG)
✅ Fix delivery cost w CartPage ("obliczany przy kasie")
✅ Fix walidacja stocku w koszyku (toast z limitem)
✅ Breadcrumb z nazwą kategorii z DB
✅ Dedykowane obrazki dla 8 kategorii (zastąpienie placeholderów)
```

### FAZA 2: Kompletny sklep ✅ UKOŃCZONA

```
✅ Dynamiczne kategorie w nawigacji (Header + CategoryGrid z API)
✅ Wyszukiwarka w Header (dropdown z wynikami, debounce)
✅ Strony informacyjne (O nas, Kontakt, Regulamin, Polityka prywatności)
✅ Podłączenie linków w Footer do nowych stron
✅ Upload obrazków do Supabase Storage (drag & drop, resize, delete)
✅ SEO: react-helmet-async na wszystkich stronach
✅ SEO: robots.txt + sitemap.xml
✅ .npmrc fix dla React 19 kompatybilności
```

### FAZA 3: MVP -- Płatności ✅ UKOŃCZONA

```
✅ Supabase Edge Function: create-checkout-session (Stripe Checkout z P24/BLIK/kartami)
✅ Supabase Edge Function: stripe-webhook (aktualizacja statusu zamówienia po płatności)
✅ CheckoutPage: redirect na Stripe po złożeniu zamówienia
✅ SuccessPage: obsługa powrotu ze Stripe, czyszczenie koszyka, pobranie order_number
✅ CORS, error handling, loading state
✅ Deploy Edge Functions + konfiguracja Stripe webhook
```

### FAZA 4: Profesjonalizacja

#### Zadania RÓWNOLEGŁE (agent teams):

```
AGENT A: Filtry i UX
├─ A. Filtry na CategoryPage (cena, marka)
├─ B. Carousel w ProductShowcase (Swiper/Embla)
├─ C. Logo marek (SVG lub obrazki)
├─ D. Loading skeletons zamiast "Ładowanie..."
├─ E. Strona 404
└─ F. Walidacja formularzy checkout (zod/yup)

AGENT B: Email i powiadomienia
├─ G. Konfiguracja Resend/SendGrid
├─ H. Email potwierdzenia zamówienia
├─ I. Email zmiany statusu zamówienia
├─ J. Backend formularza kontaktowego
└─ K. Edge Function do wysyłki maili

AGENT C: Konta klientów
├─ L. Rejestracja klienta (Supabase Auth)
├─ M. Logowanie klienta
├─ N. Profil klienta (dane, adresy)
├─ O. Historia zamówień klienta
└─ P. RLS policies dla klientów

AGENT D: Rozszerzenia admina
├─ Q. Szczegóły zamówienia (modal/strona)
├─ R. InPost ShipX (Edge Function)
├─ S. Generowanie faktur PDF
├─ T. Śledzenie przesyłki w zamówieniu
└─ U. Dynamiczny sitemap
```

### Priorytetyzacja -- co dalej?

```
PRIORYTET 1: Płatności ✅ ZROBIONE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Bramka płatności Stripe (P24/BLIK/karty)

PRIORYTET 2: Email
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Email potwierdzenia zamówienia            ~1 dzień
🔧 Backend formularza kontaktowego           ~2h

PRIORYTET 3: UX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Filtry kategorii                          ~4h
🔧 Walidacja formularzy checkout             ~2h
🔧 Strona 404                                ~1h

PRIORYTET 4: Profesjonalizacja
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Konta klientów
🔧 InPost ShipX
🔧 Faktury PDF
🔧 Newsletter
```

---

## HISTORIA ZMIAN

| Data | Commit | Opis |
|------|--------|------|
| 2026-02-15 | `0b8a19f` | Faza 1: persystencja koszyka, placeholder SVG, walidacja stocku, breadcrumb, delivery fix |
| 2026-02-15 | `e921705` | 6 dedykowanych obrazków kategorii (cooling, electrical, brakes, filters, exhaust, suspension) |
| 2026-02-15 | `141bdeb` | Faza 2: strony informacyjne, upload obrazków, SEO Helmet, dynamiczne kategorie, wyszukiwarka |
| 2026-02-16 | `2da87e3` | Fix: .npmrc z legacy-peer-deps dla React 19 (Vercel ERESOLVE) |
| 2026-02-16 | `fb3d59a` | Faza 3: Integracja Stripe Checkout z P24, BLIK i kartami (Edge Functions + frontend) |
| 2026-02-16 | `2859a6c` | Fix: constructEventAsync() w webhook (Deno async crypto) |

---

## PODSUMOWANIE

**Stan projektu: MVP GOTOWY (~95%)**

Sklep jest w pełni funkcjonalny — klient może przeglądać produkty, dodać do koszyka, złożyć zamówienie i opłacić je przez Stripe (Przelewy24, BLIK, karty). Zrealizowane Fazy 1-3:
- ✅ Persystencja koszyka + walidacja stocku
- ✅ Wyszukiwarka z dropdown wyników
- ✅ Dynamiczne kategorie z API (Header + siatka)
- ✅ Strony prawne (Regulamin, Polityka prywatności) -- wymagane prawnie w PL
- ✅ Strony informacyjne (O nas, Kontakt)
- ✅ Upload obrazków w panelu admin (drag & drop + Supabase Storage)
- ✅ SEO meta tagi na wszystkich stronach + robots.txt + sitemap.xml
- ✅ 8 dedykowanych obrazków kategorii
- ✅ **Bramka płatności Stripe** -- P24, BLIK, karty via Supabase Edge Functions
- ✅ Webhook aktualizujący status zamówienia po płatności

**Drobne pozostałości (nie blokują MVP):**
- 3 broken linki w Header (/login, /wishlist, /account) -- wymagają kont klientów
- 3 broken linki w Footer (sekcja konto) -- j.w.
- Filtry kategorii to UI bez logiki
- Formularz kontaktowy bez backendu email
- Statyczny sitemap (brak URL produktów/kategorii)
