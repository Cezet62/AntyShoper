# AUDYT PROJEKTU: AntyShoper (AutoPartsDirect)

**Data audytu:** 2026-02-15
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
| Notyfikacje | react-hot-toast | 2.6.0 |
| Styling | CSS (custom properties) | - |
| Hosting | Vercel (SPA rewrite) | - |

**UWAGA:** Projekt NIE używa Next.js. Jest to klasyczne SPA (Single Page Application) na React + Vite, z client-side routingiem. Vercel serwuje `index.html` dla wszystkich ścieżek (konfiguracja w `vercel.json`).

### Struktura plików

```
src/
├── App.jsx                    # Router + stan koszyka
├── main.jsx                   # Entry point + ErrorBoundary
├── index.css                  # Globalne style + CSS variables
├── App.css                    # NIEUŻYWANY (resztki szablonu Vite)
│
├── assets/images/             # 6 obrazków (logo, hero, kategorie, banner, produkt)
│
├── components/                # Komponenty UI
│   ├── Header.jsx/.css        # Nawigacja, search, koszyk
│   ├── Footer.jsx/.css        # Stopka
│   ├── HeroSection.jsx/.css   # Baner główny
│   ├── FeaturesBar.jsx/.css   # Pasek USP (zwroty, wysyłka, jakość)
│   ├── BrandSelector.jsx/.css # Selektor marek aut
│   ├── CategoryGrid.jsx/.css  # Siatka kategorii
│   ├── ProductCard.jsx/.css   # Karta produktu
│   ├── ProductShowcase.jsx/.css # Promocje + produkty wyróżnione
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
│   └── api.js                 # Funkcje API: CRUD kategorii, produktów, zamówień
│
├── data/
│   └── products.js            # NIEUŻYWANY mock data (6 produktów)
│
└── pages/
    ├── HomePage.jsx           # Strona główna (kompozycja komponentów)
    ├── CategoryPage.jsx/.css  # Lista produktów w kategorii + filtry (nieaktywne)
    ├── ProductPage.jsx/.css   # Strona produktu z wariantami
    ├── CartPage.jsx/.css      # Koszyk
    ├── CheckoutPage.jsx/.css  # Checkout z InPost GeoWidget
    ├── SuccessPage.jsx/.css   # Potwierdzenie zamówienia
    │
    └── admin/
        ├── Admin.css          # Style panelu admin
        ├── AdminLogin.jsx     # Logowanie admin
        ├── AdminLayout.jsx    # Layout z sidebarrem + guard auth
        ├── Dashboard.jsx      # Statystyki
        ├── Categories.jsx     # Lista kategorii
        ├── CategoryForm.jsx   # Formularz kategorii (CRUD)
        ├── Products.jsx       # Lista produktów
        ├── ProductForm.jsx    # Formularz produktu + warianty (CRUD)
        └── Orders.jsx         # Lista zamówień + zmiana statusu
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
| `/` | HomePage | Działa |
| `/kategoria/:slug` | CategoryPage | Działa |
| `/produkt/:slug` | ProductPage | Działa |
| `/koszyk` | CartPage | Działa |
| `/checkout` | CheckoutPage | Działa (bez płatności) |
| `/sukces` | SuccessPage | Działa |
| `/admin/login` | AdminLogin | Działa |
| `/admin` | Dashboard | Działa (chronione) |
| `/admin/kategorie` | Categories | Działa (CRUD) |
| `/admin/produkty` | Products | Działa (CRUD) |
| `/admin/zamowienia` | Orders | Działa |
| `/login` | - | **BRAK** (link w Header) |
| `/wishlist` | - | **BRAK** (link w Header) |
| `/account` | - | **BRAK** (link w Header) |

---

## 2. CO JEST GOTOWE I DZIAŁA

### W pełni ukończone

- **Panel administracyjny** -- kompletny z autentykacją Supabase Auth
  - Dashboard z live statystykami (produkty, kategorie, zamówienia, oczekujące)
  - CRUD kategorii z hierarchią (parent/child)
  - CRUD produktów z wieloma wariantami (cena, SKU, stan magazynowy, atrybuty JSONB)
  - Lista zamówień z filtrowaniem po statusie i zmianą statusu
  - Auto-generowanie slugów z polskimi znakami
  - Toggle aktywności produktów

- **Strona produktu** (`ProductPage.jsx`) -- kompletna
  - Selektor wariantów z dynamiczną ceną i SKU
  - Informacja o stanie magazynowym per wariant
  - Breadcrumb nawigacja
  - Informacje o kompatybilności (pasuje do jakich aut)
  - Ilość + dodaj do koszyka

- **Koszyk** (`CartPage.jsx`) -- kompletny
  - Dodawanie produktów z wariantami (unikalne ID: `productId-variantId`)
  - Zmiana ilości, usuwanie pozycji
  - Podsumowanie cenowe

- **Checkout** (`CheckoutPage.jsx`) -- kompletny (flow, bez bramki płatności)
  - Formularz danych klienta
  - Wybór metody dostawy: Kurier DPD (14,99 zł) lub Paczkomat InPost (9,99 zł)
  - Integracja InPost EasyPack GeoWidget (mapa do wyboru paczkomatu)
  - Wybór metody płatności (UI only)
  - Tworzenie zamówienia w Supabase
  - Redirect na stronę sukcesu z numerem zamówienia

- **API layer** (`lib/api.js`) -- kompletny
  - CRUD kategorii i produktów
  - Wyszukiwanie pełnotekstowe (ilike)
  - Tworzenie zamówień z pozycjami
  - Mapowanie danych Supabase → frontend

- **Custom hooks** (`hooks/useProducts.js`) -- 5 hooków z loading/error states i debounce

- **Baza danych** -- pełny schemat z RLS, triggerami, indeksami, seed data

- **Deploy** -- Vercel z poprawną konfiguracją SPA

### Komponenty UI -- gotowe wizualnie

- Header z logo, nawigacją i badge'em koszyka
- Footer z sekcjami (informacje, konto, kontakt)
- HeroSection z banerem i gradientem
- FeaturesBar (USP: zwroty, wysyłka, jakość)
- ProductCard z ceną, starą ceną, wariantem
- ErrorBoundary (przechwytywanie błędów React)
- Toast notifications (react-hot-toast)

---

## 3. CO JEST ZACZĘTE ALE NIEDOKOŃCZONE

### Wysoki priorytet

| Element | Plik | Problem |
|---------|------|---------|
| **Wyszukiwarka** | `Header.jsx:31` | Input bez `onChange`, brak obsługi. Hook `useProductSearch` istnieje i działa, ale nie jest podłączony do UI |
| **Filtry kategorii** | `CategoryPage.jsx:29-43` | Sidebar z filtrami (cena, marka) -- czysty HTML bez logiki. Checkboxy i input'y nie robią nic. Przycisk "Filtruj" bez onClick |
| **Selektor marek** | `BrandSelector.jsx` | 11 hardcoded marek z placeholder logo (pierwsza litera). Kliknięcie nie filtruje produktów |
| **Nawigacja kategorii** | `Header.jsx:63-71` | 7 hardcoded linków nawigacji (CZĘŚCI, OLEJE, OPONY...). Powinny być dynamiczne z API |
| **Siatka kategorii** | `CategoryGrid.jsx:7-16` | 8 kategorii hardcoded. 6 z 8 oznaczonych `// Placeholder` -- używa tylko 2 obrazków dla 8 kategorii |
| **Carousel** | `ProductShowcase.jsx:27-28` | Przyciski `<` i `>` bez logiki -- statyczna siatka 3 produktów |

### Średni priorytet

| Element | Plik | Problem |
|---------|------|---------|
| **Koszyk -- brak persystencji** | `App.jsx:25` | `useState([])` -- koszyk ginie po odświeżeniu strony |
| **Koszyk -- dostawa** | `CartPage.jsx:56` | Hardcoded "0,00 zł" jako koszt dostawy, checkout pokazuje 9.99/14.99 |
| **Koszyk -- brak limitu ilości** | `CartPage.jsx:38` | `quantity + 1` bez sprawdzenia stanu magazynowego |
| **Breadcrumb w kategorii** | `CategoryPage.jsx:25` | Wyświetla slug uppercase (`HAMULCE`) zamiast nazwy kategorii z DB |
| **Fallback image** | `api.js:219` | Odniesienie do `/placeholder.jpg` -- plik nie istnieje w `public/` |

### Niski priorytet

| Element | Plik | Problem |
|---------|------|---------|
| **Footer linki** | `Footer.jsx:17-32` | Wszystkie linki to `href="#"` -- O nas, Kontakt, Regulamin, Polityka prywatności, Logowanie, Rejestracja, Historia zamówień |
| **Header linki** | `Header.jsx:18,36,37` | Linki do `/login`, `/wishlist`, `/account` -- trasy nie istnieją |
| **Nieużywany plik** | `src/data/products.js` | Legacy mock data (6 produktów), nie jest importowany nigdzie |
| **Nieużywany plik** | `src/App.css` | Resztki szablonu Vite (animacja logo), nie jest używany |

