import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import RoleRoute from './components/RoleRoute';
// Admin Section
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';
import Login from './components/auth/login';
import RecuperarForm from './components/auth/RecuperarForm';
import CambiarContrasenaForm from './components/auth/CambiarContrasenaForm';
import PrivateRoute from './layouts/PrivateRoute';
import RolesTable from './components/admin/tablas/roles';
import Usuarios from './components/admin/tablas/usuarios';
import Clientes from './components/admin/tablas/clientes';
import Ventas from './components/admin/tablas/ventas';
import RegisterForm from './components/auth/registerForm'; 
import Tours from "./components/admin/tablas/Tours";
// Landing Section
import Landing from './layouts/landing';
// Cliente Section
import Cliente from './components/cliente/cliente';

const App = () => {
  return (
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterForm />} /> 
        <Route path="/recuperar" element={<RecuperarForm />} />
        <Route path="/cambiar-contrasena/:token" element={<CambiarContrasenaForm />} />

        {/* Rutas protegidas */}
        <Route
          path="/admin/*"
          element={
            <AuthProvider> 
              <RoleRoute requiredRole="admin">
                <PrivateRoute>
                  <Admin />
                </PrivateRoute>
              </RoleRoute>
            </AuthProvider>
          }
        >
          <Route index element={<Paquetes/>} />
          <Route path="paquetes" element={<Paquetes/>} />
          <Route path="servicios" element={<Servicios />} />
          <Route path="roles" element={<RolesTable/>} />
          <Route path="usuarios" element={<Usuarios/>} />
          <Route path="clientes" element={<Clientes/>} />
          <Route path="ventas" element={<Ventas/>} />
          <Route path="tours" element={<Tours/>} />
        </Route>

        {/* Rutas del cliente */}
        <Route 
          path="/cliente/*" 
          element={
            <AuthProvider>
              <RoleRoute requiredRole="usuario">
                <PrivateRoute>
                  <Cliente />
                </PrivateRoute>
                </RoleRoute>
            </AuthProvider>
          }>
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Landing />} />
      </Routes>
  );
};

export default App;
