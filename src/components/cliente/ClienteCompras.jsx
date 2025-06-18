import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getVentas } from '../../api/ventas';
// import { getUsuarioById } from '../../api/usuarios';

const ClienteCompras = () => {
  const [ventasCliente, setVentasCliente] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const { t } = useTranslation();
  
  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const idCliente = localStorage.getItem('usuario');
        // const usuarioResponse = await getUsuarioById(idCliente);
        const response = await getVentas();
        const ventas = response?.data || response || [];
        
        const filtradas = ventas.filter(v => {
          if (typeof v.id_cliente === 'object') return v.id_cliente.id_usuario === idCliente;
          return false;
        });
        // console.log('Filtrando venta:', filtradas);
        setVentasCliente(filtradas);
      } catch (error) {
        console.error('Error al obtener ventas del cliente:', error);
      }
    };
    fetchVentas();
  }, []);

  if (!ventasCliente.length) {
    return (
      <section className="cliente-compras">
        <h2 className="cliente-compras__titulo">{t('compras.title')}</h2>
        <div className="cliente-compras__mensaje">{t('compras.noPurchases')}</div>
      </section>
    );
  }

  return (
    <section className="cliente-compras">
      <h2 className="cliente-compras__titulo">{t('compras.title')}</h2>
      <div className="cliente-compras__lista">
        {ventasCliente.map((venta, idx) => (
          <div
            key={venta._id || idx}
            className={`cliente-compras__card ${expanded === idx ? 'cliente-compras__card--expandida' : ''}`}
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            <div className="cliente-compras__resumen">
              <img
                src={venta.id_paquete?.multimedia?.[0] || 'https://via.placeholder.com/120x80?text=Paquete'}
                alt={venta.id_paquete?.nombre || 'Paquete'}
                className="cliente-compras__imagen"
              />
              <div className="cliente-compras__info">
                <h3 className="cliente-compras__paquete">{venta.id_paquete?.nombre || 'Paquete'}</h3>
                <p><b>{t('compras.destination')}:</b> {venta.id_paquete?.destino || '---'}</p>
                <p><b>{t('compras.value')}:</b> ${venta.valor?.toLocaleString('es-CO')}</p>
                <p><b>{t('compras.date')}:</b> {venta.fecha ? new Date(venta.fecha).toLocaleDateString() : '---'}</p>
                <span className={`cliente-compras__estado ${venta.estado ? 'estado--activa' : 'estado--inactiva'}`}>
                  {venta.estado ? t('compras.active') : t('compras.inactive')}
                </span>
              </div>
              <span className="cliente-compras__icono">
                {expanded === idx ? '▲' : '▼'}
              </span>
            </div>
            {expanded === idx && (
              <div className="cliente-compras__detalle">
                {console.log('Detalles de la venta:', venta)}
                <p><b>{t('compras.client')}:</b> {venta.id_cliente?.nombre} {venta.id_cliente?.apellido}</p>
                <p><b>{t('compras.document')}:</b> {venta.id_cliente?.documento}</p>
                <p><b>{t('compras.email')}:</b> {venta.id_cliente?.correo}</p>
                <p><b>{t('compras.phone')}:</b> {venta.id_cliente?.telefono}</p>
                <p><b>{t('compras.medicalObservation')}:</b> {venta.id_cliente?.observacion_medica || '---'}</p>
                <p><b>{t('compras.companions')}:</b> {venta.acompañantes?.length
                  ? venta.acompañantes.map((a, i) =>
                      typeof a === 'object'
                        ? `${a.nombre} ${a.apellido} (${a.documento})`
                        : a
                    ).join(', ')
                  : 'Ninguno'}
                </p>
                <p><b>{t('compras.meetingPoint')}:</b> {venta.id_paquete?.lugar_encuentro || '---'}</p>
                <p><b>{t('compras.description')}:</b> {venta.id_paquete?.descripcion || '---'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClienteCompras;