---

## 4. CZEGO BRAKUJE DO DZIAŁAJĄCEGO SKLEPU

### Krytyczne (MVP -- przyjęcie pierwszego zamówienia)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| 1 | **Bramka płatności** | Integracja Przelewy24/Stripe/BLIK. Obecnie checkout tworzy zamówienie ze statusem "pending" ale nie pobiera płatności. Potrzebna Supabase Edge Function lub zewnętrzny endpoint | Duży |
| 2 | **Persystencja koszyka** | Zapis koszyka do `localStorage` żeby nie ginął po odświeżeniu | Mały |
| 3 | **Placeholder image** | Dodać plik `/public/placeholder.jpg` lub naprawić fallback w `mapProductToFrontend` | Mały |

### Ważne (kompletny sklep)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| 4 | **Wyszukiwarka w Header** | Podłączyć istniejący hook `useProductSearch` do inputa w Header. Wyświetlić dropdown z wynikami | Średni |
| 5 | **Filtry kategorii** | Implementacja filtrowania po cenie i marce na CategoryPage | Średni |
| 6 | **Strony informacyjne** | Regulamin, Polityka prywatności, O nas, Kontakt (z formularzem) | Średni |
| 7 | **Potwierdzenie email** | Wysyłka emaila po złożeniu zamówienia (Resend/SendGrid) | Średni |
| 8 | **Upload obrazków** | Obecnie admin wpisuje URL -- potrzebny upload do Supabase Storage | Średni |
| 9 | **Kategorie dynamiczne** | Nawigacja w Header i CategoryGrid z API zamiast hardcoded | Mały |
| 10 | **SEO / Meta tagi** | Brak `<title>`, `<meta description>`, Open Graph. SPA potrzebuje pre-renderingu lub SSR dla SEO | Duży |

### Nice-to-have (profesjonalny sklep)

| # | Funkcja | Opis | Wysiłek |
|---|---------|------|---------|
| 11 | **Konta klientów** | Rejestracja, logowanie, historia zamówień, profil | Duży |
| 12 | **Śledzenie zamówień** | Strona statusu zamówienia dla klienta (po numerze + email) | Średni |
| 13 | **Panel zamówień -- detale** | Podgląd szczegółów zamówienia w adminie (pozycje, adres, locker) | Mały |
| 14 | **InPost ShipX** | Tworzenie przesyłek InPost z panelu admin (Edge Function) | Duży |
| 15 | **Faktury PDF** | Generowanie faktur/paragonów | Średni |
| 16 | **Newsletter** | Zapis na newsletter, kampanie email | Średni |
| 17 | **Opinie produktów** | Recenzje klientów przy produktach | Średni |
| 18 | **Porównywarka** | Porównanie specyfikacji produktów | Średni |
| 19 | **Logo marek** | Prawdziwe logo marek zamiast placeholder liter | Mały |
| 20 | **Carousel produktów** | Działające przewijanie w ProductShowcase | Mały |

---

## 5. PROBLEMY I BŁĘDY

### Błędy krytyczne

Brak krytycznych błędów runtime. Kod jest technicznie poprawny i działa.

### Problemy funkcjonalne

