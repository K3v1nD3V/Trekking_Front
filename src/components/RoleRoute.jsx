import React from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from './common/Modal';

// import logo from '../../public/loadicon.png'; 

const RoleRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  // if (!user || user.rol !== requiredRole) {
  //   window.location.href = '/';
  //   // return <div className='acceso_denegado-container'>
  //   //     <p>Acceso denegado. No tienes permiso para ver esta página.</p>
  //   //   </div>;
  // }

  if (!user || user.rol !== requiredRole) {
    return (
      <Modal
        isOpen={true}
        onClose={() => window.location.href = '/'}
        title="Acceso Denegado"
        closeButton={false}
      >
        <div className="acceso_denegado-container">
          <h2>Acceso Denegado</h2>
          {/* <img src={logo} alt="Logo" className="logo" /> */}
          <p>No tienes permiso para ver esta página 😛.</p>
          <div className="acceso_denegado-buttons">
            <button 
              onClick={() => window.location.href = '/'}
              className="btn btn-secondary"
            >
              Volver
            </button>
            <button 
              onClick={() => window.location.href = '/login'}
              className="btn btn-primary"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

      </Modal>
    );
    // return <div className='acceso_denegado-container'>
    //     <p>Acceso denegado. No tienes permiso para ver esta página.</p>
    //   </div>;
  }

  return children;
};

export default RoleRoute;