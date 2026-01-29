# QUICK REFERENCE - AntyShoper (Auto-Parts Direct)

**Data utworzenia:** 2025-01-29
**Status:** W REALIZACJI
**Ostatnia aktualizacja:** 2025-01-29

---

## 🎯 CEL PROJEKTU

Sklep internetowy z częściami samochodowymi dla Auto-Parts Direct. MVP z pełną funkcjonalnością e-commerce: katalog z wariantami produktów, kompatybilność z pojazdami (wersja light), płatności Przelewy24, dostawa InPost, faktury.

**Klient:** Auto-Parts Direct
**Model:** Szablon do replikacji dla przyszłych klientów e-commerce

---

## 📂 KLUCZOWE PLIKI

- `START.md` - ten plik (quick reference)
- `PLAN.md` - kamienie milowe, zadania na 6 tygodni
- `DECYZJE.md` - log decyzji z uzasadnieniami
- `BRIEFING.md` - kontekst dla Claude Code
- `WIZJA.md` - pełna wizja z H2/H3

---

## 📊 STATUS AKTUALNY

**Faza:** DEVELOPMENT (frontend gotowy, backend do zrobienia)

**Progress:** [✓] 25% → [ ] 50% → [ ] 75% → [ ] 100%

**Co już jest:**
- ✅ Frontend React + Vite
- ✅ Kategorie produktów (hardcoded)
- ✅ Przykładowe produkty (hardcoded)
- ✅ Koszyk (działa)
- ✅ InPost Geowidget (wybór paczkomatu)
- ✅ Przelewy24 (flow płatności)
- ✅ Deploy na Vercel

**Co do zrobienia:**
- ⏳ Supabase (baza danych)
- ⏳ Panel admina
- ⏳ Warianty produktów
- ⏳ Kompatybilność z pojazdami (light)
- ⏳ Faktury
- ⏳ Maile transakcyjne

---

## 🔗 LINKI

| Co | Link |
|----|------|
| **Live** | https://anty-shoper.vercel.app/ |
| **GitHub** | https://github.com/Cezet62/AntyShoper |
| **Supabase** | (do utworzenia) |

---

## 🛠️ STACK TECHNOLOGICZNY

| Warstwa | Technologia |
|---------|-------------|
| Frontend | React + Vite + Tailwind |
| Backend | Supabase (baza + Edge Functions + Storage) |
| Płatności | Przelewy24 API |
| Dostawa | InPost Geowidget + ShipX API |
| Faktury | Własne PDF lub iFirma API |
| Maile | Resend |
| Hosting | Vercel (front) + Supabase (backend) |

---

## 👥 ZESPÓŁ

- **Owner:** Cezary Ziarkowski
- **Klient:** Auto-Parts Direct
- **Dev:** Claude Code

---

## ⚡ NASTĘPNE 3 KROKI

1. [ ] Założyć projekt Supabase i utworzyć schemat bazy
2. [ ] Podłączyć frontend do Supabase (produkty z bazy zamiast hardcoded)
3. [ ] Panel admina: CRUD produktów

---

**Ostatnia aktualizacja:** 2025-01-29
