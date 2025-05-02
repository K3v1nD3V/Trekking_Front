import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Admin Section
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';
import Login from './components/auth/login';
import PrivateRoute from './layouts/PrivateRoute';
import RolesTable from './components/admin/tablas/roles';
import Usuarios from './components/admin/tablas/usuarios';
import Clientes from './components/admin/tablas/clientes';
import Ventas from './components/admin/tablas/ventas';
import Privilegios from './components/admin/tablas/privilegios';
import Permisos from './components/admin/tablas/permisos';
import RegisterForm from './components/auth/registerForm'; 
import Tours from "./components/admin/tablas/Tours";
// Landing Section
import Landing from './layouts/landing';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} /> 

        {/* Rutas protegidas */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        >
          <Route index element={<Paquetes/>} />
          <Route path="paquetes" element={<Paquetes/>} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="roles" element={<RolesTable/>} />
          <Route path="usuarios" element={<Usuarios/>} />
          <Route path="clientes" element={<Clientes/>} />
          <Route path="ventas" element={<Ventas/>} />
          <Route path="privilegios" element={<Privilegios/>} />
          <Route path="permisos" element={<Permisos/>} />
          <Route path="tours" element={<Tours/>} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Login />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
