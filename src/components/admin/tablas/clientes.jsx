import React, { useState } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';

import ClienteForm from "./ClienteForm.jsx";
import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';


const Clientes = ({ data }) => {
    const [clientes, setClientes] = useState(data);
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
   

    const handleCrearCliente = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    const handleClienteClick = (row) => {
        setSelectedCliente(row);
        setIsModalOpen(true);
    };

    const handleSubmit = (formData) => {
        console.log('Datos del formulario:', formData);
        setIsModalOpen(false);
    };


    const filteredData = clientes.filter(item =>
        Object.values(item).some(value => 
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const columns = [
        
        {
            name: 'Documento',
            selector: row => row.documento,
            sortable: true,
            format: row => row.documento.toLocaleString(),
            right: true,
            width: '100px'
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => 
                <div
                    style={{ fontWeight: 600, cursor: 'pointer'}}
                    onClick={() => handleClienteClick(row)}
            >
                {row.nombre}
            </div>,
            width: '150px' 
        },
        {
            name: 'Apellido',
            selector: row => row.apellido,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
            sortable: true,
            format: row => row.telefono.toLocaleString(),
            right: true,
            width: '100px'
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <button 
                        className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Editar Cliente:', row.id);
                            setSelectedCliente(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Editar
                    </button>
                    <button 
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            if(window.confirm(`¿Estás seguro que deseas eliminar a ${row.nombre} ${row.apellido}?`)){
                                setClientes(prevClientes => 
                                    prevClientes.filter(cliente => cliente.id !== row.id)
                                );
                                console.log(`Cliente ${row.id} eliminado`);
                            }
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
                <h2 className="table-title">Clientes</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar Clientes..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button
                        onClick={handleCrearCliente}
                        className="table-button"
                    >
                        Crear Cliente
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
                onRowClicked={handleClienteClick}
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedCliente ? 'Editar Cliente' : 'Crear Cliente'}
                </h2>
                <ClienteForm 
                    onSubmit={handleSubmit}
                    initialData={selectedCliente || {}}
                />
           </Modal> 
        </div>
    );
};

export default Clientes;

