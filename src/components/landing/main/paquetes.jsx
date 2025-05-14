import React, { useEffect, useState } from 'react';
import '../../../css/components/landing/paquetes.css';
import { getTours } from '../../../api/tours';
import { getPaquetes } from '../../../api/paquetes';
import { getServicios } from '../../../api/servicios';

const Paquetes = () => {
    const [actualPaquete, setActualPaquete] = useState(null);
    const [otrosPaquetes, setOtrosPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Obtener el tour más reciente y a futuro
                const tours = await getTours();
                const tourActual = tours.find((tour) => new Date(tour.fechaHora) > new Date());
                
                if (tourActual) {
                    // Obtener el paquete asociado al tour
                    const paqueteActual = tourActual.id_paquete
                    const fechaHora = new Date(tourActual.fechaHora);
                    const fecha = fechaHora.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    });
                    const hora = fechaHora.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });

                    paqueteActual.fecha = fecha;
                    paqueteActual.hora = hora;
                    setActualPaquete(paqueteActual);
                    
                                        // Obtener los servicios asociados al paquete actual
                    const serviciosData = await getServicios();
                    const serviciosFiltrados = serviciosData.filter((servicio) =>
                        paqueteActual.servicios.includes(servicio._id)
                    );
                    setServicios(serviciosFiltrados);
                }

                // Obtener otros paquetes (excluyendo el paquete actual)
                const paquetes = await getPaquetes();
                const otros = paquetes.filter(
                    (paquete) => !tourActual || paquete._id !== tourActual.id_paquete
                );
                setOtrosPaquetes(otros.slice(0, 4)); // Mostrar solo los primeros 4 paquetes
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Cargando paquetes...</div>;
    }

    if (!actualPaquete) {
        return <div className="no-paquete">No hay paquetes disponibles en este momento.</div>;
    }

    return (
        <section className="paquetes">
            
            {console.log(actualPaquete)}
            <div className="actual-paquete">
                <img
                    src={actualPaquete.multimedia[0] || 'https://via.placeholder.com/600x400'}
                    alt={actualPaquete.nombre}
                />
                <div className="paquete-info">
                    <h2 className="paquete-title">{actualPaquete.nombre}</h2>
                    <p className="paquete-location"><span>Destino: </span>{actualPaquete.destino}</p>
                    <p className="paquete-date"><span>Fecha: </span>{actualPaquete.fecha}</p>
                    <p className="paquete-date"><span>Hora: </span>{actualPaquete.hora}</p>
                    <p className="paquete-date"><span>Lugar de Encuentro: </span>{actualPaquete.lugar_encuentro}</p>
                    <div className="paquete-servicios">
                        <h3>Servicios Incluidos:</h3>
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
                    <p className="paquete-description">{actualPaquete.descripcion}</p>
                    <p className="paquete-price">${actualPaquete.valor.toLocaleString('es-ES')}</p>                    
                    
                    <a href="https://wa.me/573238893608/?texto=Mas%Info%sobre%nueva%Coleccion%porfavor" className="btn btn-primary">
                        Contactanos Ahora
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

            {/* Otros Paquetes */}
            <div className="paquete-list">
                <h2 className="paquete-list-title">Otros Paquetes</h2>
                <div className="paquete-items">
                    {otrosPaquetes.map((paquete) => {
                        // Filtrar los servicios para cada paquete
                        const serviciosPaquete = servicios.filter((servicio) =>
                            paquete.servicios.includes(servicio._id)
                        );

                        return (
                        <div key={paquete._id} className="paquete-item">
                            <img
                                src={paquete.multimedia[0] || 'https://via.placeholder.com/300x200'}
                                alt={paquete.nombre}
                            />
                            <div className="paquete-item-info">
                                <h3 className="paquete-item-title">{paquete.nombre}</h3>
                                <p className="paquete-item-location">
                                    {/* <span>Destino: </span> */}
                                    {paquete.destino}
                                </p>
                                <div className="paquete-servicios">
                                    {/* <h3>Servicios Incluidos:</h3> */}
                                    <div className="servicios-icons otros-servicios-icons">
                                        {serviciosPaquete.map((servicio) => (
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
                    })}
                </div>
            </div>
        </section>
    );
};

export default Paquetes;