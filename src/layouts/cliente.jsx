import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import logo from '../../public/LogoTrekking.png';
import '../css/components/cliente/cliente.css';

const Cliente = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  return (
    <>
      {/* Encabezado */}
      <header className="admin-header">
        {/* Icono hamburguesa */}
        <div className="menu-icon" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#8B2B1B' }}>
            {isMenuVisible ? 'menu_open' : 'menu'}
          </span>
        </div>

        {/* Logo centrado */}
        <div className="logo-header-centered">
          <img className='logoStyle' src={logo} alt="Logo Trekking San Cristóbal" />
        </div>

        {/* Botón Home */}
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Sidebar */}
        {isMenuVisible && (
          <div className="navcontainer">
            <nav className="nav">
              {/* Aquí puedes poner tu menú lateral de cliente */}
              <Outlet context={{ sidebar: true }} />
            </nav>
          </div>
        )}

        {/* Contenido principal */}
        <div className="main">
          <div className="report-container">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Cliente;