| Priorytet | Problem | Lokalizacja | Opis |
|-----------|---------|-------------|------|
| WYSOKI | Koszyk ginie po refresh | `App.jsx:25` | `useState([])` bez persystencji. Klient traci koszyk po odświeżeniu strony |
| WYSOKI | Brak walidacji stocku w koszyku | `CartPage.jsx:38` | Można dodać więcej sztuk niż jest na stanie |
| ŚREDNI | Broken image fallback | `api.js:219` | `/placeholder.jpg` nie istnieje -- produkty bez obrazków pokażą broken image |
| ŚREDNI | Brak walidacji formularza | `CheckoutPage.jsx` | Tylko HTML5 `required` i `type="email"`. Brak walidacji kodu pocztowego, telefonu, min. długości |
| NISKI | Delivery "0,00 zł" w koszyku | `CartPage.jsx:56` | Mylące -- checkout liczy 9.99 lub 14.99 zł |
| NISKI | Kategoria w breadcrumb | `CategoryPage.jsx:25` | Wyświetla slug (`HAMULCE`) zamiast prawdziwej nazwy kategorii |

### Problemy z nawigacją

| Link | Lokalizacja | Problem |
|------|-------------|---------|
| "Zaloguj się" | Header | Link do `/login` -- trasa nie istnieje |
| Wishlist (serce) | Header | Link do `/wishlist` -- trasa nie istnieje |
| Account (osoba) | Header | Link do `/account` -- trasa nie istnieje |
| O nas | Footer | `href="#"` -- nie prowadzi nigdzie |
| Kontakt | Footer | `href="#"` -- nie prowadzi nigdzie |
| Regulamin | Footer | `href="#"` -- nie prowadzi nigdzie |
| Polityka prywatności | Footer | `href="#"` -- nie prowadzi nigdzie |
| Logowanie | Footer | `href="#"` -- nie prowadzi nigdzie |
| Rejestracja | Footer | `href="#"` -- nie prowadzi nigdzie |
| Historia zamówień | Footer | `href="#"` -- nie prowadzi nigdzie |

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
- `console.error` tylko w catch (6 wystąpień) -- poprawne użycie
- Poprawne formatowanie cen (locale pl-PL)

---

## 6. PLAN DZIAŁANIA

### FAZA 1: MVP -- Przyjęcie pierwszego zamówienia

**Cel: Klient może złożyć i opłacić zamówienie.**

#### Zadania SEKWENCYJNE (muszą być po kolei):

```
1. Persystencja koszyka (localStorage)
   └─ Zależy od: nic
   └─ Blokuje: nic, ale kluczowy UX

2. Bramka płatności -- backend
   └─ Supabase Edge Function lub webhook
   └─ Integracja Stripe/Przelewy24
   └─ Endpoint: create-payment-intent, webhook-handler
   └─ Zależy od: nic
   └─ Blokuje: krok 3

3. Bramka płatności -- frontend
   └─ Redirect do płatności po createOrder
   └─ Obsługa callback (success/failure)
   └─ Update statusu zamówienia
   └─ Zależy od: krok 2
```

#### Zadania RÓWNOLEGŁE (niezależne, mogą być robione jednocześnie):

```
A. Placeholder image fix
   └─ Dodać /public/placeholder.jpg LUB zamienić fallback na inline SVG

B. Walidacja stocku w koszyku
   └─ Sprawdzenie max quantity przy dodawaniu i aktualizacji

C. Poprawa kosztu dostawy w CartPage
   └─ Zamiast "0,00 zł" → "obliczany przy kasie" lub dynamiczna kalkulacja
```

### FAZA 2: Kompletny sklep

#### Zadania SEKWENCYJNE:

```
4. Dynamiczne kategorie w nawigacji
   └─ Fetch kategorii z API → Header i CategoryGrid
   └─ Zależy od: nic
   └─ Blokuje: krok 5

5. Wyszukiwarka w Header
   └─ Podłączyć useProductSearch do Header input
   └─ Dropdown z wynikami (max 5-8)
   └─ Zależy od: krok 4 (nawigacja musi być gotowa)

6. Filtry na CategoryPage
   └─ State dla filtrów (cena min/max, marki)
   └─ Filtrowanie client-side lub nowe zapytanie API
   └─ Zależy od: krok 4 (dynamiczne dane)
```

#### Zadania RÓWNOLEGŁE (agent teams):

