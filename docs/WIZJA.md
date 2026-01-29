# WIZJA PROJEKTU - AntyShoper

**Data utworzenia:** 2025-01-29
**Owner:** Cezary Ziarkowski
**Status:** Dokument koncepcyjny — "big picture"

---

## 🎯 PROBLEM, KTÓRY ROZWIĄZUJEMY

**Dla kogo:** Auto-Parts Direct (sklep z częściami samochodowymi) + przyszli klienci e-commerce Cezarego

**Problem:** Gotowe platformy e-commerce (Shoper, WooCommerce) są:
- Drogie w utrzymaniu (abonamenty, prowizje)
- Ograniczone w customizacji
- Brzydkie lub przestarzałe wizualnie
- Wolne (zwłaszcza Shoper)

**Rozwiązanie:** Własny sklep internetowy na nowoczesnym stacku (React + Supabase), który:
- Jest szybki (SPA, edge hosting)
- Wygląda profesjonalnie
- Nie ma prowizji od transakcji
- Można replikować dla innych klientów

---

## 👥 UŻYTKOWNICY

| Rola | Potrzeby | Horyzont |
|------|----------|----------|
| **Klient sklepu** | Znaleźć część do swojego auta, kupić, zapłacić, dostać | MVP |
| **Właściciel sklepu** | Zarządzać produktami, realizować zamówienia, wystawiać faktury | MVP |
| **Warsztat (B2B)** | Kupować hurtowo, faktury VAT, może odroczone płatności | H2 |
| **Cezary** | Szablon do replikacji dla innych klientów e-commerce | H2 |

---

## 🧩 MODUŁY — PEŁNA WIZJA

### MVP (Horyzont 1) — 6-7 tygodni

#### 1. Katalog produktów
- Kategorie (drzewo)
- Produkty z wariantami (cena, stan, atrybuty)
- Zdjęcia (Supabase Storage)
- Kompatybilność z pojazdami (wersja light — pole tekstowe)
- Wyszukiwarka full-text

#### 2. Koszyk i Checkout
- Dodawanie/usuwanie produktów
- Wybór wariantu
- Checkout jako gość (bez rejestracji)
- Dane do wysyłki + opcjonalnie NIP

#### 3. Płatności
- Przelewy24 (BLIK, karty, przelewy)
- Webhook potwierdzający płatność

#### 4. Dostawa
- InPost Paczkomaty (Geowidget + ShipX)
- InPost Kurier
- Generowanie etykiet

#### 5. Faktury
- Automatyczne generowanie PDF
- Dane z NIP (jeśli podany)

#### 6. Maile transakcyjne
- Potwierdzenie zamówienia
- Zmiana statusu (wysłane, dostarczone)

#### 7. Panel admina
- Auth (Supabase)
- CRUD kategorii
- CRUD produktów z wariantami
- Lista zamówień + statusy
- Podgląd faktury

---

### Horyzont 2 (po walidacji MVP) — Q2 2025

#### 8. Konta klientów
- Rejestracja / logowanie
- Historia zamówień
- Zapisane adresy
- Ulubione produkty

#### 9. Zaawansowana kompatybilność
- Autocomplete przy wpisywaniu tagów
- Może: prosta baza marek/modeli z dropdownami

#### 10. Import/Export
- Import produktów z CSV/Excel
- Export zamówień

#### 11. Rozszerzone płatności
- PayPo (raty)
- Płatność przy odbiorze

#### 12. Marketing
- Kody rabatowe
- Darmowa dostawa od X zł

#### 13. Raporty
- Sprzedaż dzienna/miesięczna
- Bestsellery
- Stany magazynowe (alerty)

---

### Horyzont 3 (wizja długoterminowa) — 2026+

#### 14. Multi-tenant (SaaS)
- Jeden codebase, wiele sklepów
- Każdy klient ma swój subdomain
- Wspólny panel zarządzania

#### 15. Pełna baza pojazdów
- Integracja TecDoc lub własna baza
- "Znajdź części do mojego auta" — VIN lookup

#### 16. B2B
- Konta firmowe
- Ceny hurtowe
- Odroczone płatności
- Limity kredytowe

#### 17. Integracje
- Baselinker
- Allegro
- Hurtownie (automatyczne stany)

#### 18. Mobile app
- React Native
- Push notifications

---

## 🏗️ ARCHITEKTURA — WIZJA

