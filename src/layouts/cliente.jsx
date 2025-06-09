import { Outlet, useNavigate } from 'react-router-dom';
import '../css/components/cliente/cliente.css';
import Header from '../components/landing/header/navbar';
import ClienteSidebar from '../components/cliente/ClienteSidebar';
import { useAuth } from '../context/AuthContext';

const Cliente = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <Header />
      <div className="cliente-layout">
        <ClienteSidebar handleLogout={handleLogout} />
        <main className="cliente-main-content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Cliente;
