import React from 'react';
import './InfoPage.css';

const RegulaminPage = () => {
  return (
    <div className="info-page">
      <h1>Regulamin sklepu</h1>

      <div className="info-section">
        <h2>§1 Postanowienia ogólne</h2>
        <ol>
          <li>Sklep internetowy AutoPartsDirect prowadzony jest przez AutoPartsDirect Sp. z o.o. z siedzibą w Polsce.</li>
          <li>Niniejszy regulamin określa zasady korzystania ze sklepu internetowego, składania zamówień, dostawy produktów oraz reklamacji.</li>
          <li>Warunkiem korzystania ze sklepu jest akceptacja niniejszego regulaminu.</li>
          <li>Ceny podane w sklepie są cenami brutto (zawierają podatek VAT) i wyrażone są w złotych polskich.</li>
        </ol>
      </div>

      <div className="info-section">
        <h2>§2 Zawarcie umowy sprzedaży</h2>
        <ol>
          <li>Zamówienia można składać za pośrednictwem sklepu internetowego 24 godziny na dobę, 7 dni w tygodniu.</li>
          <li>W celu złożenia zamówienia należy dodać wybrany produkt do koszyka, wypełnić formularz zamówienia i potwierdzić zamówienie.</li>
          <li>Po złożeniu zamówienia Kupujący otrzymuje potwierdzenie przyjęcia zamówienia drogą elektroniczną.</li>
          <li>Umowa sprzedaży zostaje zawarta w momencie potwierdzenia zamówienia przez Sprzedawcę.</li>
        </ol>
      </div>

      <div className="info-section">
        <h2>§3 Prawo do odstąpienia od umowy</h2>
        <ol>
          <li>Konsument ma prawo odstąpić od umowy zawartej na odległość w terminie 14 dni bez podania jakiejkolwiek przyczyny.</li>
          <li>Termin do odstąpienia od umowy wygasa po upływie 14 dni od dnia, w którym Konsument wszedł w posiadanie towaru.</li>
          <li>Aby skorzystać z prawa odstąpienia od umowy, Konsument musi poinformować Sprzedawcę o swojej decyzji w drodze jednoznacznego oświadczenia.</li>
          <li>W przypadku odstąpienia od umowy Sprzedawca zwraca wszystkie otrzymane od Konsumenta płatności nie później niż 14 dni od dnia otrzymania oświadczenia o odstąpieniu.</li>
        </ol>
      </div>

      <div className="info-section">
        <h2>§4 Reklamacje</h2>
        <ol>
          <li>Sprzedawca odpowiada wobec Kupującego za wady fizyczne i prawne towaru na zasadach określonych w Kodeksie cywilnym.</li>
          <li>Reklamację można złożyć drogą elektroniczną na adres: autoparts.sprzedaz@gmail.com lub telefonicznie pod numerem +48 451 499 525.</li>
          <li>Reklamacja powinna zawierać opis wady, żądanie Kupującego oraz dowód zakupu.</li>
          <li>Sprzedawca rozpatrzy reklamację w terminie 14 dni od dnia jej otrzymania.</li>
        </ol>
      </div>

      <div className="info-section">
        <h2>§5 Dostawa i płatności</h2>
        <ol>
          <li>Dostawa realizowana jest na terenie Rzeczypospolitej Polskiej za pośrednictwem firm kurierskich.</li>
          <li>Czas realizacji zamówienia wynosi od 1 do 5 dni roboczych od momentu zaksięgowania płatności.</li>
          <li>Dostępne formy płatności: przelew bankowy, płatność za pobraniem, płatności online.</li>
          <li>Koszty dostawy są podawane w trakcie składania zamówienia i zależą od wybranego sposobu dostawy.</li>
        </ol>
      </div>

      <div className="info-section">
        <h2>§6 Dane administratora</h2>
        <p>AutoPartsDirect Sp. z o.o.</p>
        <p>Email: autoparts.sprzedaz@gmail.com</p>
        <p>Telefon: +48 451 499 525</p>
        <p>Godziny pracy: poniedziałek – piątek, 8:00 – 17:00</p>
      </div>
    </div>
  );
};

export default RegulaminPage;
