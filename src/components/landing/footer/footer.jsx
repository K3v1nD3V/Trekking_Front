import React from 'react';
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import '../../../css/components/landing/footer.css';

const Footer = () => {
    return (
        <footer className="footer">
           <div className="footer-container">
            <div className="footer-logo">
                <img src="/public/LogoTrekking.png" alt="Logo Trekking San Cristóbal" />
            </div>
            <div className="footer-social">
                <a href="https://api.whatsapp.com/send?phone=%2B573053512023" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp">
                    <FaWhatsapp />
                </a>
                <a href="https://www.instagram.com/trekkingsancris?igsh=a29jdTV2bXQzcDB6" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                    <FaInstagram />
                </a>
                <a href="https://www.facebook.com/share/1FP1TETsZm/" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                    <FaFacebookF />
                </a>
            </div>
        </div>


            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Trekking San Cristóbal. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
