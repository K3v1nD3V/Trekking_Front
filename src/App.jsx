import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';
import Login from './components/auth/login';
import PrivateRoute from './layouts/PrivateRoute';

const App = () => {
  
  const [paquetes] = useState([
    {
        nombre: 'Paquete Aventura',
        valor: 150000,
        descripcion: 'Tour de aventura en montaña',
        lugar_encuentro: 'Plaza Central',
        destino: 'Montaña del Tigre',
        multimedia: [
          'https://wallpapers.com/images/hd/hd-nature-phone-river-h14wu1u3zdvst0ch.jpg',
          'https://i.4cdn.org/wsg/1743099510944782.mp4',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCXMCnkvAqM19cMA6Pm7my9LYKv9HK_RWAEg&s',
      ]
    },
    {
        nombre: 'Paquete Relax',
        valor: 200000,
        descripcion: 'Tour relajante en termales',
        lugar_encuentro: 'Terminal Norte',
        destino: 'Termales del Valle',
        multimedia: [
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_hN3SXm5l8jxG-Mfu1nohwQLjPb8hfKbsQ&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_hN3SXm5l8jxG-Mfu1nohwQLjPb8hfKbsQ&s',
      ]
    }
  ]);

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
    return (
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/admin/*" element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }>
            <Route index element={<Paquetes data={paquetes} />} />
            <Route path="paquetes" element={<Paquetes data={paquetes} />} />
            <Route path="servicios" element={<Servicios data={servicios} />} />
          </Route>
          
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    );
  };



export default App;
