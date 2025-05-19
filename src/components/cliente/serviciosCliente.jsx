import React, { useEffect, useState } from 'react';
import { getServicios } from '../../api/servicios';
import '../../css/components/admin/paquetes.css';

const ServiciosCliente = () => {
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const data = await getServicios();
                setServicios(data);
            } catch (error) {
                console.error('Error al cargar los servicios:', error);
            }
        };

        fetchServicios();
    }, []);

    return (
        <section className="servicios-list">
            {servicios.map((servicio) => (
                <div key={servicio._id} className="servicio-item">
                    <h3>{servicio.nombre}</h3>
                    <p>{servicio.descripcion}</p>
                </div>
            ))}
        </section>
    );
};

export default ServiciosCliente;