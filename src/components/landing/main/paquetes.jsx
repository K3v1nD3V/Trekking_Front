import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getTours } from '../../../api/tours';
import { getPaquetes } from '../../../api/paquetes';
import { getServicios } from '../../../api/servicios';

import PaqueteActual from './paqueteActual';
import PaqueteListItem from './paqueteListItem';
import PaqueteListItemSkeleton from './paqueteListItemSkeleton';
import PaqueteActualSkeleton from './PaqueteActualSkeleton';

import '../../../css/components/landing/paquetes.css';

const Paquetes = () => {
    const [actualPaquete, setActualPaquete] = useState(null);
    const [otrosPaquetes, setOtrosPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tours = await getTours();
                console.log('tours', tours);
                const tourActual = tours.find((tour) => new Date(tour.fechaHora) > new Date());
                console.log('tourActual', tourActual);
                
                if (tourActual) {
                    const paqueteActual = tourActual.id_paquete;
                    console.log('paqueteActual', paqueteActual);
                    
                    const fechaHora = new Date(tourActual.fechaHora);
                    console.log('fechaHora', fechaHora);
                    
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
                console.log('paquetes', paquetes);
                
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
        return (
            <section className="paquetes">
                <PaqueteActualSkeleton />
                <h2 className="paquete-list-title">
                    {t('packages.otherPackages')}
                </h2>
                <div className="paquete-list">
                    <div className="paquete-items">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <PaqueteListItemSkeleton key={index} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (!actualPaquete) {
        // If no actual package is found, show a message or a placeholder
        // I prefere to show a button to contact us
        return (
            <div className="no-paquete">
                <h2>
                    {t('packages.noPackages')}
                </h2>
                <a href="https://wa.me/573238893608/?texto=Mas%Info%sobre%nueva%Coleccion%porfavor" className="btn btn-primary">
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
        );
        // return <div className="no-paquete">No hay paquetes disponibles en este momento.</div>;
    }

    return (
        <section className="paquetes">
            <PaqueteActual paquete={actualPaquete} servicios={servicios} />
            <div className="paquete-list">
                <h2 className="paquete-list-title">
                    {t('packages.otherPackages')}
                </h2>
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