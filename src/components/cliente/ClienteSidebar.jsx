import React from 'react';
import NavOption from '../common/NavOption';
import { useTranslation } from 'react-i18next';
import { showConfirm } from '../../alerts/alerts';

const ClienteSidebar = ({ handleLogout }) => {
  const { t } = useTranslation();

  const handleLogoutClick = async () => {
    const result = await showConfirm('¿Estás seguro de que deseas cerrar sesión?');
    if (result.isConfirmed) {
      handleLogout(); // Solo se ejecuta si el usuario confirma
    }
  };

  return (
    <aside className="sidebar-cliente">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavOption
              icon={<span className="material-symbols-outlined">receipt_long</span>}
              text={t('sideBar.purchases')}
              to="/cliente/compras"
            />
          </li>
          <li>
            <NavOption
              icon={<span className="material-symbols-outlined">inventory_2</span>}
              text={t('sideBar.packages')}
              to="/cliente/paquetes"
            />
          </li>
        </ul>
        <div className="sidebar-logout">
          <button className="btn-cliente-logout" onClick={handleLogoutClick}>
            {t('header.logout')}
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default ClienteSidebar;
