import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import NavOption from '../components/common/NavOption';
import logo from '../assets/image/ORIGINAL_PNG.png';
import { showConfirm } from '../alerts/alerts';

// Estilos
const logoStyle = {
  height: '170px',
  width: 'auto',
  objectFit: 'contain',
};

const iconStyle = {
  fontSize: '50px',
  color: '#8B2B1B',
};

const Admin = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(true);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async () => {
    const confirmed = await showConfirm('¿Estás seguro de que deseas cerrar sesión?');
    if (confirmed) {
      localStorage.clear();
      navigate('/login');
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
          <img src={logo} alt="Logo Trekking San Cristóbal" style={logoStyle} />
        </div>

        <div style={{ width: '40px' }}></div>
      </header>

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Menú lateral */}
        {isMenuVisible && (
          <div className="navcontainer">
            <nav className="nav">
              <div className="nav-upper-options">
                {/* Servicios */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Servicios</h3>
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>package_2</span>} text="Paquetes" to="/admin/paquetes" />
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>map</span>} text="Tours" to="/admin/tours" />
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>linked_services</span>} text="Servicios" to="/admin/servicios" />
                </div>
                <hr className="divider" />

                {/* Usuarios */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Usuarios</h3>
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>person</span>} text="Clientes" to="/admin/clientes" />
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>groups</span>} text="Usuarios" to="/admin/usuarios" />
                </div>
                <hr className="divider" />

                {/* Ventas */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Ventas</h3>
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>price_check</span>} text="Ventas" to="/admin/ventas" />
                </div>
                <hr className="divider" />

                {/* Configuración */}
                <div className="menu-section">
                  <h3 className="section-title">Gestión Configuración</h3>
                  <NavOption icon={<span className="material-symbols-outlined" style={iconStyle}>manage_accounts</span>} text="Roles" to="/admin/roles" />
                  <NavOption
                    icon={<span className="material-symbols-outlined" style={iconStyle}>logout</span>}
                    text="Cerrar Sesión"
                    onClick={handleLogout}
                    isLogout={true}
                  />
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