```
AGENT A: Strony informacyjne
├─ D. Strona "O nas"
├─ E. Strona "Kontakt" (z formularzem)
├─ F. Regulamin sklepu
├─ G. Polityka prywatności (RODO)
└─ H. Podłączenie linków w Footer i Header

AGENT B: Upload i obrazki
├─ I. Konfiguracja Supabase Storage (bucket "products")
├─ J. Komponent upload w ProductForm
├─ K. Upload w CategoryForm
└─ L. Prawdziwe obrazki kategorii (zastąpienie 2 placeholder'ów)

AGENT C: Email i powiadomienia
├─ M. Konfiguracja Resend/SendGrid
├─ N. Email potwierdzenia zamówienia
├─ O. Email zmiany statusu zamówienia
└─ P. Edge Function do wysyłki maili

AGENT D: SEO i meta
├─ Q. react-helmet-async (lub odpowiednik)
├─ R. Dynamiczne <title> i <meta> per strona
├─ S. Open Graph tagi
└─ T. Sitemap i robots.txt
```

### FAZA 3: Profesjonalny sklep

#### Zadania RÓWNOLEGŁE:

```
AGENT E: Konta klientów
├─ U. Rejestracja klienta (Supabase Auth)
├─ V. Logowanie klienta
├─ W. Profil klienta (dane, adresy)
├─ X. Historia zamówień klienta
└─ Y. RLS policies dla klientów

AGENT F: Rozszerzenia admina
├─ Z. Szczegóły zamówienia (modal/strona)
├─ AA. InPost ShipX (Edge Function)
├─ BB. Generowanie faktur PDF
└─ CC. Śledzenie przesyłki w zamówieniu

AGENT G: UX improvements
├─ DD. Carousel w ProductShowcase (Swiper/Embla)
├─ EE. Logo marek (SVG lub obrazki)
├─ FF. Loading skeletons zamiast "Ładowanie..."
├─ GG. Strona 404
└─ HH. Walidacja formularzy (zod/yup)
```

### Priorytetyzacja -- co najpierw?

```
PRIORYTET 1 (dzień 1-2): Minimalny działający sklep
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Persystencja koszyka (localStorage)           ~1h
✅ Fix placeholder image                         ~15min
✅ Fix delivery cost w CartPage                   ~15min
✅ Fix walidacja stocku w koszyku                 ~30min
✅ Breadcrumb z nazwą kategorii z DB              ~15min

PRIORYTET 2 (dzień 3-5): Płatności
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Bramka płatności (Stripe/Przelewy24)          ~2-3 dni

PRIORYTET 3 (dzień 6-8): Użyteczność
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Dynamiczne kategorie (Header + CategoryGrid)  ~2h
🔧 Wyszukiwarka w Header                         ~3h
🔧 Strony: Regulamin, Polityka prywatności        ~4h
🔧 Upload obrazków do Supabase Storage            ~4h

PRIORYTET 4 (tydzień 2+): Profesjonalizacja
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 Email powiadomienia (Resend)
🔧 Konta klientów
🔧 SEO / meta tagi
🔧 Filtry produktów
🔧 InPost ShipX
🔧 Faktury PDF
```

---

## PODSUMOWANIE

**Stan projektu: ~65% gotowości do MVP**

Projekt ma solidne fundamenty:
- Kompletny panel admina z CRUD
- Działający flow zakupowy (przeglądanie → koszyk → checkout → zamówienie)
- Dobrze zaprojektowany schemat bazy danych
- Czysta architektura kodu (hooks, components, api)
- Integracja InPost GeoWidget

Główne braki do uruchomienia sklepu:
1. **Bramka płatności** -- krytyczne, zamówienie jest tworzone ale nie opłacane
2. **Persystencja koszyka** -- klient traci koszyk po odświeżeniu
3. **Strony prawne** -- regulamin i polityka prywatności wymagane prawnie w Polsce
4. **Broken linki** -- 10+ linków w Header/Footer prowadzi donikąd

Projekt jest dobrze napisany i może być szybko doprowadzony do stanu produkcyjnego. Największy wysiłek to integracja płatności -- reszta to stosunkowo proste zadania.
