import React, { useState } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import RolForm from './rolesForm';
import '../../../css/components/tables.css';
import '../../../css/components/admin/roles.css'; 

const RolesTable = ({ data }) => {
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRol, setSelectedRol] = useState(null);

    const handleCrearRol = () => {
        setSelectedRol(null);
        setIsModalOpen(true);
    };

    const handleRolClick = (row) => {
        setSelectedRol(row);
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
            name: 'Nombre del Rol',
            selector: row => row.nombreRol,
            sortable: true,
            cell: row => (
                <div 
                    style={{ fontWeight: 600, cursor: 'pointer' }} 
                    onClick={() => handleRolClick(row)}
                >
                    {row.nombreRol}
                </div>
            ),
            width: '250px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,
            width: '100px'
        },
        {
            name: 'Permisos',
            selector: row => row.permisos,
            cell: row => (
                <div>
                    {row.permisos && row.permisos.length > 0
                        ? row.permisos.join(', ')
                        : 'Sin permisos'}
                </div>
            ),
            width: '300px'
        },
        {
            name: 'Privilegios',
            selector: row => row.privilegios,
            cell: row => (
                <div>
                    {row.privilegios && row.privilegios.length > 0
                        ? row.privilegios.map(id => {
                            switch(id) {
                                case 1: return 'Crear';
                                case 2: return 'Editar';
                                case 3: return 'Eliminar';
                                default: return 'Otro';
                            }
                        }).join(', ')
                        : 'Sin privilegios'}
                </div>
            ),
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
                            console.log('Editar rol:', row.id);
                            setSelectedRol(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Editar
                    </button>
                    <button 
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Eliminar rol:', row.id);
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
                <h2 className="table-title">Roles</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar roles..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button
                        onClick={handleCrearRol}
                        className="table-button"
                    >
                        Crear Rol
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
                onRowClicked={handleRolClick}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedRol ? 'Editar Rol' : 'Crear Nuevo Rol'}
                </h2>
                <RolForm 
                    onSubmit={handleSubmit} 
                    initialData={selectedRol || {}} 
                />
            </Modal>
        </div>
    );
};

export default RolesTable;
