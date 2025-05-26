import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaSuitcase, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

import LogoTrekking from '../../../../public/LogoTrekking.png';
import '../../../css/components/landing/header.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    i18n.changeLanguage(savedLanguage);
  }, [i18n]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLandingLinks = () => (
    <ul className="navbar-links">
      <li>
        <a href="#paquetes" className="nav-link">
          <FaHome /> {t('header.packages')}
        </a>
      </li>
      <li>
        <a href="#portfolio" className="nav-link">
          <FaSuitcase /> {t('header.portfolio')}
        </a>
      </li>
      <li>
        <a href="#servicios" className="nav-link">
          <FaSuitcase /> {t('header.services')}
        </a>
      </li>
      <li>
        <a href="#about" className="nav-link">
          <FaInfoCircle /> {t('header.about')}
        </a>
      </li>
      <li>
        <a href="#contact" className="nav-link">
          <FaEnvelope /> {t('header.contact')}
        </a>
      </li>
    </ul>
  );

  const renderAuthButtons = () => {
    if (!user) {
      // No autenticado
      return (
        <div className="navbar-auth">
          <Link to="/login" className="btn btn-outline">
            <FaSignInAlt /> {t('header.login')}
          </Link>
          <Link to="/register" className="btn btn-primary">
            <FaUserPlus /> {t('header.register')}
          </Link>
        </div>
      );
    }

    if (user.rol === 'admin') {
      // Administrador
      return (
        <div className="navbar-auth">
          {location.pathname === '/' ? (
            <button className="btn btn-primary" onClick={() => navigate('/admin')}>
              {t('header.admin')}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              {t('header.home')}
            </button>
          )}
        </div>
      );
    }

    if (user.rol === 'cliente') {
      // Cliente
      return (
        <div className="navbar-auth">
          <button className="btn btn-secondary" onClick={handleLogout}>
            {t('header.logout')}
          </button>
          {location.pathname === '/' ? (
            <button className="btn btn-primary" onClick={() => navigate('/cliente')}>
              {t('header.client')}
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              {t('header.home')}
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="navbar-logo">
          <a href="#home" className="logo-text">
            <img src={LogoTrekking} alt="Logo Trekking San Cristobal" className="logo-img" />
          </a>
        </div>
        {location.pathname === '/' && renderLandingLinks()}
        {renderAuthButtons()}
      </nav>
      <div className="language-selector">
        <button onClick={() => changeLanguage('es')} className="btn btn-outline">
          {t('header.languaje.es')}
        </button>
        <button onClick={() => changeLanguage('en')} className="btn btn-outline">
          {t('header.languaje.en')}
        </button>
      </div>
    </header>
  );
};

export default NavBar;
