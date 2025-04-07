import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';
import Login from './components/auth/login';
import PrivateRoute from './layouts/PrivateRoute';
import RolesTable from '../src/components/admin/tablas/roles';

const App = () => {
  
  const [servicios] = useState([
      {
          id: 1,
          nombre: 'Guía turístico',
          descripcion: 'Servicio de guía profesional',
          estado: true
      },
      {
          id: 2,
          nombre: 'Transporte',
          descripcion: 'Traslado a los lugares de interés',
          estado: true
      },
      {
          id: 3,
          nombre: 'Alimentación',
          descripcion: 'Comidas incluidas',
          estado: false
      }
  ]);
  const [roles] = useState([
    {
        id: 1,
        nombreRol: "Administrador",
        estado: true,
        permisos: ["Gestionar usuarios", "Ver reportes", "Acceso total"],
        privilegios: [1, 2, 3, 4]
    },
    {
        id: 2,
        nombreRol: "Cliente",
        estado: true,
        permisos: ["Ver paquetes", "Reservar servicios"],
        privilegios: [1]
    },
    {
        id: 3,
        nombreRol: "Guía",
        estado: false,
        permisos: ["Acceso a itinerarios", "Ver paquetes asignados"],
        privilegios: [2, 3]
    }
]);

    return (
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }>
            <Route index element={<Paquetes/>} />
            <Route path="paquetes" element={<Paquetes/>} />
            <Route path="servicios" element={<Servicios data={servicios} />} />
            <Route path="roles" element={<RolesTable data={roles} />} />
          </Route>
          
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    );
  };



export default App;
