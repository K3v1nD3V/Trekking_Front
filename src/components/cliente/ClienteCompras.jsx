import React, { useEffect } from 'react';
import { getVentas } from '../../api/ventas';

const ClienteCompras = () => {
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const idCliente = localStorage.getItem('usuario');
        const response = await getVentas();
        console.log('Ventas obtenidas:', response);
        console.log('ID del cliente:', idCliente);
        // Si getVentas retorna { data: [...] }
        const ventas = response || [];
        // Filtra ventas por el id del cliente
        const ventasCliente = ventas.filter(() => {
            console.log("Cliente: ", ventas[0].id_cliente._id);
            
            return idCliente === ventas[0].id_cliente._id;
        });
        console.log('Ventas del cliente:', ventasCliente);
      } catch (error) {
        console.error('Error al obtener ventas del cliente:', error);
      }
    };
    fetchVentas();
  }, []);

  return (
    <section>
      <h2 className="detalle-title">Mis Compras</h2>
      <div className="placeholder">Aquí se mostrarán tus compras.</div>
    </section>
  );
};

export default ClienteCompras;