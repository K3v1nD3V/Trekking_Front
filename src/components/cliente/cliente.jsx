import React from 'react';
import { Outlet } from 'react-router-dom';
import ClienteNavbar from './ClienteNavbar';
import '../../css/components/cliente/cliente.css';

const Cliente = () => {
    return (
        <div className="cliente-layout">
            {/* Navbar del cliente */}
            <ClienteNavbar />

            {/* Contenido dinámico (Paquetes, Servicios, etc.) */}
            <main className="cliente-content">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="cliente-footer">
                <p>&copy; {new Date().getFullYear()} Trekking. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Cliente;