```
                    ┌─────────────────────────────────────────┐
                    │              VERCEL                     │
                    │  ┌─────────────────────────────────┐   │
                    │  │     React + Vite (Frontend)     │   │
                    │  │   - Katalog, Koszyk, Checkout   │   │
                    │  │   - Panel Admina (/admin)       │   │
                    │  └─────────────────────────────────┘   │
                    └──────────────────┬──────────────────────┘
                                       │
                                       ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE                                     │
│                                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  PostgreSQL  │  │   Storage    │  │     Auth     │  │    Edge      │ │
│  │              │  │              │  │              │  │  Functions   │ │
│  │ - products   │  │ - zdjęcia    │  │ - admin      │  │              │ │
│  │ - variants   │  │   produktów  │  │   login      │  │ - płatności  │ │
│  │ - orders     │  │              │  │              │  │ - InPost     │ │
│  │ - categories │  │              │  │              │  │ - faktury    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘  │ - maile      │ │
│                                                         └──────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             ┌──────────┐       ┌──────────┐       ┌──────────┐
             │Przelewy24│       │  InPost  │       │  Resend  │
             │  (API)   │       │ (ShipX)  │       │ (maile)  │
             └──────────┘       └──────────┘       └──────────┘
```

---

## 📊 PRIORYTETYZACJA

```
                    WYSOKI IMPACT
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    │ ⭐ Warianty       │   TecDoc           │
    │ ⭐ Płatności      │   Multi-tenant     │
    │ ⭐ Dostawa        │   B2B              │
    │ ⭐ Kompatybilność │                    │
    │    (light)        │                    │
NISKI ───────────────────┼──────────────────── WYSOKI
EFFORT                   │                    EFFORT
    │                    │                    │
    │   Kody rabatowe    │   Mobile app       │
    │   Autocomplete     │   Baselinker       │
    │                    │                    │
    └────────────────────┼────────────────────┘
                         │
                    NISKI IMPACT

⭐ = MVP
```

---

## 🎯 STRATEGIA

### Model biznesowy (dla Cezarego)
- **MVP:** Projekt dla konkretnego klienta (Auto-Parts Direct)
- **H2:** Szablon do replikacji — kolejni klienci e-commerce płacą za wdrożenie + utrzymanie
- **H3:** Może SaaS (multi-tenant) — miesięczny abonament

### Przewaga konkurencyjna
- Szybkość (nowoczesny stack vs Shoper)
- Brak prowizji od transakcji
- Pełna kontrola nad kodem
- Cezary rozumie biznes klienta (30 lat doświadczenia)

### Kanały dotarcia
- Istniejąca sieć kontaktów Cezarego
- Case study Auto-Parts Direct
- Content marketing (LinkedIn)

---

## ❓ PYTANIA OTWARTE

| Pytanie | Dlaczego ważne | Kiedy rozwiązać |
|---------|----------------|-----------------|
| Własny PDF vs iFirma API dla faktur? | Wpływa na implementację | Tydzień 4 |
| Czy klient chce odbiór osobisty? | Dodatkowa opcja dostawy | Tydzień 3 |
| Jak długo przechowywać zamówienia? | RODO, archiwizacja | H2 |
| Czy integracja z Baselinker w przyszłości? | Może być wymaganie klienta | H3 |

---

## 💡 PARKING LOT (pomysły na później)

- Newsletter / marketing automation
- Program lojalnościowy (punkty)
- Opinie produktów
- Chat na stronie (Tidio?)
- Porównywarka produktów
- Lista życzeń
- "Klienci kupili też..."
- Integracja z Google Merchant Center

---

## 📈 WIZJA SUKCESU

### Za 3 miesiące (kwiecień 2025):
- Sklep Auto-Parts Direct działa produkcyjnie
- Pierwsze prawdziwe zamówienia
- Klient jest zadowolony

### Za 6 miesięcy (lipiec 2025):
- 2-3 kolejnych klientów na tym szablonie
- Ugruntowany workflow wdrożeniowy
- Może: rozpoczęcie prac nad multi-tenant

### Za rok (styczeń 2026):
- Stabilny przychód z utrzymania sklepów
- Rozpoznawalność jako "ten od sklepów internetowych"
- Może: wersja SaaS w beta

---

## 🔗 POWIĄZANIA Z INNYMI PROJEKTAMI

| Projekt | Synergia |
|---------|----------|
| mojastronaonline.pl | Klienci stron mogą chcieć sklep — upsell |
| AI First Consulting | E-commerce jako case study kompetencji |

---

**Ten dokument to "północna gwiazda" projektu — pokazuje gdzie zmierzamy, nawet jeśli MVP jest skromniejsze.**

---

**Ostatnia aktualizacja:** 2025-01-29
