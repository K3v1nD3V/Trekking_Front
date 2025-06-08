import React, { useEffect, useState } from 'react';
import { getPaquetes } from '../../api/paquetes';

const ClientePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchPaquetes = async () => {
      try {
        const response = await getPaquetes();
        const data = response?.data || response || [];
        setPaquetes(data);
      } catch (error) {
        console.error('Error al obtener paquetes:', error);
      }
    };
    fetchPaquetes();
  }, []);

  if (!paquetes.length) {
    return (
      <section>
        <h2 className="detalle-title">Paquetes Disponibles</h2>
        <div className="placeholder">No hay paquetes disponibles.</div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="detalle-title">Paquetes Disponibles</h2>
      <div className="paquete-items">
        {paquetes.map((paquete, idx) => (
          <div
            key={paquete._id || idx}
            className="paquete-card paquete-item"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
          >
            {/* Resumen del paquete */}
            <div className="paquete-item-info paquete-resumen">
              <img
                src={paquete.multimedia?.[0] || 'https://via.placeholder.com/120x80?text=Paquete'}
                alt={paquete.nombre || 'Paquete'}
                className="paquete-img"
              />
              <div className="paquete-main-info">
                <h3 className="paquete-item-title">{paquete.nombre}</h3>
                <p className="paquete-item-location"><b>Destino:</b> {paquete.destino}</p>
                <p className="paquete-item-price"><b>Valor:</b> ${paquete.valor?.toLocaleString('es-CO')}</p>
                <p><b>Lugar de encuentro:</b> {paquete.lugar_encuentro}</p>
              </div>
              <span className="paquete-expand-icon">
                {expanded === idx ? '▲' : '▼'}
              </span>
            </div>
            {/* Detalle expandido */}
            {expanded === idx && (
              <div className="detalle-paquete">
                <p><b>Descripción:</b> {paquete.descripcion}</p>
                <p><b>Servicios incluidos:</b></p>
                <ul>
                  {Array.isArray(paquete.servicios) && paquete.servicios.length
                    ? paquete.servicios.map((serv, i) => (
                        <li key={i}>{typeof serv === 'string' ? serv : serv.nombre || JSON.stringify(serv)}</li>
                      ))
                    : <li>No hay servicios listados.</li>
                  }
                </ul>
                {paquete.multimedia?.length > 1 && (
                  <div className="paquete-galeria">
                    <p><b>Galería:</b></p>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {paquete.multimedia.slice(1).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt={`Imagen ${i + 2}`}
                          style={{ width: 100, height: 70, objectFit: 'cover', borderRadius: 8, border: '1px solid #eee' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClientePaquetes;