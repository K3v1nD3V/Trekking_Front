// Footer.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fontawesome/react-fontawesome';
import { faWhatsapp, faInstagram, faFacebook } from '@fontawesome/free-brands-svg-icons';
import '../../../css/components/landing/footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        {/* Logo */}
        <div className="footer__logo">
          <img src="/src/assets/ORIGINAL_PNG.png" alt="Logo de la empresa" />
        </div>

        {/* Redes sociales */}
        <div className="footer__social">
          <a href="https://api.whatsapp.com/send?phone=%2B573053512023" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faWhatsapp} size="2x" />
          </a>
          <a href="https://www.instagram.com/trekkingsancris?igsh=a29jdTV2bXQzcDB6" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} size="2x" />
          </a>
          <a href="https://www.facebook.com/share/1FP1TETsZm/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} size="2x" />
          </a>
        </div>

        {/* Copyright */}
        <div className="footer__copy">
          &copy; {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
