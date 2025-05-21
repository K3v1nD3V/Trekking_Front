import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../landing/header/navbar';
import '../../css/components/cliente/cliente.css';
import ClienteMain from './clienteMain';

const Cliente = () => {
    return (
        <div className="cliente-layout">
            {/* Navbar del cliente */}
            <Navbar/>

            {/* Contenido principal */}
            <ClienteMain/>

            {/* Footer */}
            <footer className="cliente-footer">
                <p>&copy; {new Date().getFullYear()} Trekking. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Cliente;