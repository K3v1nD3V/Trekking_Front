import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import NavOption from '../components/common/NavOption';
import logo from '../../public/LogoTrekking.png';

import '../css/layouts/admin.css';
import '../css/common/Error.css';

const Admin = () => {
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

        {/* Espacio reservado para mantener centrado el logo */}
        <div>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Home
          </button>
        </div>
      </header>

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Menú lateral */}
        {isMenuVisible && (
          <div className="navcontainer">
            <nav className="nav">
              <div className="nav-upper-options">
                {/*----------------------- Dashboard -------------------------------*/}
                {/* <NavOption icon={<span className="material-symbols-outlined" style={icon}>dashboard</span>} text="Dashboard" to="/admin" />
                <hr className="divider" /> */}
                {/*----------------------- ********** -------------------------------*/}

                {/* Configuración */}
                <div className="menu-section">
                  <h3 className="section-title">Configuración</h3>
                  <NavOption icon={<span className="icon material-symbols-outlined">manage_accounts</span>} text="Roles" to="/admin/roles" />
                </div>
                <hr className="divider" />

                {/* Servicios */}
                <div className="menu-section">
                  <h3 className="section-title">Servicios</h3>
                  <NavOption icon={<span className="material-symbols-outlined icon">package_2</span>} text="Paquetes" to="/admin/paquetes" />
                  <NavOption icon={<span className="material-symbols-outlined icon">map</span>} text="Tours" to="/admin/tours" />
                  <NavOption icon={<span className="material-symbols-outlined icon">linked_services</span>} text="Servicios" to="/admin/servicios" />
                </div>
                <hr className="divider" />

                {/* Usuarios */}
                <div className="menu-section">
                  <h3 className="section-title">Usuarios</h3>
                  <NavOption icon={<span className="material-symbols-outlined icon">person</span>} text="Clientes" to="/admin/clientes" />
                  <NavOption icon={<span className="material-symbols-outlined icon">groups</span>} text="Usuarios" to="/admin/usuarios" />
                </div>
                <hr className="divider" />

                {/* Otras opciones */}
                <NavOption 
                  icon={<span className="material-symbols-outlined icon">price_check</span>} 
                  text="Ventas" 
                  to="/admin/ventas" 
                />
                
                <NavOption 
                  icon={<span className="material-symbols-outlined icon">logout</span>} 
                  text="Logout" 
                  to="/" 
                  isLogout={true} 
                />
              </div>
            </nav>
          </div>
        )}

        {/* Contenido principal */}
        <div className="main">
          {/* <div className="box-container">
            <div className="box box1">
              <div className="text">
                <h2 className="topic-heading">60.5k</h2>
                <h2 className="topic">Article Views</h2>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#E5C9B3' }}>visibility</span>
            </div>
            <div className="box box2">
              <div className="text">
                <h2 className="topic-heading">150</h2>
                <h2 className="topic">Likes</h2>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>thumb_up</span>
            </div>
            <div className="box box3">
              <div className="text">
                <h2 className="topic-heading">320</h2>
                <h2 className="topic">Comments</h2>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>forum</span>
            </div>
            <div className="box box4">
              <div className="text">
                <h2 className="topic-heading">70</h2>
                <h2 className="topic">Published</h2>
              </div>
              <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#E5C9B3' }}>check_circle</span>
            </div>
          </div> */}

          {/* Reportes u otros contenidos dinámicos */}
          <div className="report-container">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
