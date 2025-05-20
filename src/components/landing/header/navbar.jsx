import React from 'react';
import { FaHome, FaInfoCircle, FaSuitcase, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../../../css/components/landing/header.css';

const NavBar = () => {
    
    return (
        <header className="header">
            <nav className="navbar">

                <div className="menu-toggle" id="menu-toggle">
                    <span class="material-symbols-outlined">
                    menu
                    </span>                
                </div>
                <div className="navbar-logo">
                    <a href="#home" className="logo-text">
                        <img src="/src/assets/ORIGINAL_PNG.png" alt="Logo Trekking San Cristobal" className="logo-img" />
                    </a>
                </div>
                <ul className="navbar-links">
                    <li><a href="#paquetes" className="nav-link"><FaHome /> Paquetes</a></li>
                    <li><a href="#portfolio" className="nav-link"><FaSuitcase /> Portafolio</a></li>
                    <li><a href="#servicios" className="nav-link"><FaSuitcase /> Servicios</a></li>
                    <li><a href="#about" className="nav-link"><FaInfoCircle /> Sobre Nosotros</a></li>
                </ul>
                <div className="navbar-auth">
                    <a href="/login" className="btn btn-outline"><FaSignInAlt /> Ingresar</a>
                    <a href="/register" className="btn btn-primary"><FaUserPlus /> Registrarse</a>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
