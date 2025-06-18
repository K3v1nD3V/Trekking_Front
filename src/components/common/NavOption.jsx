import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../api/auth';
import { showConfirm } from '../../alerts/alerts';
import './NavOption.css';

const NavOption = ({ icon, text, to, isLogout }) => {
  const navigate = useNavigate();

  const handleClick = async () => {
    if (isLogout) {
      const result = await showConfirm('¿Estás seguro de que deseas cerrar sesión?');
      
      if (result.isConfirmed) {
        logout();
        navigate('/login');
      }

      return; 
    }

    navigate(to);
  };

  return (
    <div className={`nav-option ${isLogout ? 'logout' : ''}`} onClick={handleClick}>
      {icon}
      <h3 style={{ fontSize: '1rem', margin: 0 }}>{text}</h3>
    </div>
  );
};

export default NavOption;