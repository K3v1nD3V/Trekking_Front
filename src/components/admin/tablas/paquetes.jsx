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
// API
import { getPaquetes, deletePaquete } from '../../../api/paquetes';
import { getServicios } from '../../../api/servicios';

const Paquetes = () => {
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isExpandedModalOpen, setIsExpandedModalOpen] = useState(false);

    const [paquetes, setPaquetes] = useState([]);
    const [servicios, setServicios] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
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
    
        fetchPaquetes();
      }, []);

    const handleCrearPaquete = () => {
        setSelectedPaquete(null);
        setIsModalOpen(true);
    };

    const handlePaqueteClick = (row) => {
        setSelectedPaquete(row);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        formData
    };

    const handleDeletePaquete = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este paquete?')) return;

        try {
            await deletePaquete(id);
            alert('¡Paquete eliminado exitosamente!');

            setPaquetes(prevPaquetes => prevPaquetes.filter(paquete => paquete._id !== id));
        } catch (error) {
            console.error('Error eliminando el paquete:', error.message);
            alert('Hubo un error al eliminar el paquete.');
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

    const ServiciosCell = ({ row }) => (
        <div className="paquetes-servicios-container">
          {row.servicios?.map(servicio => (
            <span key={servicio.id} className="paquetes-servicio-badge">
              {servicio.nombre}
            </span>
          ))}
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
            width: '150px'
        },
        {
            name: 'Valor',
            selector: row => row.valor,
            sortable: true,
            format: row => `$${row.valor.toLocaleString()}`,
            right: true,
            width: '100px'
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Lugar Encuentro',
            selector: row => row.lugar_encuentro,
            width: '150px'
        },
        {
            name: 'Destino',
            selector: row => row.destino,
            width: '150px'
        },
        {
            name: 'Multimedia',
            cell: row => <MultimediaCell row={row} />,
            width: '120px'
        },
        {
            name: 'Servicios',
            cell: row => <ServiciosCell row={row} />,
            ignoreRowClick: true,
            width: '300px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <button 
                        className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPaquete(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Editar
                    </button>
                    <button 
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePaquete(row._id);
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '150px'
        }
    ];

    if (loading) return <div className="loading">Cargando paquetes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Paquetes Turísticos</h2>
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
                        Crear Paquete
                    </button>
                </div>
            </div>

            <DataTable
                columns={columns}
                data={filteredData}
                pagination
                paginationPerPage={10}
                highlightOnHover
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedPaquete ? 'Editar Paquete' : 'Crear Nuevo Paquete'}
                </h2>
                <NewPaqueteForm
                    onSubmit={handleSubmit} 
                    initialData={selectedPaquete || {}}
                    servicios={servicios}
                />
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
                onClose={() => setIsExpandedModalOpen(false)}
                mediaUrl={selectedMedia?.[currentMediaIndex]}
                mediaType={
                    selectedMedia?.[currentMediaIndex]?.includes('.mp4') || 
                    selectedMedia?.[currentMediaIndex]?.includes('.webm') 
                    ? 'video' : 'image'
                }
            />
        </div>
    );
};

export default Paquetes;
