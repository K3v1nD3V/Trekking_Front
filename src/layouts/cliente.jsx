import { Outlet } from 'react-router-dom';
import '../css/components/cliente/cliente.css';
import Header from '../components/landing/header/navbar';
import ClienteSidebar from '../components/cliente/ClienteSidebar';

const Cliente = () => {
  return (
    <>
      {/* Encabezado */}
      <Header/>
      <div className="cliente-layout">
        <ClienteSidebar />
        <main className="cliente-main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Cliente;