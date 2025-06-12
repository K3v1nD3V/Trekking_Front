import React, { useState, useEffect } from 'react';
// import VentaForm from './VentaForm';
import VentaForm from '../../../components/admin/tablas/VentaForm';
import DataTable from "react-data-table-component"; // Añadido para usar la tabla de la misma forma
import Modal from '../../common/Modal';

import '../../../css/components/tables.css';
// import '../../../css/components/admin/servicios.css';

import { getVentas, createVenta, updateVenta } from '../../../api/ventas';
import { getClientes } from '../../../api/clientes';
import { getPaquetes } from '../../../api/paquetes';
import { getUsuarios } from '../../../api/usuarios';
// COMPONENTS
import Load from '../../common/Load';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts'; 

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [usuarios, setUsuarios] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasData, clientesData, paquetesData, usuariosData] = await Promise.all([
          getVentas(),
          getClientes(),
          getPaquetes(),
          getUsuarios()
        ]);
        setVentas(ventasData);
        setClientes(clientesData);
        setPaquetes(paquetesData);
        setUsuarios(usuariosData);
      } catch (err) {
        setError(err.message || 'Error al cargar historial de ventas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNuevaVenta = async (formData) => {
  try {
    if (formData.acompañantes.includes(formData.id_cliente)) {
      toast.error("El cliente principal no puede ser también un acompañante.");
      return;
    }

    // Construir el objeto con solo los IDs necesarios
    const nuevaVenta = {
      ...formData,
      id_cliente: formData.id_cliente, // Ya es un ID
      id_paquete: formData.id_paquete, // Ya es un ID
      acompañantes: formData.acompañantes, // Solo los IDs de los acompañantes
    };

    delete nuevaVenta.__v;

    await createVenta(nuevaVenta);
    alert("Venta creada con éxito.");
    setIsModalOpen(false);
    const ventasActualizadas = await getVentas();
    setVentas(ventasActualizadas);
  } catch (error) {
    console.error(error);
    toast.error("Error al crear la venta. Asegúrate de haber iniciado sesión.");
  }
};


const filteredVentas = ventas.filter((venta) => {
  console.log('Filtrando venta:', venta);
  // console.log('usuarios:', usuarios);
  
  let clienteNombre = usuarios.find(u => {
    // console.log('Comparando usuario:', u, 'con venta cliente ID:', venta.id_cliente?.id_usuario?._id);
    if (u._id === venta.id_cliente.id_usuario) {
      // console.log('Cliente encontrado:', `${u.nombre} ${u.apellido}`);
      return `${u.correo}`; 
    }
  })
  clienteNombre = clienteNombre ? `${clienteNombre.nombre} ${clienteNombre.apellido}` : 'Desconocido';

  const paqueteNombre = venta.id_paquete?.nombre || '';
  const fecha = new Date(venta.fecha).toLocaleDateString();
  const valor = venta.valor?.toString() || '';
  const acompañantesNombres = venta.acompañantes.map(acomp => {
    const acompUsuario = usuarios.find(u => u._id === acomp.id_usuario);
    return acompUsuario ? `${acompUsuario.nombre} ${acompUsuario.apellido}` : acomp.documento || 'Desconocido';
  }).join(', ');


  const texto = filterText.toLowerCase();

  return (
    clienteNombre.toLowerCase().includes(texto) ||
    paqueteNombre.toLowerCase().includes(texto) ||
    fecha.toLowerCase().includes(texto) ||
    valor.toLowerCase().includes(texto) ||
    acompañantesNombres.toLowerCase().includes(texto)
  );
});

const toggleEstado = async (row) => {
  const result = await showConfirm(
    `¿Estás seguro de que deseas ${row.estado ? 'desactivar' : 'activar'} esta venta?`,
    'Confirmar cambio de estado'
  );
  if (!result.isConfirmed) return;
  const updatedVenta = {
    ...row,
    estado: !row.estado,
    id_cliente: row.id_cliente._id,
    id_paquete: row.id_paquete._id,
    acompañantes: row.acompañantes.map(acomp => acomp._id),
  };
  const tableUpdatedVenta = {
    ...row,
    estado: !row.estado
  }
  delete updatedVenta.__v;

  console.log('Actualizando estado de venta:', updatedVenta);
  try{
    await updateVenta(row._id, updatedVenta);
    setVentas(prev =>
      prev.map(venta =>
        venta._id === row._id ? tableUpdatedVenta : venta
      )
    );
    toast.success('Estado actualizado correctamente');
  }catch (error){
    console.error('Error actualizando estado:', error.message);
    toast.error('Error al cambiar el estado de la venta.');
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
  

  const columns = [
    {
  name: 'Cliente',
  selector: row => {
    console.log('row cliente:', row);
    
    const usuarioEncontrado = usuarios.find(u => u._id === row.id_cliente.id_usuario);
    
    return usuarioEncontrado
      ? `${usuarioEncontrado.correo}`
      : 'Desconocido';
  },
  sortable: true,
},

    {
      name: 'Paquete',
      selector: row => row.id_paquete ? row.id_paquete.nombre : 'Desconocido',
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: row => new Date(row.fecha).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Valor',
      selector: row => row.valor.toLocaleString('es-CO', { style: 'currency', currency: 'COP' }),
      sortable: true,
    },
{
  name: 'Acompañantes',
  selector: row => (
    <span>
      {console.log('Acompañantes:', row.acompañantes)}
      {Array.isArray(row.acompañantes) && row.acompañantes.length > 0
        ? row.acompañantes
            .map(acomp => {
              const usuarioEncontrado = usuarios.find(u => u._id === acomp.id_usuario);
              return usuarioEncontrado && usuarioEncontrado.nombre && usuarioEncontrado.apellido
                ? `${usuarioEncontrado.nombre} ${usuarioEncontrado.apellido} (${usuarioEncontrado.correo})`
                : 'Desconocido'
            }
            )
            .join(', ')
        : 'Ninguno'}
    </span>
  ),
},

   {
            name: 'Estado',
            cell: row => <EstadoCell row={row} />,
            width: '150px' 
        }


  ];

  if (error) return (
    <div className="error">
        <h3>Hubo un error al cargar los datos.</h3>
        <p>Problamente solo haga falta un poco de paciencia.</p>
        <button className='btn btn-primary' onClick={() => window.location.reload()}>
            {/* <IoReloadOutline /> */}
            Vuelve a intententarlo
        </button>
    </div>
  );
  return (
    <>
      {/* Encabezado separado */}
      <div className="table-header">
        <h2 className="table-title">Gestión de Ventas</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar ventas..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="table-search"
          />
          <button onClick={() => setIsModalOpen(true)} className="table-button">
            Registrar Venta
            <span class="material-symbols-outlined">add_circle</span>
          </button>
        </div>
      </div>
  
      {/* Contenedor solo de la tabla y el modal */}
      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredVentas}
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
          <h2 className="modal-title">Registrar Venta</h2>
          <VentaForm
            onSubmit={handleNuevaVenta} 
            onClose={() => setIsModalOpen(false)}
            clientes={clientes}
            paquetes={paquetes}
          />
        </Modal>
  
        {ventas.length === 0 && !loading && (
          <p style={{ textAlign: 'center', padding: '1rem' }}>
            No hay ventas registradas.
          </p>
        )}
      </div>
    </>
  );  
};

export default Ventas;