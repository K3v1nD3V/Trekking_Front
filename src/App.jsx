import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';
import Login from './components/auth/login';
import PrivateRoute from './layouts/PrivateRoute';
import RolesTable from '../src/components/admin/tablas/roles';
import Clientes from './components/admin/tablas/clientes';
import Privilegios from './components/admin/tablas/privilegios';
import Permisos from './components/admin/tablas/permisos';


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
    }
  ]);

const [clientes] = useState([
      {
        id:1,
        documento: 1001709975,
        nombre: 'Ximena',
        apellido: 'Castañeda',
        correo: 'roble@gmail.com',
        telefono: 3002934308,
        estado: true
      },
      {
        id:2,
        documento: 10018875454,
        nombre: 'Mariana',
        apellido: 'Cardona',
        correo: 'cardonam@gmail.com',
        telefono: 3001124408,
        estado: true
      },
      {
        id:3,
        documento: 1010700575,
        nombre: 'Rosalba',
        apellido: 'Caicedo',
        correo: 'rosalba_cai@gmail.com',
        telefono: 3123356670,
        estado: true
      },
      {
        id:4,
        documento: 1017202661,
        nombre: 'Dario',
        apellido: 'Galvis',
        correo: 'dariorega@gmail.com',
        telefono: 3015984265,
        estado: true
      }
]);

const [privilegios] = useState([
  {
    id:1,
    descripcion: "Consultar clientes",
    estado: true
  },
  {
    id:2,
    descripcion: "Crear clientes",
    estado: true
  },
  {
    id:3,
    descripcion: "Editar clientes",
    estado: true
  },
  {
    id:4,
    descripcion: "Eliminar clientes",
    estado: true
  },
  {
    
      id:5,
      descripcion: "Crear roles",
      estado: true
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
            <Route path="clientes" element={<Clientes data={clientes} />} />
            <Route path="privilegios" element={<Privilegios data={privilegios} />} />
            <Route path="permisos" element={<Permisos />} />


          </Route>
          
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    );
  };



export default App;
