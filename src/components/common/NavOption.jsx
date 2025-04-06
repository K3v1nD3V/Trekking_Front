import React from 'react';
// import { useAuth } from '../../context/AuthContext';
import { logout } from '../../api/auth';
import { useNavigate } from 'react-router-dom';
import './NavOption.css';

const NavOption = ({ icon, text, to, isLogout }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (isLogout) {
      logout();
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
    <div className="option" onClick={handleClick}>
      <img src={icon} className="nav-img" alt="nav-icon" />
      <h3>{text}</h3>
    </div>
  );
};

export default NavOption;
