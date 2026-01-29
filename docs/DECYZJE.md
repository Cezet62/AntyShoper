# LOG DECYZJI - AntyShoper

**Data utworzenia:** 2025-01-29
**Owner:** Cezary Ziarkowski

---

## 📋 ZASADY TEGO PLIKU

**Cel:** Dokumentować kluczowe decyzje, żeby za 3 miesiące pamiętać DLACZEGO coś zostało zrobione.

**Format:** Najnowsze decyzje NA GÓRZE (reverse chronological)

---

## ✅ DECYZJE (REVERSE CHRONOLOGICAL)

### 2025-01-29 - Autocomplete kompatybilności → H2

**Kontekst:** Przy wpisywaniu tagów kompatybilności (np. "Audi A4 B8") można by podpowiadać już użyte tagi, żeby unikać literówek.

**Decyzja:** Autocomplete NIE wchodzi do MVP, przesunięte do H2.

**Uzasadnienie:** Dodaje 2-3 dni roboty. Na 500 produktów można to ogarnąć instrukcją + formatem. Gdy baza urośnie, dodamy.

**Konsekwencje:** Klient musi być uważny przy wpisywaniu. Przygotować instrukcję z przykładami formatu.

**Status:** ✅ ZATWIERDZONE

---

### 2025-01-29 - Kompatybilność z pojazdami — wersja "light"

**Kontekst:** Sklep z częściami samochodowymi wymaga informacji "do jakich aut pasuje ta część". Pełna implementacja (baza pojazdów, dropdown marka→model→silnik) to duży scope.

**Decyzja:** Wersja "light" — jedno pole tekstowe `compatibility_tags` przy produkcie. Klient wpisuje np. "Audi A4 B8 2008-2015, BMW 3 E90 2005-2012". Wyszukiwanie full-text.

**Uzasadnienie:** 
- Pełna baza pojazdów (TecDoc) to overkill na 500 produktów i kosztuje
- Własna baza marek/modeli = dużo roboty na start
- Pole tekstowe + full-text search daje 80% wartości przy 20% wysiłku
- Łatwa migracja w przyszłości (dane już są, można przeparsować)

**Alternatywy rozważane:**
- Opcja A (pełna baza): Za dużo roboty, nieproporcjonalne do skali
- Opcja B (TecDoc API): Kosztowne, zbyt skomplikowane na MVP

**Konsekwencje:**
- Brak dropdownów "wybierz markę → model"
- Wyszukiwarka tekstowa zamiast filtrów
- Ryzyko literówek (mitygacja: instrukcja, później autocomplete)

**Status:** ✅ ZATWIERDZONE

---

### 2025-01-29 - Backend: Supabase (opcja C)

**Kontekst:** Frontend (React + Vite) jest gotowy, ale potrzebny backend do: bazy danych, integracji płatności (tajne klucze), generowania faktur, wysyłki maili.

**Decyzja:** Supabase jako backend — baza danych + Edge Functions + Storage. Bez osobnego serwera Node.js.

**Uzasadnienie:**
- Cezary ma doświadczenie z Supabase z innego projektu
- Mniej rzeczy do zarządzania (2 zamiast 3)
- Edge Functions wystarczą do integracji Przelewy24, InPost, faktur
- Darmowy tier wystarczy na start

**Alternatywy rozważane:**
- Opcja A (Vite + osobny Express): 3 rzeczy do zarządzania, dodatkowa nauka Express
- Opcja B (migracja do Next.js): Duży refactor istniejącego frontu

**Konsekwencje:**
- Zostajemy przy React + Vite (bez migracji)
- Logika server-side w Supabase Edge Functions
- Klucze API bezpieczne (nie w kodzie frontu)

**Status:** ✅ ZATWIERDZONE

---

### 2025-01-29 - Checkout jako gość (bez rejestracji)

**Kontekst:** Czy klient musi zakładać konto żeby kupić?

**Decyzja:** MVP bez rejestracji — checkout jako gość. Konta klientów w H2.

**Uzasadnienie:** 
- Niższy próg wejścia = więcej konwersji
- Szybsza implementacja
- Historia zamówień może być przez email (link do statusu)

**Konsekwencje:** 
- Brak "moje zamówienia" w MVP
- Klient dostaje link do śledzenia w mailu

**Status:** ✅ ZATWIERDZONE

---

### 2025-01-29 - Warianty produktów (lepkość, pojemność)

**Kontekst:** Produkty typu olej silnikowy mają warianty: różne lepkości (5W-30, 5W-40) i pojemności (1L, 4L, 5L).

**Decyzja:** Pełna obsługa wariantów w MVP. Osobna tabela `product_variants` z ceną, stanem magazynowym, atrybutami (JSONB).

**Uzasadnienie:** To kluczowe dla asortymentu — bez tego sklep nie ma sensu dla tego klienta.

**Konsekwencje:**
- Model danych bardziej złożony
- UI wyboru wariantu na stronie produktu
- Panel admina musi obsługiwać warianty

**Status:** ✅ ZATWIERDZONE

---

### 2025-01-29 - Scope MVP: ~500 produktów

**Kontekst:** Ustalenie skali asortymentu na start.

**Decyzja:** MVP projektowane na ~500 produktów. Import CSV nie wchodzi do MVP (ręczne dodawanie).

**Uzasadnienie:** 500 produktów można dodać ręcznie przez panel. Import to optymalizacja na później.

**Konsekwencje:** Panel admina musi być wygodny do ręcznego dodawania.

**Status:** ✅ ZATWIERDZONE

---

## 🤔 DO PRZEMYŚLENIA (OPEN QUESTIONS)

| # | Pytanie | Dlaczego ważne | Deadline |
|---|---------|----------------|----------|
| 1 | Który provider faktur? (własny PDF vs iFirma API) | Wpływa na implementację | Tydzień 4 |
| 2 | Czy odbiór osobisty w MVP? | Klient może chcieć | Tydzień 3 |
| 3 | Powiadomienia SMS o statusie? | Lepsza UX, ale dodatkowy koszt | H2 |

---

## 📝 ZAŁOŻENIA I OGRANICZENIA

**Założenia:**
- Klient (Auto-Parts Direct) dostarczy dane produktów
- Klient ma konto Przelewy24 (lub założy)
- Klient ma konto InPost biznesowe (lub założy)
- ~4-6h dziennie na development

**Ograniczenia:**
- Budżet: czas Cezarego (brak budżetu na zewnętrznych devów)
- Timeline: ~6-7 tygodni do działającego MVP
- Bez TecDoc (zbyt kosztowne/skomplikowane)

---

**Ostatnia aktualizacja:** 2025-01-29
