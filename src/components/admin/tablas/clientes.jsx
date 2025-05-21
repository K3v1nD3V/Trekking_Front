import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';
import ClienteForm from "./ClienteForm.jsx";

import { getClientes, deleteCliente, updateCliente } from '../../../api/clientes';

import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await getClientes();
                setClientes(data);
            } catch (err) {
                setError(err.message || 'Error al cargar clientes');
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);

    const handleCrearCliente = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    // const handleClienteClick = (row) => {
    //     setSelectedCliente(row);
    //     setIsModalOpen(true);
    // };

    const handleDeleteCliente = async (id, nombreCompleto) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`)) return;

        try {
            await deleteCliente(id);
            alert('¡Cliente eliminado exitosamente!');
            setClientes(prev => prev.filter(cliente => cliente._id !== id));
        } catch (err) {
            console.error('Error eliminando cliente:', err.message);
            alert('Error al eliminar el cliente.');
        }
    };

    const handleSubmit = () => {
        window.location.reload();
        setIsModalOpen(false);
    };

    const toggleEstado = async (row) => {
        const updatedCliente = { ...row, estado: !row.estado };
        try {
            await updateCliente(row._id, updatedCliente);
            setClientes(prev =>
                prev.map(cliente =>
                    cliente._id === row._id ? updatedCliente : cliente
                )
            );
        } catch (error) {
            console.error('Error actualizando estado:', error.message);
            alert('Error al cambiar el estado del cliente.');
        }
    };

    const EstadoCell = ({ row }) => (
        <div className="estado-switch">
            <label className="switch">
                <input
                    type="checkbox"
                    checked={row.estado}
                    onChange={() => toggleEstado(row)}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );

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
            format: row => 
            row.documento.toLocaleString(),
            right: true,
            width: '150px',
            cell: row => <div style={{ fontWeight: 600 }}>{row.documento}</div>
        },
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => row.nombre,
            width: '150px' 
        },
        {
            name: 'Apellido',
            selector: row => row.apellido,
            wrap: true,
            width: '150px'
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            wrap: true,
            width: '150px' 
        },
        {
            name: 'Teléfono',
            selector: row => row.telefono,
            format: row => row.telefono.toLocaleString(),
            right: true,
            width: '150px' 
        },
        {
            name: 'Observación Médica',
            selector: row => row.observacion_medica,
            wrap: true,
            width: '200px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,
            width: '150px' 
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <button
                        className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
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
                            handleDeleteCliente(row._id, `${row.nombre} ${row.apellido}`);
                        }}
                    >
                        Eliminar
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            width: '200px' 
        }
    ];

    if (loading) return <div className="loading">Cargando clientes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

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
                            padding: '16px 12px', // Aumenté el padding de las celdas
                            verticalAlign: 'top'
                        },
                    },
                }}
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
