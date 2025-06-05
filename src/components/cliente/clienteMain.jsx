import React, { useState, useEffect } from 'react';
import { getPaquetes } from '../../api/paquetes';
import { getServicios } from '../../api/servicios';
import '../../css/components/cliente/cliente.css';

// Simulación de compras, reemplaza por tu API real si la tienes
const comprasEjemplo = [
    { id: 1, nombre: 'Paquete Montaña', fecha: '12/05/25', hora: '1:50 pm', lugar: 'Terminal del Norte', descripcion: 'Tour por la montaña.' },
    { id: 2, nombre: 'Paquete Río', fecha: '20/06/25', hora: '9:00 am', lugar: 'Parque Central', descripcion: 'Tour por el río.' }
];

const ClienteMain = () => {
    const [paquetes, setPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [selected, setSelected] = useState(null);
    const [mainView, setMainView] = useState('placeholder'); // 'placeholder', 'compras', 'paquetes', 'detalle'
    const [loading, setLoading] = useState(true);

    // Cargar paquetes y servicios al montar
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const paquetesRes = await getPaquetes();
                setPaquetes(paquetesRes.data || paquetesRes); // .data si usas axios, sino solo paquetesRes
                const serviciosRes = await getServicios();
                setServicios(serviciosRes.data || serviciosRes);
            } catch (err) {
                setPaquetes([]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Sidebar solo con los botones
    return (
        <div className="cliente-main-flex">
            <aside className="cliente-sidebar">
                <div className="sidebar-section">
                    <div
                        className="sidebar-title"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => {
                            setSelected(null);
                            setMainView('compras');
                        }}
                    >
                        <span>🧾</span>
                        Mis Compras
                    </div>
                </div>
                <div className="sidebar-section">
                    <div
                        className="sidebar-title"
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        onClick={() => {
                            setSelected(null);
                            setMainView('paquetes');
                        }}
                    >
                        <span>📦</span>
                        Paquetes Disponibles
                    </div>
                </div>
            </aside>

            <main className="cliente-main-content">
                {loading && <div className="placeholder"><h2>Cargando información...</h2></div>}

                {!loading && mainView === 'placeholder' && (
                    <div className="placeholder">
                        <h2>Selecciona "Mis Compras" o "Paquetes Disponibles" para ver la información</h2>
                    </div>
                )}

                {!loading && mainView === 'compras' && (
                    <>
                        <h2 className="detalle-title">Todas tus compras</h2>
                        {comprasEjemplo.length === 0 && <p>No tienes compras registradas.</p>}
                        {comprasEjemplo.map(item => (
                            <section
                                className="detalle-compra"
                                key={item.id}
                                style={{ marginBottom: '1.5rem', cursor: 'pointer' }}
                                onClick={() => {
                                    setSelected(item);
                                    setMainView('detalle-compra');
                                }}
                            >
                                <h3>{item.nombre}</h3>
                                <p><strong>Fecha:</strong> {item.fecha}</p>
                                <p><strong>Hora:</strong> {item.hora}</p>
                                <p><strong>Lugar:</strong> {item.lugar}</p>
                                <p><strong>Descripción:</strong> {item.descripcion}</p>
                            </section>
                        ))}
                    </>
                )}

                {!loading && mainView === 'paquetes' && (
                    <>
                        <h2 className="detalle-title">Paquetes Disponibles</h2>
                        {paquetes.length === 0 && <p>No hay paquetes disponibles.</p>}
                        <div className="paquete-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                            {paquetes.map(paquete => (
                                <section
                                    className="detalle-paquete"
                                    key={paquete._id}
                                    style={{ marginBottom: '1.5rem', cursor: 'pointer', minWidth: 320, maxWidth: 400 }}
                                    onClick={() => {
                                        setSelected(paquete);
                                        setMainView('detalle-paquete');
                                    }}
                                >
                                    <h3>{paquete.nombre}</h3>
                                    <p><strong>Descripción:</strong> {paquete.descripcion}</p>
                                    <p><strong>Valor:</strong> ${paquete.valor?.toLocaleString('es-CO')}</p>
                                    <p><strong>Destino:</strong> {paquete.destino}</p>
                                    <p><strong>Lugar de Encuentro:</strong> {paquete.lugar_encuentro}</p>
                                    {/* Muestra miniatura si hay multimedia */}
                                    {paquete.multimedia && paquete.multimedia.length > 0 && (
                                        <img
                                            src={paquete.multimedia[0]}
                                            alt={paquete.nombre}
                                            style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 8, marginTop: 8 }}
                                        />
                                    )}
                                </section>
                            ))}
                        </div>
                    </>
                )}

                {!loading && mainView === 'detalle-paquete' && selected && (
                    <>
                        <h2 className="detalle-title">Detalle del Paquete</h2>
                        <section className="detalle-paquete">
                            <h1>{selected.nombre}</h1>
                            <p><strong>Descripción:</strong> {selected.descripcion}</p>
                            <p><strong>Valor:</strong> ${selected.valor?.toLocaleString('es-CO')}</p>
                            <p><strong>Destino:</strong> {selected.destino}</p>
                            <p><strong>Lugar de Encuentro:</strong> {selected.lugar_encuentro}</p>
                            {/* Galería de imágenes */}
                            {selected.multimedia && selected.multimedia.length > 0 && (
                                <div style={{ display: 'flex', gap: 12, margin: '1rem 0' }}>
                                    {selected.multimedia.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`media-${idx}`}
                                            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                        />
                                    ))}
                                </div>
                            )}
                            {/* Servicios incluidos */}
                            {selected.servicios && selected.servicios.length > 0 && (
                                <>
                                    <h4>Servicios incluidos:</h4>
                                    <ul>
                                        {selected.servicios.map((servId, idx) => {
                                            const serv = servicios.find(s => s._id === servId || s._id === servId._id);
                                            return <li key={idx}>{serv ? serv.nombre : servId.nombre || servId}</li>;
                                        })}
                                    </ul>
                                </>
                            )}
                            <button className="btn btn-secondary" onClick={() => setMainView('paquetes')}>
                                Volver a la lista
                            </button>
                        </section>
                    </>
                )}

                {!loading && mainView === 'detalle-compra' && selected && (
                    <>
                        <h2 className="detalle-title">Detalle de la Compra</h2>
                        <section className="detalle-compra">
                            <h1>{selected.nombre}</h1>
                            <p><strong>Fecha:</strong> {selected.fecha}</p>
                            <p><strong>Hora:</strong> {selected.hora}</p>
                            <p><strong>Lugar:</strong> {selected.lugar}</p>
                            <p><strong>Descripción:</strong> {selected.descripcion}</p>
                            <button className="btn btn-secondary" onClick={() => setMainView('compras')}>
                                Volver a la lista
                            </button>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default ClienteMain;
