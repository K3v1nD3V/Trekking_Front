import React, { useEffect, useState } from 'react';
import '../../../css/components/landing/paquetes.css';
import { getTours } from '../../../api/tours';
import { getPaquetes } from '../../../api/paquetes';
import { getServicios } from '../../../api/servicios';
import PaqueteActual from './paqueteActual';
import PaqueteListItem from './paqueteListItem';

const Paquetes = () => {
    const [actualPaquete, setActualPaquete] = useState(null);
    const [otrosPaquetes, setOtrosPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tours = await getTours();
                const tourActual = tours.find((tour) => new Date(tour.fechaHora) > new Date());

                if (tourActual) {
                    const paqueteActual = tourActual.id_paquete;
                    const fechaHora = new Date(tourActual.fechaHora);
                    paqueteActual.fecha = fechaHora.toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                    });
                    paqueteActual.hora = fechaHora.toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    });
                    setActualPaquete(paqueteActual);

                    const serviciosData = await getServicios();
                    const serviciosFiltrados = serviciosData.filter((servicio) =>
                        paqueteActual.servicios.includes(servicio._id)
                    );
                    setServicios(serviciosFiltrados);
                }

                const paquetes = await getPaquetes();
                const otros = paquetes.filter(
                    (paquete) => !tourActual || paquete._id !== tourActual.id_paquete
                );
                setOtrosPaquetes(otros.slice(0, 4));
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
            <PaqueteActual paquete={actualPaquete} servicios={servicios} />
            <div className="paquete-list">
                <h2 className="paquete-list-title">Otros Paquetes</h2>
                <div className="paquete-items">
                    {otrosPaquetes.map((paquete) => {
                        const serviciosPaquete = servicios.filter((servicio) =>
                            paquete.servicios.includes(servicio._id)
                        );
                        return (
                            <PaqueteListItem
                                key={paquete._id}
                                paquete={paquete}
                                servicios={serviciosPaquete}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Paquetes;