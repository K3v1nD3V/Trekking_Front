import React from 'react';

const PaqueteListItem = ({ paquete, servicios }) => {
    return (
        <div className="paquete-item">
            <img
                src={paquete.multimedia[0] || 'https://via.placeholder.com/300x200'}
                alt={paquete.nombre}
            />
            <div className="paquete-item-info">
                <h3 className="paquete-item-title">{paquete.nombre}</h3>
                <p className="paquete-item-location">{paquete.destino}</p>
                <div className="paquete-servicios">
                    <div className="servicios-icons otros-servicios-icons">
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
                <p className="paquete-item-price">${paquete.valor.toLocaleString('es-ES')}</p>
            </div>
        </div>
    );
};

export default PaqueteListItem;