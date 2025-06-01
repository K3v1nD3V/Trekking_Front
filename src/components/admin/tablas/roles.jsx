// 📁 Importaciones
import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import RolForm from './rolesForm';
// CSS
import '../../../css/components/tables.css';
import '../../../css/components/admin/roles.css';
// ICONOS
import { IoReloadOutline } from "react-icons/io5";
// API
import { getRoles, deleteRol, updateRol } from '../../../api/roles';
import { getPrivilegios } from '../../../api/privilegios';
// COMPONENTS
import Load from '../../common/Load';

// 📌 Componente principal
const RolesTable = () => {
  // 🧠 Estados
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [privilegiosDisponibles, setPrivilegiosDisponibles] = useState([]);
  const [expandedPermisos, setExpandedPermisos] = useState({});

  // 📦 Cargar roles y privilegios
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [rolesData, privilegiosData] = await Promise.all([
          getRoles(),
          getPrivilegios(),
        ]);
        setRoles(rolesData);
        // setPrivilegiosDisponibles(privilegiosData);
        localStorage.setItem('privilegios', JSON.stringify(privilegiosData));
      } catch (error) {
        console.error("Error al cargar datos:", error.message);
        setError('No se pudieron cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // 🔁 Funciones de interacción
  const togglePrivilegios = (rolId, permisoId) => {
    setExpandedPermisos(prev => ({
      ...prev,
      [rolId]: {
        ...prev[rolId],
        [permisoId]: !prev[rolId]?.[permisoId],
      },
    }));
  };

  const handleCrearRol = () => {
    setSelectedRol(null);
    setIsModalOpen(true);
  };

  const handleRolClick = (row) => {
    setSelectedRol(row);
    setIsModalOpen(true);
  };

  const handleDeleteRol = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este rol?')) return;
    try {
      await deleteRol(id);
      alert('¡Rol eliminado exitosamente!');
      setRoles(prev => prev.filter(rol => rol._id !== id));
    } catch (error) {
      console.error('Error eliminando el rol:', error.message);
      alert('Hubo un error al eliminar el rol.');
    }
  };

  const handleSubmit = () => {
    window.location.reload();
    setIsModalOpen(false);
  };

  // 🔘 Componente Estado (con interruptor)
  const EstadoCell = ({ row }) => {
    const toggleEstado = async () => {
      try {
        const updatedEstado = { estado: !row.estado };
        await updateRol(row._id, updatedEstado);
        setRoles(prev =>
          prev.map(r => r._id === row._id ? { ...r, estado: !row.estado } : r)
        );
      } catch (error) {
        console.error('Error actualizando estado:', error.message);
        alert('Hubo un error al cambiar el estado.');
      }
    };

    return (
      <div className="estado-switch">
        <label className="switch">
          <input type="checkbox" checked={row.estado} onChange={toggleEstado} />
          <span className="slider round"></span>
        </label>
      </div>
    );
  };

  // 🔍 Filtro
  const filteredData = roles.filter(item =>
    Object.values(item).some(value =>
      String(value ?? '').toLowerCase().includes(filterText.toLowerCase())
    )
  );

  // 📊 Columnas de la tabla
  const columns = [
    {
      name: 'Nombre del Rol',
      selector: row => row.nombre,
      sortable: true,
      cell: row => (
        <div className="rol-nombre" onClick={() => handleRolClick(row)}>
          {row.nombre}
        </div>
      ),
      width: '200px',
    },
    {
      name: 'Estado',
      cell: row => <EstadoCell row={row} />,
      width: '120px',
    },
    {
      name: 'Permisos y Privilegios',
      cell: row => {
        const permisos = row.permisos || [];
        const privilegiosData = JSON.parse(localStorage.getItem('privilegios')) || [];

        return (
          <div className="permisos-expandibles">
            {permisos.length > 0 ? (
              permisos.map((permiso, idx) => {
                const privilegiosAsociados = privilegiosData.filter(p =>
                  permiso.privilegios.includes(p._id)
                );
                const isExpanded = expandedPermisos?.[row._id]?.[permiso._id];

                return (
                  <div key={idx} className="permiso-item">
                    <div className="permiso-header" onClick={() => togglePrivilegios(row._id, permiso._id)}>
                      <span className="flecha-roja">{isExpanded ? '▼' : '▶'}</span>
                      <strong>{permiso.nombre}</strong>
                    </div>
                    {isExpanded && (
                      <div className="privilegios-contenedor">
                        {privilegiosAsociados.length > 0 ? (
                          <ul className="privilegios-sublista estilizada">
                            {privilegiosAsociados.map((priv, i) => (
                              <li key={i} className="priv-item">
                                <span className="bullet-icon"></span> {priv.descripcion}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-muted">Sin privilegios</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <span className="text-muted">Sin permisos</span>
            )}
          </div>
        );
      },
      width: '400px',
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="action-buttons">
          <button className="action-button edit-button" onClick={e => {
            e.stopPropagation();
            handleRolClick(row);
          }}>
            Editar
          </button>
          <button className="action-button delete-button" onClick={e => {
            e.stopPropagation();
            handleDeleteRol(row._id);
          }}>
            Eliminar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: '180px',
    },
  ];

  // 🧾 Render principal
  if (!error) return (
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
          <button className="table-button" onClick={handleCrearRol}>
            Crear Rol
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
        progressPending={loading} // Muestra el indicador de carga mientras loading es true
        progressComponent={<Load />}
        highlightOnHover
        onRowClicked={handleRolClick}
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
        <RolForm onSubmit={handleSubmit} initialData={selectedRol || {}} />
      </Modal>
    </div>
  );
};

export default RolesTable;
