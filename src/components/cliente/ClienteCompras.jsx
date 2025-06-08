import React, { useEffect, useState } from 'react';
import { getVentas } from '../../api/ventas';

const ClienteCompras = () => {
  const [ventasCliente, setVentasCliente] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const correoCliente = localStorage.getItem('usuario');
        const response = await getVentas();
        const ventas = response?.data || response || [];
        console.log('Ventas del cliente:', ventas);
        
        // Filtra ventas por el id del cliente (id_cliente es objeto)
        const filtradas = ventas.filter(v => {
          if (!v.id_cliente) return false;
          if (typeof v.id_cliente === 'object') return v.id_cliente.correo === correoCliente;
          return v.id_cliente.correo  === correoCliente;
        });
        setVentasCliente(filtradas);
      } catch (error) {
        console.error('Error al obtener ventas del cliente:', error);
      }
    };
    fetchVentas();
  }, []);

  if (!ventasCliente.length) {
    return (
      <section>
        <h2 className="detalle-title">Mis Compras</h2>
        <div className="placeholder">No tienes compras registradas.</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="detalle-title">Mis Compras</h2>
      <div className="paquete-items">
        {ventasCliente.map((venta, idx) => (
          <div
            key={venta._id || idx}
            className="compra-card paquete-item"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            {/* Resumen de la compra */}
            <div className="paquete-item-info compra-resumen">
              <img
                src={venta.id_paquete?.multimedia?.[0] || 'https://via.placeholder.com/120x80?text=Paquete'}
                alt={venta.id_paquete?.nombre || 'Paquete'}
                className="compra-img"
              />
              <div className="compra-main-info">
                <h3 className="paquete-item-title">{venta.id_paquete?.nombre || 'Paquete'}</h3>
                <p className="paquete-item-location"><b>Destino:</b> {venta.id_paquete?.destino || '---'}</p>
                <p className="paquete-item-price"><b>Valor:</b> ${venta.valor?.toLocaleString('es-CO')}</p>
                <p><b>Fecha:</b> {venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '---'}</p>
                <span className={`compra-estado ${venta.estado ? 'activa' : 'inactiva'}`}>
                  {venta.estado ? 'Activa' : 'Inactiva'}
                </span>
              </div>
              <span className="compra-expand-icon">
                {expanded === idx ? '▲' : '▼'}
              </span>
            </div>
            {/* Detalle expandido */}
            {expanded === idx && (
              <div className="detalle-compra">
                <p><b>Cliente:</b> {venta.id_cliente?.nombre} {venta.id_cliente?.apellido}</p>
                <p><b>Documento:</b> {venta.id_cliente?.documento}</p>
                <p><b>Correo:</b> {venta.id_cliente?.correo}</p>
                <p><b>Teléfono:</b> {venta.id_cliente?.telefono}</p>
                <p><b>Observación médica:</b> {venta.id_cliente?.observacion_medica || '---'}</p>
                <p><b>Acompañantes:</b> {venta.acompañantes?.length
                  ? venta.acompañantes.map((a, i) =>
                      typeof a === 'object'
                        ? `${a.nombre} ${a.apellido} (${a.documento})`
                        : a
                    ).join(', ')
                  : 'Ninguno'}
                </p>
                <p><b>Lugar de encuentro:</b> {venta.id_paquete?.lugar_encuentro || '---'}</p>
                <p><b>Descripción:</b> {venta.id_paquete?.descripcion || '---'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClienteCompras;