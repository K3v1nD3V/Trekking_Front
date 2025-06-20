import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import ClienteForm from './ClienteForm.jsx';
import { getClientes, deleteCliente, updateCliente } from '../../../api/clientes';
import { deleteUsuario } from '../../../api/usuarios.js'; 
import { getRoles } from '../../../api/roles';
import '../../../css/components/tables.css';
import '../../../css/components/admin/cliente.css';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';
import { IoReloadOutline } from 'react-icons/io5';
import Load from '../../common/Load';

const ClientesUsuarios = () => {
  const [clientes, setClientes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [detalleCliente, setDetalleCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const [clientesData, rolesData] = await Promise.all([
        getClientes(),
        getRoles()
      ]);
      setClientes(clientesData);
      setRoles(rolesData);
    } catch (err) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCrearCliente = () => {
    setSelectedCliente(null);
    setIsModalOpen(true);
  };

  const handleDeleteCliente = async (idCliente, nombreCompleto) => {
    const result = await showConfirm(`¿Estás seguro de eliminar a ${nombreCompleto}?`, 'Confirmar eliminación');
    if (!result.isConfirmed) return;
  
    const cliente = clientes.find(c => c._id === idCliente);
    const idUsuario = cliente?.id_usuario?._id;
  
    try {
      await deleteCliente(idCliente);
  
      if (idUsuario) {
        await deleteUsuario(idUsuario);
      }
  
      setClientes(prev => prev.filter(cliente => cliente._id !== idCliente));
      toast.success('¡Cliente y usuario eliminados exitosamente!');
    } catch (err) {
      console.error('Error al eliminar:', err.message);
      toast.error('No se pudo eliminar correctamente el cliente y/o usuario.');
    }
  };

  const handleSubmit = () => {
    fetchData();
    setIsModalOpen(false);
  };

  const toggleEstado = async (row) => {
    const nuevoEstado = !row.estado;
    const nombre = row?.id_usuario?.nombre || 'Nombre';
    const apellido = row?.id_usuario?.apellido || 'Apellido';
    const mensaje = `¿Estás seguro de ${nuevoEstado ? 'activar' : 'desactivar'} al cliente ${nombre} ${apellido}?`;
    const result = await showConfirm(mensaje, 'Confirmar cambio de estado');
    if (!result.isConfirmed) return;

    const updatedCliente = {
        documento: row.documento,
        nombre: row?.id_usuario?.nombre,
        apellido: row?.id_usuario?.apellido,
        correo: row?.id_usuario?.correo,
        telefono: row.telefono,
        observacion_medica: row.observacion_medica,
        estado: nuevoEstado,
        id_usuario: row?.id_usuario?._id, // 👈 importante
      };
      

    try {
      await updateCliente(row._id, updatedCliente);
      setClientes(prev =>
        prev.map(cliente =>
          cliente._id === row._id
            ? {
                ...cliente,
                estado: nuevoEstado // Solo actualiza el estado
              }
            : cliente
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

  const getRoleName = (roleId) => {
    const role = roles.find(r => r._id === roleId);
    return role ? role.nombre : 'Sin rol';
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
      cell: row => <div style={{ fontWeight: 600 }}>{row.documento}</div>,
      width: '150px',
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
      width: '150px'
    },
    {
      name: 'Acciones',
      cell: row => (
        <div className="action-buttons">
          <span
            className="action-button"
            onClick={(e) => {
              e.stopPropagation();
              // Buscar el usuario que corresponde con el cliente
                const usuarioDelCliente = row.id_usuario;

                // Buscar en roles por coincidencia con usuario (solo si tienes una tabla de usuarios en memoria o si no hay, asumiremos rol 'cliente')
                const rolDelUsuario = roles.find(rol => {
                // Si tienes mapeo de usuarios con rol, aquí podrías hacer match. Como no tienes el ID del rol, vamos a asumir "cliente" por defecto
                return rol.nombre.toLowerCase() === 'cliente';
                });

                setDetalleCliente({
                ...row,
                id_usuario: {
                    ...usuarioDelCliente,
                    rol: rolDelUsuario || { nombre: 'cliente' }
                }
                });

            }}
          >
            <span className="material-symbols-outlined">info</span>
          </span>

          <span
            className="action-button edit-button"
            onClick={(e) => {
                e.stopPropagation();
                setSelectedCliente({
                usuario: row.id_usuario,
                cliente: {
                    _id: row._id,
                    documento: row.documento,
                    telefono: row.telefono,
                    observacion_medica: row.observacion_medica,
                    estado: row.estado
                }
                });
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
        <h2 className="table-title">Gestión de Clientes y Usuarios</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            className="table-search"
          />
          <button onClick={handleCrearCliente} className="table-button">
            Registrar
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
          expandableRows
          expandableRowsComponent={({ data }) => (
            <div className="detalle-expandible">
              <p><strong>Rol:</strong> {getRoleName(data.id_usuario?.rol)}</p>
              <p><strong>Teléfono:</strong> {data.telefono}</p>
              {data.observacion_medica && <p><strong>Observación Médica:</strong> {data.observacion_medica}</p>}
            </div>
          )}
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

        {/* Modal Crear/Editar */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="modal-title">
            {selectedCliente ? 'Actualizar Registro' : 'Registrar Nuevo'}
          </h2>
          <ClienteForm
            onSubmit={handleSubmit}
            onClose={() => setIsModalOpen(false)}
            initialData={selectedCliente || {}}
          />
        </Modal>

        {/* Modal Detalle */}
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
                <p>
                    <span className="label-cliente">Rol:</span>{' '}
                    {detalleCliente?.id_usuario?.rol?.nombre || 'Sin rol'}
                    </p>

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

export default ClientesUsuarios;
