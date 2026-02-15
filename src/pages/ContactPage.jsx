import React, { useState } from 'react';
import './InfoPage.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="info-page">
      <h1>Kontakt</h1>

      <div className="info-section">
        <h2>Napisz do nas</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Imię</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="subject">Temat</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Wiadomość</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Wyślij wiadomość</button>
        </form>
      </div>

      <div className="info-section">
        <h2>Dane kontaktowe</h2>
        <div className="contact-info-grid">
          <div className="info-card">
            <h3>Telefon</h3>
            <p>+48 451 499 525</p>
          </div>
          <div className="info-card">
            <h3>Email</h3>
            <p>autoparts.sprzedaz@gmail.com</p>
          </div>
          <div className="info-card">
            <h3>Godziny pracy</h3>
            <p>Poniedziałek – Piątek</p>
            <p>8:00 – 17:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
