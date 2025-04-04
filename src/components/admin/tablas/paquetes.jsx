import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import PaqueteForm from './PaqueteForm';
import '../../../css/components/tables.css';
import '../../../css/components/admin/paquetes.css';

const Paquetes = ({ data }) => {
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPaquete, setSelectedPaquete] = useState(null);
    const [serviciosDisponibles] = useState([
        { id: 1, nombre: 'Alimentación' },
        { id: 2, nombre: 'Transporte' },
        { id: 3, nombre: 'Guía turístico' },
        { id: 4, nombre: 'Seguro médico' },
        { id: 5, nombre: 'Alojamiento' },
        { id: 6, nombre: 'Equipamiento' },
        { id: 7, nombre: 'Fotografía' },
        { id: 8, nombre: 'Traducción' },
        { id: 9, nombre: 'WiFi' },
        { id: 10, nombre: 'Traslados' }
    ]);

    const handleCrearPaquete = () => {
        setSelectedPaquete(null);
        setIsModalOpen(true);
    };

    const handlePaqueteClick = (row) => {
        setSelectedPaquete(row);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log('Datos del formulario:', formData);
        setIsModalOpen(false);
    };

    const paquetes = data.map(paquete => ({
        ...paquete,
        servicios: serviciosDisponibles.map(servicio => ({
            ...servicio,
            incluido: paquete.servicios?.some(s => s.id === servicio.id) || false
        })),
        multimedia: paquete.multimedia || []
    }));

    const filteredData = paquetes.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const handleServicioChange = (paqueteIndex, servicioId, isChecked) => {
        console.log(`Paquete ${paqueteIndex}, Servicio ${servicioId}: ${isChecked}`);
    };

    const ServiciosCell = ({ row }) => (
        <div className="paquetes-servicios-container">
            <div className="paquetes-servicios-grid">
                {row.servicios.map(servicio => (
                    <div 
                        key={servicio.id} 
                        className={`paquetes-servicio-item ${servicio.incluido ? 'paquetes-servicio-incluido' : 'paquetes-servicio-no-incluido'}`}
                        onClick={() => handleServicioChange(row.id, servicio.id, !servicio.incluido)}
                    >
                        <input
                            type="checkbox"
                            checked={servicio.incluido}
                            onChange={(e) => {
                                e.stopPropagation();
                                handleServicioChange(row.id, servicio.id, e.target.checked);
                            }}
                            className="paquetes-servicio-checkbox"
                        />
                        <span className="paquetes-servicio-nombre">
                            {servicio.nombre}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );

    const MultimediaCell = ({ row }) => (
        <div className="paquetes-multimedia-container">
            {row.multimedia.map((url, index) => (
                <div key={index} className="paquetes-multimedia-item">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {`Imagen ${index + 1}`}
                    </a>
                </div>
            ))}
        </div>
    );

    const columns = [
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
                            console.log('Editar paquete:', row.id);
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
                            console.log('Eliminar paquete:', row.id);
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
                <PaqueteForm 
                    onSubmit={handleSubmit} 
                    initialData={selectedPaquete || {}} 
                />
            </Modal>
        </div>
    );
};

export default Paquetes;
