import React, { useState, useEffect } from 'react';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';
import UsuarioForm from "./UsuarioForm.jsx";
import { getUsuarios, deleteUsuario } from '../../../api/usuarios';
import { getRoles } from '../../../api/roles';
import { showConfirm } from '../../../alerts/alerts'; // importa las alertas

import { toast } from 'sonner';
import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';
// COMPONENTS
import Load from '../../common/Load';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
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
        try {
            const result = await showConfirm(`¿Estás seguro de eliminar a ${nombre}?`, 'Confirmar eliminación');
            if (result.isConfirmed) {
                await deleteUsuario(id);
                toast.success('¡Usuario eliminado exitosamente!');
                setUsuarios(prev => prev.filter(usuario => usuario._id !== id));
            }
        } catch (err) {
            console.error('Error eliminando usuario:', err.message);
            toast.error('Error', 'No se pudo eliminar el usuario.');
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
        return role ? role.nombre : 'Desconocido';
    };

    const columns = [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            sortable: true,
            cell: row => <div style={{ fontWeight: 600 }}>{row.nombre}</div>,
            width: '250px'
        },
        {
            name: 'Correo',
            selector: row => row.correo,
            wrap: true,
            width: '300px'
        },
        {
            name: 'Rol',
            selector: row => getRoleName(row.rol),
            wrap: true,
            width: '300px'
        },
        {
            name: 'Acciones',
            cell: row => (
                <div className="action-buttons">
                    <span className="action-button edit-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUsuario(row);
                            setIsModalOpen(true);
                        }} class="material-symbols-outlined">edit
                    </span>


                    <span className="action-button delete-button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteUsuario(row._id, row.nombre);
                        }} class="material-symbols-outlined">delete
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            width: '150px'
        }
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
          {/* Table Header separado */}
          <div className="table-header">
            <h2 className="table-title">Gestion de Usuarios</h2>
            <div className="table-controls">
              <input
                type="text"
                placeholder="Buscar Usuarios..."
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
                className="table-search"
              />
              <button onClick={handleCrearUsuario} className="table-button">
                Registrar Usuario
                <span class="material-symbols-outlined">add_circle</span>
              </button>
            </div>
          </div>
      
          {/* Contenedor solo para la tabla y modal */}
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
      
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <h2 className="modal-title">
                {selectedUsuario ? 'Actualizar Usuario' : 'Registrar Usuario'}
              </h2>
              <UsuarioForm
                onSubmit={handleSubmit}
                onClose={() => setIsModalOpen(false)}
                initialData={selectedUsuario || {}}
                roles={roles}
              />
            </Modal>
          </div>
        </>
      );      
};

export default Usuarios;
