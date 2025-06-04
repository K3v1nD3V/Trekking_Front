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

import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';

// 📌 Componente principal
const RolesTable = () => {
  // 🧠 Estados
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRol, setSelectedRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMode, setModalMode] = useState('');

  // 📦 Cargar roles y privilegios
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        console.log('roles')
        const [rolesData, privilegiosData] = await Promise.all([
          getRoles(),
          getPrivilegios(),
        ]);
        setRoles(rolesData);
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
  const handleCrearRol = () => {
    setSelectedRol(null);
    setModalMode('crear');
    setIsModalOpen(true);
  };
  
  const handleRolClick = (row) => {
    setSelectedRol(row);
    setModalMode('editar');
    setIsModalOpen(true);
  };
  
  const handleVerDetalle = (row) => {
    setSelectedRol(row);
    setModalMode('detalle');
    setIsModalOpen(true);
  };

  const handleDeleteRol = async (id) => {
    const result = await showConfirm('¿Estás seguro de que deseas eliminar este rol?', 'Eliminar Rol');
    if (!result.isConfirmed) return;

    try {
      await deleteRol(id);
      toast.success('¡Rol eliminado exitosamente!');
      setRoles(prev => prev.filter(rol => rol._id !== id));
    } catch (error) {
      toast.error('Error eliminando el rol:', error.message);
      toast.error('Error', 'Hubo un error al eliminar el rol.');
    }
  };

  const handleSubmit = async (nuevoRol) => {
    if (modalMode === 'crear') {
      setRoles(prev => [...prev, nuevoRol]);
    } else if (modalMode === 'editar') {
      setRoles(prev =>
        prev.map(rol => rol._id === nuevoRol._id ? nuevoRol : rol)
      );
    }
    setIsModalOpen(false);
  };
  
  // 🔘 Componente Estado (interruptor)
  const EstadoCell = ({ row }) => { 
    const toggleEstado = async () => {
      const accion = row.estado ? 'desactivar' : 'activar';
      const result = await showConfirm(
        `¿Estás seguro de que deseas ${accion} este rol?`,
        'Cambiar Estado'
      );
    
      if (!result.isConfirmed) return;
    
      try {
        const updatedRol = {
          nombre: row.nombre,
          estado: !row.estado,
          permisos: row.permisos.map(p => typeof p === 'string' ? p : p._id),
        };
    
        await updateRol(row._id, updatedRol);
    
        setRoles(prev =>
          prev.map(r => r._id === row._id ? { ...r, estado: !row.estado } : r)
        );
    
        toast.success(`Estado cambiado a ${!row.estado ? 'Activo' : 'Inactivo'}`);
      } catch (error) {
        console.error('Error actualizando estado:', error.message);
        toast.error('Hubo un error al cambiar el estado.');
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
      cell: row => <div style={{ fontWeight: 600 }}>{row.nombre}</div>,
      width: '300px',
    },
    {
      name: 'Estado',
      cell: row => <EstadoCell row={row} />,
      width: '300px',
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="action-buttons">
          <span
            className="action-button detail-button material-symbols-outlined"
            onClick={(e) => {
              e.stopPropagation();
              handleVerDetalle(row);
            }}
          >
            info
          </span>
          <span
            className="action-button edit-button material-symbols-outlined"
            onClick={e => {
              e.stopPropagation();
              handleRolClick(row);
            }}
          >
            edit
          </span>

          <span
            className="action-button delete-button material-symbols-outlined"
            onClick={e => {
              e.stopPropagation();
              handleDeleteRol(row._id);
            }}
          >
            delete
          </span>
        </div>
      ),
      ignoreRowClick: true,
      width: '180px',
    },
  ];

  const DetalleRolModal = ({ rol }) => {
    const privilegiosData = JSON.parse(localStorage.getItem('privilegios')) || [];
  
    return (
      <div className="detalle-rol-modal">
        <h3>Detalles del Rol</h3>
  
        <hr />
        
        <div className="info-general">
          <div><span className="label">Rol:</span> {rol.nombre}</div>
          <div>
            <span className="label">Estado:</span>
            <span className={`estado ${rol.estado ? 'activo' : 'inactivo'}`}>
              {rol.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
        </div>
  
  
        <h4>Permisos y Privilegios</h4>
  
        {rol.permisos && rol.permisos.length > 0 ? (
          rol.permisos.map((permiso, idx) => {
            const privilegios = privilegiosData.filter(p =>
              permiso.privilegios.includes(p._id)
            );
            return (
              <div key={idx} className="permiso-detalle">
                <div className="permiso-nombre">{permiso.nombre}</div>
                <ul className="privilegios-lista">
                  {privilegios.length > 0 ? (
                    privilegios.map((priv, i) => (
                      <li key={i}>{priv.descripcion}</li>
                    ))
                  ) : (
                    <li className="text-muted">Sin privilegios</li>
                  )}
                </ul>
              </div>
            );
          })
        ) : (
          <p className="text-muted">Este rol no tiene permisos asignados.</p>
        )}
      </div>
    );
  };
  

  // 🧾 Render principal
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
        <h2 className="table-title">Gestión de Roles</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar roles..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="table-search"
          />
          <button className="table-button" onClick={handleCrearRol}>
            Registrar Rol
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
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalMode === 'detalle' && selectedRol && (
          <DetalleRolModal rol={selectedRol} />
        )}
        {modalMode === 'editar' && selectedRol && (
          <RolForm onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} initialData={selectedRol} />
        )}
        {modalMode === 'crear' && (
          <RolForm onSubmit={handleSubmit} onClose={() => setIsModalOpen(false)} />
        )}
      </Modal>
    </>
  );
};

export default RolesTable;
