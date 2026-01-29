# PLAN PROJEKTU - AntyShoper

**Data utworzenia:** 2025-01-29
**Owner:** Cezary Ziarkowski

---

## 🎯 CEL GŁÓWNY

Działający sklep internetowy z częściami samochodowymi dla Auto-Parts Direct.

**Sukces wygląda tak:**
- Klient może przeglądać katalog, filtrować po pojeździe, dodać do koszyka
- Klient może zapłacić przez Przelewy24 i wybrać dostawę InPost
- Klient dostaje fakturę i potwierdzenie mailem
- Właściciel może zarządzać produktami, kategoriami i zamówieniami w panelu

---

## 🗺️ KAMIENIE MILOWE

### Milestone 1: Baza danych + Panel produktów
**Deadline:** Tydzień 2 (ok. 12 lutego)
**Status:** [ ] TODO

**Co zostanie dostarczone:**
- [ ] Schemat bazy Supabase (produkty, warianty, kategorie, zamówienia)
- [ ] Panel admina: logowanie
- [ ] Panel admina: CRUD kategorii
- [ ] Panel admina: CRUD produktów z wariantami
- [ ] Panel admina: upload zdjęć (Supabase Storage)
- [ ] Frontend podłączony do bazy (produkty z Supabase)

---

### Milestone 2: Kompatybilność + Wyszukiwarka
**Deadline:** Tydzień 3 (ok. 19 lutego)
**Status:** [ ] TODO

**Co zostanie dostarczone:**
- [ ] Pole "kompatybilność" przy produktach (tekstowe)
- [ ] Wyszukiwarka full-text (po nazwie + kompatybilności)
- [ ] Strona produktu z listą kompatybilnych pojazdów
- [ ] Filtrowanie katalogu po wpisanym pojeździe

---

### Milestone 3: Checkout + Integracje
**Deadline:** Tydzień 4-5 (ok. 5 marca)
**Status:** [ ] TODO

**Co zostanie dostarczone:**
- [ ] Checkout flow z danymi klienta + NIP opcjonalnie
- [ ] Supabase Edge Function: integracja Przelewy24 (server-side)
- [ ] Supabase Edge Function: integracja InPost ShipX (etykiety)
- [ ] Zapis zamówienia do bazy
- [ ] Strona potwierdzenia zamówienia

---

### Milestone 4: Faktury + Maile + Panel zamówień
**Deadline:** Tydzień 6 (ok. 12 marca)
**Status:** [ ] TODO

**Co zostanie dostarczone:**
- [ ] Generowanie faktur PDF
- [ ] Maile transakcyjne (Resend): potwierdzenie, zmiana statusu
- [ ] Panel admina: lista zamówień
- [ ] Panel admina: zmiana statusu zamówienia
- [ ] Panel admina: podgląd szczegółów + faktura

---

### Milestone 5: Testy + Deploy produkcyjny
**Deadline:** Tydzień 7 (ok. 19 marca) — bufor
**Status:** [ ] TODO

**Co zostanie dostarczone:**
- [ ] Testy end-to-end (zamówienie testowe)
- [ ] Przelewy24 produkcyjne (nie sandbox)
- [ ] Domena produkcyjna
- [ ] Dokumentacja dla klienta

---

## ✅ ZADANIA (BACKLOG)

### 🔴 WYSOKI PRIORYTET (Tydzień 1-2)

- [ ] Założyć projekt Supabase
- [ ] Zaprojektować schemat bazy (tabele, relacje)
- [ ] Utworzyć tabele w Supabase
- [ ] Skeleton panelu admina (routing, layout)
- [ ] Auth w panelu (Supabase Auth)
- [ ] CRUD kategorii
- [ ] CRUD produktów
- [ ] CRUD wariantów
- [ ] Upload zdjęć do Storage
- [ ] Podłączyć frontend do Supabase

### 🟡 ŚREDNI PRIORYTET (Tydzień 3-4)

- [ ] Pole kompatybilności w produkcie
- [ ] Indeks full-text w Supabase
- [ ] Komponent wyszukiwarki
- [ ] Strona produktu — sekcja "Pasuje do"
- [ ] Formularz checkout
- [ ] Edge Function: Przelewy24
- [ ] Edge Function: InPost ShipX
- [ ] Model zamówienia w bazie

### 🟢 NISKI PRIORYTET (Tydzień 5-6)

- [ ] Generowanie PDF faktury
- [ ] Integracja Resend (maile)
- [ ] Szablony maili (potwierdzenie, wysyłka)
- [ ] Panel zamówień
- [ ] Statusy zamówień
- [ ] Testy E2E
- [ ] Dokumentacja

---

## 📅 HARMONOGRAM

### Tydzień 1 (29 sty - 4 lut)
- [ ] Supabase: projekt + schemat bazy
- [ ] Panel admina: skeleton + auth
- [ ] CRUD kategorii

### Tydzień 2 (5 - 11 lut)
- [ ] CRUD produktów z wariantami
- [ ] Upload zdjęć
- [ ] Frontend → Supabase (produkty z bazy)

### Tydzień 3 (12 - 18 lut)
- [ ] Kompatybilność (pole + wyszukiwarka)
- [ ] Strona produktu z "Pasuje do"

### Tydzień 4 (19 - 25 lut)
- [ ] Checkout flow
- [ ] Edge Function: Przelewy24

### Tydzień 5 (26 lut - 4 mar)
- [ ] Edge Function: InPost
- [ ] Zapis zamówień
- [ ] Faktury PDF

### Tydzień 6 (5 - 11 mar)
- [ ] Maile transakcyjne
- [ ] Panel zamówień
- [ ] Testy

### Tydzień 7 (12 - 19 mar) — BUFOR
- [ ] Poprawki
- [ ] Deploy produkcyjny
- [ ] Dokumentacja

---

## 📊 METRYKI SUKCESU

| Metryka | Target | Aktualnie | Status |
|---------|--------|-----------|--------|
| Zamówienie testowe E2E | Działa | - | ⏳ |
| Czas ładowania katalogu | < 2s | - | ⏳ |
| Panel admina | Wszystkie CRUD | - | ⏳ |
| Płatność Przelewy24 | Działa produkcyjnie | - | ⏳ |
| Dostawa InPost | Etykieta generuje się | - | ⏳ |

---

## 🚧 RYZYKA

| Problem | Impact | Plan mitygacji | Status |
|---------|--------|----------------|--------|
| Przelewy24 API — dokumentacja | ŚREDNI | Mam doświadczenie z poprzednich projektów | ⏳ |
| InPost ShipX — autoryzacja | ŚREDNI | Konto sandbox do testów | ⏳ |
| Czas Cezarego | WYSOKI | Realistyczny harmonogram 6-7 tyg | ⏳ |

---

## 💡 NOTATKI

- Frontend już istnieje (React + Vite) — nie zaczynamy od zera
- Kompatybilność w wersji "light" (pole tekstowe, nie baza pojazdów)
- Ten projekt ma być szablonem dla przyszłych klientów e-commerce
- Warianty produktów kluczowe (oleje w różnych pojemnościach/lepkościach)

---

**Ostatnia aktualizacja:** 2025-01-29
