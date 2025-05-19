import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPaqueteById } from '../../api/paquetes';
import '../../css/components/admin/paquetes.css';

const PaqueteDetalles = () => {
    const { id } = useParams();
    const [paquete, setPaquete] = useState(null);

    useEffect(() => {
        const fetchPaquete = async () => {
            try {
                const data = await getPaqueteById(id);
                setPaquete(data);
            } catch (error) {
                console.error('Error al cargar el paquete:', error);
            }
        };

        fetchPaquete();
    }, [id]);

    if (!paquete) {
        return <div>Cargando...</div>;
    }

    return (
        <section className="paquete-detalles">
            <div className="paquete-detalles-carrusel">
                {paquete.multimedia.map((media, index) => (
                    <img key={index} src={media} alt={`Media ${index}`} />
                ))}
            </div>
            <div className="paquete-detalles-info">
                <h2>{paquete.nombre}</h2>
                <p>{paquete.descripcion}</p>
                <p><strong>Destino:</strong> {paquete.destino}</p>
                <p><strong>Lugar de Encuentro:</strong> {paquete.lugar_encuentro}</p>
                <p><strong>Precio:</strong> ${paquete.valor.toLocaleString('es-ES')}</p>
            </div>
        </section>
    );
};

export default PaqueteDetalles;