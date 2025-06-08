import React from 'react';
import NavOption from '../common/NavOption';

const ClienteSidebar = () => (
  <aside className="cliente-sidebar">
    <nav>
      <ul className="sidebar-list">
        <li>
          <NavOption
            icon={<span className="material-symbols-outlined">receipt_long</span>}
            text="Mis Compras"
            to="/cliente/compras" // <-- Cambia aquí
          />
        </li>
        <li>
          <NavOption
            icon={<span className="material-symbols-outlined">inventory_2</span>}
            text="Paquetes Disponibles"
            to="/cliente/paquetes" // <-- Cambia aquí
          />
        </li>
      </ul>
    </nav>
  </aside>
);

export default ClienteSidebar;