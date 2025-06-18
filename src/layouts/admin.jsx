import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavOption from '../components/common/NavOption';
import logo from '../../public/LogoTrekking.png';
import { logout } from '../api/auth';

import '../css/layouts/admin.css';
import '../css/common/Error.css';

import { showConfirm } from '../alerts/alerts';

const Admin = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    const result = await showConfirm('¿Estás seguro de que deseas cerrar sesión?');
    if (result.isConfirmed) {
      logout();
      navigate('/');
    }
  };

  return (
    <>
      {/* Encabezado */}
      <header className="admin-header">
        <div className="menu-icon" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#8B2B1B' }}>
            {isMenuVisible ? 'menu_open' : 'menu'}
          </span>
        </div>

        <div className="logo-header-centered">
          <img className='logoStyle' src={logo} alt="Logo Trekking San Cristóbal" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#8B2B1B' }}>
              home
            </span>
          </div>

          <div onClick={() => handleLogout()}>
            <span className="material-symbols-outlined iconStyle" style={{ fontSize: '40px', color: '#8B2B1B' }}>
              logout
            </span>
          </div>
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


                {/* Servicios */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Servicios</h3>
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">package_2</span>} text="Paquetes" to="/admin/paquetes" />
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">map</span>} text="Tours" to="/admin/tours" />
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">linked_services</span>} text="Servicios" to="/admin/servicios" />
                </div>
                <hr className="divider" />

                {/* Usuarios */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Usuarios</h3>
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">person</span>} text="Clientes" to="/admin/clientes" />
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">groups</span>} text="Usuarios" to="/admin/usuarios" />
                </div>
                <hr className="divider" />

                {/* Ventas */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Ventas</h3>
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">price_check</span>} text="Ventas" to="/admin/ventas" />
                </div>
                <hr className="divider" />

                {/* Configuración */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Configuración</h3>
                  <NavOption icon={<span className="material-symbols-outlined iconStyle">manage_accounts</span>} text="Roles" to="/admin/roles" />
                  {/* <NavOption
                    icon={<span className="material-symbols-outlined iconStyle">logout</span>}
                    text="Cerrar Sesión"
                    onClick={handleLogout}
                    isLogout={true}
                  /> */}
                </div>
              </div>
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

export default Admin;
