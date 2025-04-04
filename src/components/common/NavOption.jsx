import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/components/common/NavOption.css';

const NavOption = ({ icon, text, to, isLogout = false }) => {
  return (
    <Link to={to} className={`nav-option ${isLogout ? 'logout' : ''}`}>
      <img src={icon} className="nav-img" alt={text} />
      <h3>{text}</h3>
    </Link>
  );
};

export default NavOption;
