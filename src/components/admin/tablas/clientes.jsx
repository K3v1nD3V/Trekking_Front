import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';
import ClienteForm from "./ClienteForm.jsx";
import { getClientes, deleteCliente, updateCliente } from '../../../api/clientes';
import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';
import { IoReloadOutline } from "react-icons/io5";
import Load from '../../common/Load';

const Clientes = () => {
    const [clientes, setClientes] = useState([]);
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCliente, setSelectedCliente] = useState(null);
    const [detalleCliente, setDetalleCliente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClientes = async () => {
        try {
            const data = await getClientes();
            setClientes(data);
            console.log("Clientes cargados:", data);
        } catch (err) {
            setError(err.message || 'Error al cargar clientes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    const handleCrearCliente = () => {
        setSelectedCliente(null);
        setIsModalOpen(true);
    };

    const handleDeleteCliente = async (id, nombreCompleto) => {
        const result = await showConfirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`, 'Confirmar eliminación');
        if (!result.isConfirmed) return;

        try {
            await deleteCliente(id);
            setClientes(prev => prev.filter(cliente => cliente._id !== id));
            toast.success('¡Cliente eliminado exitosamente!');
        } catch (err) {
            console.error('Error eliminando cliente:', err.message);
            toast.error('No se pudo eliminar el cliente.');
        }
    };

    const handleSubmit = (nuevoCliente, type) => {
        console.log('Datos del cliente a guardar:', nuevoCliente, type);
        // console.log(clientes);
        fetchClientes();
        // if (type == "edit") {
        //     console.log("Nuevo cliente con ID:", nuevoCliente.cliente._id);
            
        //     setClientes(prev =>
        //         prev.map(cliente =>
        //             cliente._id === nuevoCliente.cliente._id ? nuevoCliente.cliente : cliente
        //         )
        //     );
        // } else if (type == "create") {
        //     // Nuevo
        //     setClientes(prev => [...prev, nuevoCliente.cliente]);
        // }

        setIsModalOpen(false);
        toast.success(`Cliente ${type == "edit" ? 'actualizado' : 'registrado'} correctamente`);
    };


    const toggleEstado = async (row) => {
        const nuevoEstado = !row.estado;
        const nombre = row?.id_usuario?.nombre || 'Nombre';
        const apellido = row?.id_usuario?.apellido || 'Apellido';

        const mensaje = `¿Estás seguro de ${nuevoEstado ? 'activar' : 'desactivar'} al cliente ${nombre} ${apellido}?`;
        const result = await showConfirm(mensaje, 'Confirmar cambio de estado');
        if (!result.isConfirmed) return;

        const updatedCliente = { ...row, estado: nuevoEstado };

        try {
            await updateCliente(row._id, updatedCliente);
            setClientes(prev =>
                prev.map(cliente =>
                    cliente._id === row._id ? updatedCliente : cliente
                )
            );
            toast.success(`Cliente ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error actualizando estado:', error.message);
            toast.error('No se pudo cambiar el estado del cliente.');
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
            format: row => row.documento.toLocaleString(),
            cell: row => <div style={{ fontWeight: 600 }}>{row.documento}</div>,
            width: '200px',
        },
        {
            name: 'Nombre',
            selector: row => row?.id_usuario?.nombre || 'Sin nombre',
            sortable: true,
            width: '150px'
        },
        {
            name: 'Apellido',
            selector: row => row?.id_usuario?.apellido || 'Sin apellido',
            wrap: true,
            width: '150px'
        },
        {
            name: 'Correo',
            selector: row => row?.id_usuario?.correo || 'Sin correo',
            wrap: true,
            width: '270px'
        },
        {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,
            width: '170px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <span
                        className="action-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetalleCliente(row);
                        }}
                    >
                        <span className="material-symbols-outlined">info</span>
                    </span>

                    <span
                        className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCliente(row);
                            setIsModalOpen(true);
                        }}
                    >
                        <span className="material-symbols-outlined">edit</span>
                    </span>

                    <span
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            const nombre = row?.id_usuario?.nombre || '';
                            const apellido = row?.id_usuario?.apellido || '';
                            handleDeleteCliente(row._id, `${nombre} ${apellido}`);
                        }}
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            width: '200px'
        }
    ];

    if (error) return (
        <div className="error">
            <h3>Hubo un error al cargar los datos.</h3>
            <p>Probablemente solo haga falta un poco de paciencia.</p>
            <button className='btn btn-primary' onClick={() => window.location.reload()}>
                <IoReloadOutline />
                Vuelve a intentarlo
            </button>
        </div>
    );

    return (
        <>
            <div className="table-header">
                <h2 className="table-title">Gestión de Clientes</h2>
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
                        <span className="material-symbols-outlined">add_circle</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={10}
                    progressPending={loading}
                    progressComponent={<Load />}
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

                {/* Modal para Crear/Editar Cliente */}
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

                {/* Modal de Detalle */}
                <Modal isOpen={!!detalleCliente} onClose={() => setDetalleCliente(null)}>
                    <div className="detalle-cliente-modal">
                        <h3>Detalle del Cliente</h3>
                        <hr />
                        {detalleCliente && (
                            <div className="info-general-cliente">
                                <p><span className="label-cliente">Documento:</span> {detalleCliente.documento}</p>
                                <p><span className="label-cliente">Nombre:</span> {detalleCliente.id_usuario?.nombre}</p>
                                <p><span className="label-cliente">Apellido:</span> {detalleCliente.id_usuario?.apellido}</p>
                                <p><span className="label-cliente">Correo:</span> {detalleCliente.id_usuario?.correo}</p>
                                <p><span className="label-cliente">Teléfono:</span> {detalleCliente.telefono}</p>

                                {detalleCliente.observacion_medica && (
                                    <p><span className="label-cliente">Observación Médica:</span> {detalleCliente.observacion_medica}</p>
                                )}

                                <p><span className="label-cliente">Estado:</span>
                                    <span className={`estado ${detalleCliente.estado ? 'activo' : 'inactivo'}`}>
                                        {detalleCliente.estado ? 'Activo' : 'Inactivo'}
                                    </span>
                                </p>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default Clientes;
