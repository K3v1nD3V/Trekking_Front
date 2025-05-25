import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';
import ClienteForm from "./ClienteForm.jsx";

import { getClientes, deleteCliente, updateCliente } from '../../../api/clientes';

import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';

// Importa las alertas
import { showConfirm, showSuccess, showError } from '../../../alerts/alerts'; // Ajusta la ruta si es necesario

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
        // Usar la alerta de confirmación
        const result = await showConfirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`, 'Confirmar eliminación');
        
        if (!result.isConfirmed) return;

        try {
            await deleteCliente(id);
            setClientes(prev => prev.filter(cliente => cliente._id !== id));
            showSuccess('¡Cliente eliminado exitosamente!');
        } catch (err) {
            console.error('Error eliminando cliente:', err.message);
            showError('Error', 'No se pudo eliminar el cliente.');
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
            showSuccess('Estado actualizado correctamente');
        } catch (error) {
            console.error('Error actualizando estado:', error.message);
            showError('Error', 'No se pudo cambiar el estado del cliente.');
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
            cell: row => <div style={{ fontWeight: 600 }}>{row.documento}</div>,
            width: '150px',
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
    
                    <span className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCliente(row);
                            setIsModalOpen(true);
                        }} class="material-symbols-outlined">edit
                    </span>

                    <span className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCliente(row._id, `${row.nombre} ${row.apellido}`);
                        }} class="material-symbols-outlined">delete
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            width: '200px' 
        }
    ];

    if (loading) return <div className="loading">Cargando clientes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <>
          {/* Table Header separado */}
          <div className="table-header">
            <h2 className="table-title">Gestion de Clientes</h2>
            <div className="table-controls">
              <input
                type="text"
                placeholder="Buscar Clientes..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="table-search"
              />
              <button onClick={handleCrearCliente} className="table-button">
                Registrar Cliente
                <span class="material-symbols-outlined">add_circle</span>
              </button>
            </div>
          </div>
      
          {/* Contenedor sólo para tabla y modal */}
          <div className="table-container">
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
                    fontSize: '14px',
                  },
                },
                cells: {
                  style: {
                    fontSize: '14px',
                    padding: '16px 12px', 
                    verticalAlign: 'top',
                  },
                },
              }}
            />
      
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="modal-title">
                {selectedCliente ? 'Actualizar Cliente' : 'Registrar Cliente'}
              </h2>
              <ClienteForm
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedCliente || {}}
              />
            </Modal>
          </div>
        </>
      );      
};

export default Clientes;
