import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import ServicioForm from './serviciosForm';
import '../../../css/components/tables.css';
import '../../../css/components/admin/servicios.css';

const ServiciosTable = ({ data }) => {
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);

    const handleCrearServicio = () => {
        setSelectedServicio(null);
        setIsModalOpen(true);
    };

    const handleServicioClick = (row) => {
        setSelectedServicio(row);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log('Datos del formulario:', formData);
        setIsModalOpen(false);
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const EstadoCell = ({ row }) => (
        <div className="estado-switch">
            <label className="switch">
                <input 
                    type="checkbox" 
                    checked={row.estado}
                    onChange={(e) => {
                        console.log('Estado cambiado:', row.id, e.target.checked);
                    }}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => <div 
                style={{ fontWeight: 600, cursor: 'pointer' }} 
                onClick={() => handleServicioClick(row)}
            >
                {row.nombre}
            </div>,
            width: '200px'
        },
        {
            name: 'Descripción',
            selector: row => row.descripcion,
            wrap: true,
            width: '300px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,
            width: '100px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <button 
                        className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editar servicio:', row.id);
                            setSelectedServicio(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Editar
                    </button>
                    <button 
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Eliminar servicio:', row.id);
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
                <h2 className="table-title">Servicios</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar servicios..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button
                        onClick={handleCrearServicio}
                        className="table-button"
                    >
                        Crear Servicio
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
                onRowClicked={handleServicioClick}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedServicio ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
                </h2>
                <ServicioForm 
                    onSubmit={handleSubmit} 
                    initialData={selectedServicio || {}} 
                />
            </Modal>
        </div>
    );
};

export default ServiciosTable;
