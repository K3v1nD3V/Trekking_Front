import React, { useEffect, useState } from 'react';
import { getPaquetes } from '../../api/paquetes';
import { getServicios } from '../../api/servicios';

const ClientePaquetes = () => {
  const [paquetes, setPaquetes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [searchText, setSearchText] = useState('');

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <h2 className="packages-title" style={{ margin: 0 }}>Paquetes Disponibles</h2>
        <input
          type="text"
          placeholder="Buscar paquetes..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 7, 
            border: '2px solid #9C9C9CFF',
            outline: 'none',
            background: '#f0f0f0',
            fontSize: 15,
            minWidth: 160,
            maxWidth: 220,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
          }}
        />
      </div>
      <div className="packages-list">
        {paquetes
          .filter(paquete => {
            const nombre = (paquete.nombre || '').toLowerCase();
            const destino = (paquete.destino || '').toLowerCase();
            const descripcion = (paquete.descripcion || '').toLowerCase();
            const texto = searchText.toLowerCase();
            return (
              nombre.includes(texto) ||
              destino.includes(texto) ||
              descripcion.includes(texto)
            );
          })
          .map((paquete, idx) => {
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
                    <a href={`https://wa.me/573053512023/?texto=Me%gustaria%tener%más%informacíon%sobre%el%paquete%${paquete.nombre}`} className="btn btn-primary">
                      Contactanos
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        width="30"
                        height="30"
                        style={{ margin: '0 6px' }}
                    >
                        <path d="M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9"></path>
                        <path d="M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1"></path>
                    </svg>
                </a>
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
