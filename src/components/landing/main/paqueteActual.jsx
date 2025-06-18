import React from 'react';
import { useTranslation } from 'react-i18next';


const PaqueteActual = ({ paquete, servicios }) => {
    const { t } = useTranslation();
    
    return (
        <div className="actual-paquete">
            <img
                src={paquete.multimedia[0] || 'https://via.placeholder.com/600x400'}
                alt={paquete.nombre}
            />
            <div className="paquete-info">
                <h2 className="paquete-title">{paquete.nombre}</h2>
                <p className="paquete-location">
                    <span> 
                        {t('packages.destination')}: 
                    </span>
                    {paquete.destino}
                </p>
                <p className="paquete-date">
                    <span>
                        {t('packages.date')}: 
                    </span>
                    {paquete.fecha}
                </p>
                <p className="paquete-hour">
                    <span>
                        {t('packages.hour')}: 
                    </span>
                    {paquete.hora}
                </p>
                <p className="paquete-date">
                    <span>
                        {t('packages.meetingPoint')}: 
                    </span>
                    {paquete.lugar_encuentro}
                </p>
                <div className="paquete-servicios">
                    <p>
                        {t('packages.includedServices')}:
                    </p>
                    <div className="servicios-icons">
                        {servicios.map((servicio) => (
                            <span
                                key={servicio._id}
                                className="material-symbols-outlined servicio-icon"
                                title={servicio.nombre}
                            >
                                {servicio.icono}
                            </span>
                        ))}
                    </div>
                </div>
                <p className="paquete-description">{paquete.descripcion}</p>
                <p className="paquete-price">${paquete.valor.toLocaleString('es-ES')}</p>
                <a href="https://wa.me/573053512023/?texto=Mas%Info%sobre%nueva%Coleccion%porfavor" className="btn btn-primary">
                    {t('packages.contactUs')}
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
        </div>
    );
};

export default PaqueteActual;