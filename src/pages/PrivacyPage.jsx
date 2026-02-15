import React from 'react';
import './InfoPage.css';

const PrivacyPage = () => {
  return (
    <div className="info-page">
      <h1>Polityka prywatności</h1>

      <div className="info-section">
        <h2>1. Administrator danych</h2>
        <p>
          Administratorem Twoich danych osobowych jest AutoPartsDirect Sp. z o.o. z siedzibą w Polsce. W sprawach związanych z ochroną danych osobowych możesz skontaktować się z nami pod adresem: autoparts.sprzedaz@gmail.com.
        </p>
      </div>

      <div className="info-section">
        <h2>2. Cele przetwarzania danych</h2>
        <p>Twoje dane osobowe przetwarzane są w następujących celach:</p>
        <ul>
          <li>Realizacja zamówień i umów sprzedaży</li>
          <li>Obsługa zapytań i korespondencji</li>
          <li>Prowadzenie księgowości i rozliczeń</li>
          <li>Marketing bezpośredni własnych produktów i usług</li>
          <li>Dochodzenie lub obrona przed roszczeniami</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>3. Podstawy prawne przetwarzania</h2>
        <p>Przetwarzanie danych osobowych odbywa się na podstawie:</p>
        <ul>
          <li>Art. 6 ust. 1 lit. b RODO — wykonanie umowy lub podjęcie działań przed jej zawarciem</li>
          <li>Art. 6 ust. 1 lit. c RODO — wypełnienie obowiązku prawnego (np. przepisy podatkowe)</li>
          <li>Art. 6 ust. 1 lit. f RODO — prawnie uzasadniony interes administratora (marketing, dochodzenie roszczeń)</li>
          <li>Art. 6 ust. 1 lit. a RODO — zgoda (np. newsletter)</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>4. Prawa użytkownika</h2>
        <p>Zgodnie z RODO przysługują Ci następujące prawa:</p>
        <ul>
          <li>Prawo dostępu do swoich danych osobowych</li>
          <li>Prawo do sprostowania (poprawiania) danych</li>
          <li>Prawo do usunięcia danych („prawo do bycia zapomnianym")</li>
          <li>Prawo do ograniczenia przetwarzania</li>
          <li>Prawo do przenoszenia danych</li>
          <li>Prawo do wniesienia sprzeciwu wobec przetwarzania</li>
          <li>Prawo do wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>5. Pliki cookies</h2>
        <p>
          Nasz sklep internetowy wykorzystuje pliki cookies w celu zapewnienia prawidłowego działania serwisu, personalizacji treści oraz analizy ruchu na stronie.
        </p>
        <p>Wykorzystujemy następujące rodzaje plików cookies:</p>
        <ul>
          <li><strong>Niezbędne</strong> — wymagane do prawidłowego działania strony (np. koszyk, sesja użytkownika)</li>
          <li><strong>Analityczne</strong> — pomagają nam zrozumieć, jak użytkownicy korzystają ze strony</li>
          <li><strong>Funkcjonalne</strong> — zapamiętują preferencje użytkownika</li>
        </ul>
        <p>
          Możesz zarządzać ustawieniami plików cookies w swojej przeglądarce internetowej. Wyłączenie plików cookies może wpłynąć na działanie niektórych funkcji strony.
        </p>
      </div>

      <div className="info-section">
        <h2>6. Okres przechowywania danych</h2>
        <p>Twoje dane osobowe przechowywane są przez okres:</p>
        <ul>
          <li>Dane związane z zamówieniami — 5 lat od zakończenia roku podatkowego, w którym dokonano transakcji</li>
          <li>Dane do celów marketingowych — do momentu wycofania zgody lub wniesienia sprzeciwu</li>
          <li>Dane z formularza kontaktowego — przez okres niezbędny do obsługi zapytania, nie dłużej niż 12 miesięcy</li>
          <li>Dane w plikach cookies — zgodnie z okresem ważności poszczególnych plików cookies</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPage;
