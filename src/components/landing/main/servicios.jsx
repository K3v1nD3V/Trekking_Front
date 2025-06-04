import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../../css/components/landing/servicios.css';
import { getServicios } from '../../../api/servicios';

const Servicios = () => {
  const { t } = useTranslation();
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await getServicios();
        const activos = data.filter(s => s.estado === true);
        setServicios(activos);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
      }
    };

    fetchServicios();
  }, []);

  return (
    <section className="servicios-section" id="servicios">
      <div className="servicios-container">
        <h1 className="servicios-title">
          {t('services.title')}
        </h1>
        <i class="fas fa-h1"></i>
        <div className="servicios-grid">
          {servicios.map((servicio) => (
            <div className="servicio-card" key={servicio._id}>
              <span className={`material-symbols-outlined servicio-icon`}>
                {servicio.icono}
              </span>
              <h3>{servicio.nombre}</h3>
              <p>{servicio.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Servicios;
