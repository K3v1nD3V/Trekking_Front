import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
// MODAL
import Modal from '../../common/Modal';
// FORMULARIO
import ServicioForm from './serviciosForm';
// CSS
import '../../../css/components/tables.css';
import '../../../css/components/admin/servicios.css';
// ICONOS
import { IoReloadOutline } from "react-icons/io5";
// COMPONENTS
import Load from '../../common/Load';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';
// API
import { deleteServicio, updateServicio, getServicios } from '../../../api/servicios';

const ServiciosTable = () => {
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedServicio, setSelectedServicio] = useState(null);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchServicios = async () => {
        try {
            const data = await getServicios();
            setServicios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServicios();
    }, []);

    const handleCrearServicio = () => {
        setSelectedServicio(null);
        setIsModalOpen(true);
    };

    const handleDeleteServicio = async (id) => {
        const result = await showConfirm('¿Estás seguro de que deseas eliminar este servicio?', 'Confirmar eliminación');
        if (!result.isConfirmed) return;

        try {
            await deleteServicio(id);
            toast.success('¡Servicio eliminado exitosamente!');
            setServicios((prev) => prev.filter((servicio) => servicio._id !== id));
        } catch (error) {
            console.error('Error eliminando el servicio:', error.message);
            toast.error('Error', 'Hubo un error al eliminar el servicio.');
        }
    };

    const handleServicioClick = (row) => {
        setSelectedServicio(row);
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        fetchServicios();
        setIsModalOpen(false);
        toast.success(selectedServicio ? '¡Servicio actualizado exitosamente!' : '¡Servicio creado exitosamente!');
    };

    const filteredData = servicios.filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const EstadoCell = ({ row }) => {
        const toggleEstado = async () => {
            const mensaje = row.estado
                ? '¿Estás seguro de que deseas desactivar este servicio?'
                : '¿Estás seguro de que deseas activar este servicio?';
    
            const result = await showConfirm(mensaje, 'Confirmar cambio de estado');
            if (!result.isConfirmed) return;
    
            try {
                const updatedServicio = { ...row, estado: !row.estado };
                await updateServicio(row._id, updatedServicio);
                setServicios((prevServicios) =>
                    prevServicios.map((servicio) =>
                        servicio._id === row._id ? updatedServicio : servicio
                    )
                );
                toast.success('Estado actualizado correctamente');
            } catch (error) {
                console.error('Error actualizando estado:', error.message);
                toast.error('Hubo un error al cambiar el estado.');
            }
        };
    
        return (
            <div className="estado-switch">
                <label className="switch">
                    <input
                        type="checkbox"
                        checked={row.estado}
                        onChange={toggleEstado}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
        );
    };
    

    const columns = [
        {
            name: 'id',
            selector: (row) => row._id,
            omit: true,
        },
        {
            name: 'Icono',
            cell: (row) => <span className="material-symbols-outlined">{row.icono}</span>,
            width: '150px',
        },
        {
            name: 'Nombre',
            selector: (row) => row.nombre,
            sortable: true,
            cell: (row) => (
                <div
                    style={{ fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => handleServicioClick(row)}
                >
                    {row.nombre}
                </div>
            ),
            width: '200px',
        },
        {
            name: 'Descripción',
            selector: (row) => row.descripcion,
            wrap: true,
            width: '400px',
        },
        {
            name: 'Estado',
            cell: (row) => <EstadoCell row={row} />,
            width: '220px',
        },
        {
            name: 'Acciones',
            cell: (row) => (
                <div className="action-buttons">
                   
                    <span className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedServicio(row);
                            setIsModalOpen(true);
                        }} class="material-symbols-outlined">edit
                    </span>


                    <span className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteServicio(row._id);
                        }} class="material-symbols-outlined">delete
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            width: '150px',
        },
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
            <div className="table-header">
                <h2 className="table-title">Gestión de Servicios</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar Servicios..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button onClick={handleCrearServicio} className="table-button">
                        Registrar Servicio
                        <span class="material-symbols-outlined">add_circle</span>
                    </button>
                </div>
            </div>

            <div className="table-container">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    paginationPerPage={10}
                    highlightOnHover
                    progressPending={loading} // Muestra el indicador de carga mientras loading es true
                progressComponent={<Load />}
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
                                padding: '12px 8px',
                                verticalAlign: 'top',
                            },
                        },
                    }}
                />
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedServicio ? 'Actualizar Servicio' : 'Registrar Servicio'}
                </h2>
                <ServicioForm
                    onSubmit={handleSubmit}
                    onClose={() => setIsModalOpen(false)}
                    initialData={selectedServicio || {}}
                />
            </Modal>
        </>
    );
};

export default ServiciosTable;
