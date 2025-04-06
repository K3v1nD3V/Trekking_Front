import React from 'react';
// import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './NavOption.css';

const NavOption = ({ icon, text, to, isLogout = false }) => {
  // const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isLogout) {
      await logout();
      navigate('/login');
    } else {
      navigate(to);
    }
  };

  // Ocultar opciones de admin si no está autenticado
  // if (!user && (text === 'Paquetes' || text === 'Servicios' || text === 'Dashboard')) {
  //   return null;
  // }

  // Mostrar Login si no está autenticado, Logout si está autenticado
  // if ((text === 'Login' && user) || (text === 'Logout' && !user)) {
  //   return null;
  // }

  return (
    <div className="nav-option" onClick={handleClick} data-logout={isLogout}>
      <img src={icon} alt={text} className="nav-icon" />
      <span className="nav-text">{text}</span>
    </div>
  );
};

export default NavOption;
