import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/components/cliente/cliente.css';

const ClienteNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken'); // Elimina el token de autenticación
        navigate('/'); // Redirige a la landing
    };

    return (
        <header className="cliente-navbar">
            <div className="logo">
                <Link to="/">Trekking</Link>
            </div>
            <nav className="cliente-nav">
                <Link to="/cliente/paquetes">Paquetes</Link>
                <Link to="/cliente/servicios">Servicios</Link>
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
            </nav>
        </header>
    );
};

export default ClienteNavbar;