//REACT
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
//MODALES
import Modal from '../../common/Modal';
import NewExpandedModal from '../../common/NewExpandedModal';
//FORM
import NewPaqueteForm from './NewPaqueteForm';
// CSS
import '../../../css/components/tables.css';
import '../../../css/components/admin/paquetes.css';
import '../../../css/components/admin/mediaPreviewEnhanced.css';
// CSS ICONOS
import { IoReloadOutline } from "react-icons/io5";
// API
import { getPaquetes, deletePaquete } from '../../../api/paquetes';
import { getServicios } from '../../../api/servicios';
// COMPONENTS
import Load from '../../common/Load';
import {showConfirm } from '../../../alerts/alerts'
import { toast } from 'sonner';


const Paquetes = () => {
    const [filterText, setFilterText] = useState('');
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('');
    const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    
    const [paquetes, setPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPaquetes = async () => {
        try {
        const paquetes = await getPaquetes();
        const servicios = await getServicios();

        setServicios(servicios)
        setPaquetes(paquetes);
        } catch (err) {
        setError(err.message);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaquetes();
    }, []);

    const handleCrearPaquete = () => {
        setSelectedPaquete(null);
        setModalMode('crear');
        setIsModalOpen(true);
    };

    const handlePaqueteClick = (row) => {
        setSelectedPaquete(row);
        setModalMode('editar');
        setIsModalOpen(true);
    };

    const handleVerDetalle = (row) => {
        setSelectedPaquete(row);
        setModalMode('detalle');
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        fetchPaquetes();
        setIsModalOpen(false);
    };

    // const filteredData = paquetes.filter(item =>
    //     Object.values(item).some(value =>
    //         String(value).toLowerCase().includes(filterText.toLowerCase())
    //     )
    // );

    const handleDeletePaquete = async (id) => {
        const result = await showConfirm('¿Estás seguro de que deseas eliminar este paquete?', 'Eliminar paquete');
      
        if (!result.isConfirmed) return;
      
        try {
          await deletePaquete(id);
      
          toast.success('¡Paquete eliminado exitosamente!');
      
          setPaquetes(prevPaquetes => prevPaquetes.filter(paquete => paquete._id !== id));
        } catch (error) {
          console.error('Error eliminando el paquete:', error.message);
          toast.error('Error al eliminar', 'Hubo un problema al intentar eliminar el paquete.');
        }
      };
      

    const paquetes_servicios = paquetes.map(paquete => ({
        ...paquete,
        servicios: paquete.servicios?.map(servicioId =>
          servicios.find(servicio => {
            if (servicio._id == servicioId) {
                return servicio
            }
          })
        ) || [],
        multimedia: paquete.multimedia || []
      }));
      
    const filteredData = paquetes_servicios.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

      
    const DetallePaqueteModal = ({ paquete }) => (
        <div className="detalle-paquete-modal">
            {console.log(paquete)},
            <h3>Detalles del Paquete</h3>
            <hr />
            <div className="info-general">
                <div><span className="label">Nombre:</span> {paquete.nombre}</div>
                <div><span className="label">Valor:</span> ${paquete.valor.toLocaleString()}</div>
                <div><span className="label">Destino:</span> {paquete.destino}</div>
                <div><span className="label">Lugar de Encuentro:</span> {paquete.lugar_encuentro}</div>
            </div>
            <h4>Descripción</h4>
            <p>{paquete.descripcion}</p>
            <h4>Servicios</h4>
            {paquete.servicios && paquete.servicios.length > 0 ? (
                <ul className="servicios-lista">
                    {paquete.servicios.map((servicio, idx) => (
                        <li key={idx}>{servicio.nombre}</li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted">Este paquete no tiene servicios asignados.</p>
            )}
        </div>
    );
    
    const MultimediaCell = ({ row }) => {
        const exampleUrls = [
            'https://wallpapers.com/images/hd/hd-nature-phone-river-h14wu1u3zdvst0ch.jpg',
            'https://i.4cdn.org/wsg/1743099510944782.mp4',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCXMCnkvAqM19cMA6Pm7my9LYKv9HK_RWAEg&s',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_hN3SXm5l8jxG-Mfu1nohwQLjPb8hfKbsQ&s',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4_hN3SXm5l8jxG-Mfu1nohwQLjPb8hfKbsQ&s',
        ];
        
        const mediaItems = (row.multimedia?.length > 0 ? row.multimedia : exampleUrls).slice(0, 3);
        
        return (
            <div 
                className="paquetes-multimedia-container"
                onClick={() => {
                    setIsMediaModalOpen(true);
                    setSelectedMedia(row.multimedia?.length > 0 ? row.multimedia : exampleUrls);
                }}
            >
                {mediaItems.map((item, index) => {
                    const isVideo = item.includes('.mp4') || item.includes('.webm');
                    const videoThumbnail = isVideo ? item.replace('.mp4', '.jpg').replace('.webm', '.jpg') : null;
                    
                    return (
                        <div 
                            key={index} 
                            className="paquetes-media-item"
                            style={{
                                zIndex: index,
                                transform: `translateX(${index * 15}px)`
                            }}
                        >
                            {isVideo ? (
                                <div className="video-thumbnail">
                                    <img
                                        src={videoThumbnail || 'https://i.imgur.com/KZpuufK.jpg'}
                                        alt={`Video ${index + 1}`} 
                                        className="paquetes-multimedia-image"
                                        onError={(e) => {
                                            e.target.src = 'https://i.imgur.com/KZpuufK.jpg';
                                        }}
                                    />
                                    <div className="video-play-icon">▶</div>
                                </div>
                            ) : (
                                <img 
                                    src={item}
                                    alt={`Imagen ${index + 1}`}
                                    className="paquetes-multimedia-image"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        );
    };

    const columns = [
        {
            name: 'id',
            selector: row => row._id,
            omit: true,
        },    
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => <div 
                style={{ fontWeight: 600, cursor: 'pointer' }} 
                onClick={() => handlePaqueteClick(row)}
            >
                {row.nombre}
            </div>,
            width: '200px'
        },
        {
            name: 'Valor',
            selector: row => row.valor,
            sortable: true,
            format: row => `$${row.valor.toLocaleString()}`,
            width: '150px'
        },
        {
            name: 'Lugar Encuentro',
            selector: row => row.lugar_encuentro,
            width: '220px'
        },
        {
            name: 'Destino',
            selector: row => row.destino,
            width: '190px'
        },
        {
            name: 'Multimedia',
            cell: row => <MultimediaCell row={row} />,
            width: '200px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <span
                        className="action-button detail-button material-symbols-outlined"
                        onClick={(e) => {
                        e.stopPropagation();
                        handleVerDetalle(row);
                        }}
                    >
                        info
                    </span>

                    <span
                        className="action-button edit-button material-symbols-outlined"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaquete(row);
                            setModalMode('editar'); // <-- ESTA LÍNEA ES CLAVE
                            setIsModalOpen(true);
                        }}
                    >
                        edit
                    </span>


                    <span className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePaquete(row._id);
                        }} class="material-symbols-outlined">delete
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            width: '150px'
        }
    ];

    if (error) return (
        <div className="error">
            <h3>Hubo un error al cargar los datos.</h3>
            <p>Problamente solo haga falta un poco de paciencia.</p>
            <button className='btn btn-primary' onClick={() => window.location.reload()}>
                <IoReloadOutline />
                Vuelve a intententarlo
            </button>
        </div>
    );

    return (
        <>
            {/* Table Header separado fuera del contenedor de la tabla */}
            <div className="table-header">
                <h2 className="table-title">Gestion de Paquetes</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar paquetes..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button
                        onClick={handleCrearPaquete}
                        className="table-button"
                    >
                        Registrar Paquete
                        <span class="material-symbols-outlined">add_circle</span>
                    </button>
                </div>
            </div>
    
            {/* Aquí solo la tabla dentro del contenedor */}
            <div className="table-container">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={10}
                    highlightOnHover
                progressPending={loading} // Muestra el indicador de carga mientras loading es true
                progressComponent={<Load />} // Componente de carga personalizado
                    customStyles={{
                        headCells: {
                            style: {
                                backgroundColor: '#fafafa',
                                fontWeight: '600',
                                fontSize: '14px'
                            },
                        },
                        cells: {
                            style: {
                                fontSize: '14px',
                                padding: '12px 8px',
                                verticalAlign: 'top'
                            },
                        },
                    }}
                    onRowClicked={handlePaqueteClick}
                />
            </div>
    
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {modalMode === 'detalle' && selectedPaquete && (
                    <DetallePaqueteModal paquete={selectedPaquete} />
                )}
                {modalMode === 'editar' && selectedPaquete && (
                    <><h2 className="modal-title">Editar Paquete</h2><NewPaqueteForm
                        onSubmit={handleSubmit}
                        initialData={selectedPaquete}
                        servicios={servicios} /></>
                )}
                {modalMode === 'crear' && (
                    <>
                    <h2 className="modal-title">Crear Nuevo Paquete</h2>
                    <NewPaqueteForm
                        onSubmit={handleSubmit}
                        servicios={servicios} />
                    </>
                )}
            </Modal>
    
            {/* Modal para galería de miniaturas */}
            <Modal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)}>
                <div className="media-gallery">
                    <h2 className="modal-title">Multimedia del Paquete</h2>
                    <div className="media-thumbnails">
                        {selectedMedia?.map((media, index) => (
                            <div
                                key={index}
                                className={`media-thumbnail ${currentMediaIndex === index ? 'active' : ''}`}
                                onClick={() => {
                                    setCurrentMediaIndex(index);
                                    setIsExpandedModalOpen(true);
                                }}
                            >
                                {media.includes('.mp4') || media.includes('.webm') ? (
                                    <video src={media} className="thumbnail-media" />
                                ) : (
                                    <img src={media} alt={`Media ${index}`} className="thumbnail-media" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>
    
            {/* Modal para visualización expandida */}
            <NewExpandedModal
                isOpen={isExpandedModalOpen}
                onClose={() => setIsModalOpen(false)}
                mediaUrl={selectedMedia?.[currentMediaIndex]}
                mediaType={
                    selectedMedia?.[currentMediaIndex]?.includes('.mp4') ||
                    selectedMedia?.[currentMediaIndex]?.includes('.webm')
                        ? 'video'
                        : 'image'
                }
            />
        </>
    );
 }

export default Paquetes;
