// import { useAuth } from '../../context/AuthContext';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
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

  return (
    <div className={`nav-option ${isLogout ? 'logout' : ''}`} onClick={handleClick}>
      {icon}
      <h3 style={{ fontSize: '1rem', margin: 0 }}>{text}</h3>
    </div>
  );
};

export default NavOption;


// Ocultar opciones de admin si no está autenticado
// if (!user && (text === 'Paquetes' || text === 'Servicios' || text === 'Dashboard')) {
//   return null;
// }

// Mostrar Login si no está autenticado, Logout si está autenticado
// if ((text === 'Login' && user) || (text === 'Logout' && !user)) {
//   return null;
// }
