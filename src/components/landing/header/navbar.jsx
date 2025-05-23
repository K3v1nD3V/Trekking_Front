import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaSuitcase, FaEnvelope, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';
import '../../../css/components/landing/header.css';

const NavBar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderLandingLinks = () => (
    <ul className="navbar-links">
      <li><a href="#paquetes" className="nav-link"><FaHome /> Paquetes</a></li>
      <li><a href="#portfolio" className="nav-link"><FaSuitcase /> Portafolio</a></li>
      <li><a href="#servicios" className="nav-link"><FaSuitcase /> Servicios</a></li>
      <li><a href="#about" className="nav-link"><FaInfoCircle /> Sobre Nosotros</a></li>
      <li><a href="#contact" className="nav-link"><FaEnvelope /> Contacto</a></li>
    </ul>
  );

  const renderAuthButtons = () => {
    if (!user) {
      // No autenticado
      return (
        <div className="navbar-auth">
          <Link to="/login" className="btn btn-outline"><FaSignInAlt /> Ingresar</Link>
          <Link to="/register" className="btn btn-primary"><FaUserPlus /> Registrarse</Link>
        </div>
      );
    }

    if (user.rol === 'admin') {
      // Administrador
      return (
        <div className="navbar-auth">
          {location.pathname === '/' ? (
            <button className="btn btn-primary" onClick={() => navigate('/admin')}>
              Volver a Administración
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Ir a la Landing
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
            Cerrar Sesión
          </button>
          {location.pathname === '/' ? (
            <button className="btn btn-primary" onClick={() => navigate('/cliente')}>
              Volver a Cliente
            </button>
          ) : (
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Ir a la Landing
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
            <img src="/src/assets/ORIGINAL_PNG.png" alt="Logo Trekking San Cristobal" className="logo-img" />
          </a>
        </div>
        {location.pathname === '/' && renderLandingLinks()}
        {renderAuthButtons()}
      </nav>
    </header>
  );
};

export default NavBar;
