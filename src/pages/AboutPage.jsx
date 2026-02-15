import React from 'react';
import './InfoPage.css';

const AboutPage = () => {
  return (
    <div className="info-page">
      <h1>O nas</h1>

      <div className="info-section">
        <h2>Kim jesteśmy</h2>
        <p>
          AutoPartsDirect to firma z ponad 25-letnim doświadczeniem w branży motoryzacyjnej. Od samego początku naszym celem jest dostarczanie najwyższej jakości części samochodowych zarówno dla klientów indywidualnych, jak i warsztatów mechanicznych na terenie całej Polski.
        </p>
        <p>
          Nasza siedziba znajduje się w Polsce, skąd obsługujemy klientów w całym kraju, zapewniając szybką i sprawną dostawę zamówionych produktów.
        </p>
      </div>

      <div className="info-section">
        <h2>Nasi eksperci</h2>
        <p>
          Zespół AutoPartsDirect to wykwalifikowani specjaliści, którzy doskonale znają rynek części motoryzacyjnych. Nasi eksperci pomogą Ci dobrać odpowiednie części do Twojego pojazdu, doradzą w kwestiach technicznych i zaproponują najlepsze rozwiązania.
        </p>
      </div>

      <div className="info-section">
        <h2>Misja firmy</h2>
        <p>
          Naszą misją jest zapewnienie każdemu kierowcy dostępu do wysokiej jakości części samochodowych w konkurencyjnych cenach. Wierzymy, że bezpieczeństwo na drodze zaczyna się od sprawnych podzespołów, dlatego oferujemy wyłącznie produkty sprawdzonych producentów.
        </p>
      </div>

      <div className="info-section">
        <h2>Nasze wartości</h2>
        <ul>
          <li><strong>Jakość</strong> — współpracujemy wyłącznie ze sprawdzonymi dostawcami i producentami, gwarantując najwyższy standard oferowanych produktów.</li>
          <li><strong>Uczciwość</strong> — transparentność w działaniu i uczciwe ceny to fundamenty naszej działalności. Zawsze jasno informujemy o warunkach zakupu.</li>
          <li><strong>Profesjonalizm</strong> — ciągłe doskonalenie i rozwijanie kompetencji naszego zespołu pozwala nam świadczyć usługi na najwyższym poziomie.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>Dlaczego warto nas wybrać?</h2>
        <ul>
          <li>Ponad 25 lat doświadczenia w branży</li>
          <li>Szeroki asortyment części do wszystkich marek</li>
          <li>Fachowe doradztwo techniczne</li>
          <li>Szybka dostawa na terenie całej Polski</li>
          <li>Konkurencyjne ceny i atrakcyjne rabaty</li>
          <li>Gwarancja jakości na wszystkie produkty</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutPage;
