import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';
import UsuarioForm from "./UsuarioForm.jsx";
import { getUsuarios, deleteUsuario } from '../../../api/usuarios';
import { getRoles } from '../../../api/roles'; // Asumiendo que tienes esta función

import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';
// COMPONENTS
import Load from '../../common/Load';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);  // Estado para almacenar roles
    const [filterText, setFilterText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsuariosAndRoles = async () => {
            try {
                const [usuariosData, rolesData] = await Promise.all([getUsuarios(), getRoles()]);
                setUsuarios(usuariosData);
                setRoles(rolesData);
            } catch (err) {
                setError(err.message || 'Error al cargar usuarios y roles');
            } finally {
                setLoading(false);
            }
        };

        fetchUsuariosAndRoles();
    }, []);

    const handleCrearUsuario = () => {
        setSelectedUsuario(null);
        setIsModalOpen(true);
    };

    // const handleUsuarioClick = (row) => {
    //     setSelectedUsuario(row);
    //     setIsModalOpen(true);
    // };

    const handleDeleteUsuario = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar a ${nombre}?`)) return;

        try {
            await deleteUsuario(id);
            alert('¡Usuario eliminado exitosamente!');
            setUsuarios(prev => prev.filter(usuario => usuario._id !== id));
        } catch (err) {
            console.error('Error eliminando usuario:', err.message);
            alert('Error al eliminar el usuario.');
        }
    };

    const handleSubmit = () => {
        window.location.reload();
        setIsModalOpen(false);
    };

    const filteredData = usuarios.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(filterText.toLowerCase())
        )
    );

    const getRoleName = (roleId) => {
        const role = roles.find(role => role._id === roleId);
        console.log(role)
        return role ? role.nombre : 'Desconocido';
    };

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => <div style={{ fontWeight: 600 }}>{row.nombre}</div>,
            width: '150px'
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            wrap: true,
            width: '300px'
        },
        {
            name: 'Rol',
            selector: row => getRoleName(row.rol),  // Usamos la función para obtener el nombre del rol
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
                            setSelectedUsuario(row);
                            setIsModalOpen(true);
                        }}
                    >
                        Editar
                    </button>
                    <button
                        className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUsuario(row._id, `${row.nombre}`);
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

    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="table-container">
            <div className="table-header">
                <h2 className="table-title">Usuarios</h2>
                <div className="table-controls">
                    <input
                        type="text"
                        placeholder="Buscar Usuarios..."
                        value={filterText}
                        onChange={e => setFilterText(e.target.value)}
                        className="table-search"
                    />
                    <button
                        onClick={handleCrearUsuario}
                        className="table-button"
                    >
                        Crear Usuario
                    </button>
                </div>
            </div>

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
            />

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">
                    {selectedUsuario ? 'Editar Usuario' : 'Crear Usuario'}
                </h2>
                <UsuarioForm
                    onSubmit={handleSubmit}
                    initialData={selectedUsuario || {}}
                    roles={roles}
                />
            </Modal>
        </div>
    );
};

export default Usuarios;
