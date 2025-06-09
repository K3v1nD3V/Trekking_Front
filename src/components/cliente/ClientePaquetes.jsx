import React, { useEffect, useState } from 'react';
import { getPaquetes } from '../../api/paquetes';
import { getServicios } from '../../api/servicios';

const ClientePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [servicios, setServicios] = useState([]);
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

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await getServicios();
        const data = response?.data || response || [];
        setServicios(data);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };
    fetchServicios();
  }, []);

  if (!paquetes.length) {
    return (
      <section className="packages-section">
        <h2 className="packages-title">Paquetes Disponibles</h2>
        <div className="packages-placeholder">No hay paquetes disponibles.</div>
      </section>
    );
  }

  return (
    <section className="packages-section">
      <h2 className="packages-title">Paquetes Disponibles</h2>
      <div className="packages-list">
        {paquetes.map((paquete, idx) => {
          // Filtrar los servicios de este paquete
          const serviciosPaquete = Array.isArray(paquete.servicios)
            ? servicios.filter(serv => paquete.servicios.includes(serv._id))
            : [];

          return (
            <article
              key={paquete._id || idx}
              className={`package-card ${expanded === idx ? 'expanded' : ''}`}
              onClick={() => setExpanded(expanded === idx ? null : idx)}
              tabIndex={0}
              onKeyDown={e => { if(e.key === 'Enter') setExpanded(expanded === idx ? null : idx)}}
              role="button"
              aria-expanded={expanded === idx}
            >
              <div className="package-summary">
                <img
                  src={paquete.multimedia?.[0] || 'https://via.placeholder.com/120x80?text=Paquete'}
                  alt={paquete.nombre || 'Paquete'}
                  className="package-image"
                />
                <div className="package-info">
                  <h3 className="package-name">{paquete.nombre}</h3>
                  <p className="package-detail"><b>Destino:</b> {paquete.destino}</p>
                  <p className="package-detail"><b>Valor:</b> ${paquete.valor?.toLocaleString('es-CO')}</p>
                  <p className="package-detail"><b>Lugar de encuentro:</b> {paquete.lugar_encuentro}</p>
                </div>
                <span className="package-toggle-icon">
                  {expanded === idx ? '▲' : '▼'}
                </span>
              </div>

              {expanded === idx && (
                <div className="package-details">
                  <p><b>Descripción:</b> {paquete.descripcion}</p>
                  <p><b>Servicios incluidos:</b></p>
                  <div className="services-icons-list">
                    {serviciosPaquete.length ? (
                      serviciosPaquete.map(servicio => (
                        <span key={servicio._id} className="servicio-item">
                          <span
                            className="material-symbols-outlined servicio-icon"
                            title={servicio.nombre}
                          >
                            {servicio.icono}
                          </span>
                          <span className="servicio-nombre">{servicio.nombre}</span>
                        </span>
                      ))
                    ) : (
                      <span>No hay servicios listados.</span>
                    )}
                  </div>

                  {paquete.multimedia?.length > 1 && (
                    <div className="gallery-section">
                      <p><b>Galería:</b></p>
                      <div className="gallery-images">
                        {paquete.multimedia.slice(1).map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`Imagen ${i + 2}`}
                            className="gallery-image"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ClientePaquetes;
