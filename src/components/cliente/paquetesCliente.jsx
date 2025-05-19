import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPaquetes } from '../../api/paquetes';
import '../../css/components/admin/paquetes.css';

const PaquetesCliente = () => {
    const [paquetes, setPaquetes] = useState([]);

    useEffect(() => {
        const fetchPaquetes = async () => {
            try {
                const data = await getPaquetes();
                setPaquetes(data);
            } catch (error) {
                console.error('Error al cargar los paquetes:', error);
            }
        };

        fetchPaquetes();
    }, []);

    return (
        <section className="paquetes-grid">
            {paquetes.map((paquete) => (
                <div key={paquete._id} className="paquete-item">
                    <img
                        src={paquete.multimedia[0] || 'https://via.placeholder.com/300x200'}
                        alt={paquete.nombre}
                    />
                    <div className="paquete-item-info">
                        <h3>{paquete.nombre}</h3>
                        <p>{paquete.destino}</p>
                        <p>${paquete.valor.toLocaleString('es-ES')}</p>
                        <Link to={`/cliente/paquetes/${paquete._id}`} className="btn btn-primary">
                            Ver más
                        </Link>
                    </div>
                </div>
            ))}
        </section>
    );
};

export default PaquetesCliente;