import React from 'react';
import NavOption from '../common/NavOption';
import { useTranslation } from 'react-i18next';

const ClienteSidebar = ({ handleLogout }) => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar-cliente">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavOption
              icon={<span className="material-symbols-outlined">receipt_long</span>}
              text="Mis Compras"
              to="/cliente/compras"
            />
          </li>
          <li>
            <NavOption
              icon={<span className="material-symbols-outlined">inventory_2</span>}
              text="Paquetes Disponibles"
              to="/cliente/paquetes"
            />
          </li>
        </ul>
        <div className="sidebar-logout">
          <button className="btn-cliente-logout" onClick={handleLogout}>
            {t('header.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default ClienteSidebar;
