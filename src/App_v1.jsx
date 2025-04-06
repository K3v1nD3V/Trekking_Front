import React, { useState }  from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './layouts/admin';
import Paquetes from './components/admin/tablas/paquetes';
import Servicios from './components/admin/tablas/servicios';


const App = () => {
  // Data de ejemplo, despues se hara consumo de la api
  const [paquetes] = useState([
    {
        nombre: 'Paquete Aventura',
        valor: 150000,
        descripcion: 'Tour de aventura en montaña',
        lugar_encuentro: 'Plaza Central',
        destino: 'Montaña del Tigre'
    },
    {
        nombre: 'Paquete Relax',
        valor: 200000,
        descripcion: 'Tour relajante en termales',
        lugar_encuentro: 'Terminal Norte',
        destino: 'Termales del Valle'
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
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="admin" element={<Admin />}>
            <Route index element={<Paquetes data={paquetes}/>} />
            <Route path="servicios" element={<Servicios data={servicios}/>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
