import React, { useState, useEffect } from 'react';
// import VentaForm from './VentaForm';
import VentaForm from '../../../components/admin/tablas/VentaForm';
import DataTable from "react-data-table-component"; // Añadido para usar la tabla de la misma forma
import Modal from '../../common/Modal';

import '../../../css/components/tables.css';
import '../../../css/components/admin/servicios.css';

import { getVentas, createVenta, updateVenta } from '../../../api/ventas';
import { getClientes } from '../../../api/clientes';
import { getPaquetes } from '../../../api/paquetes';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasData, clientesData, paquetesData] = await Promise.all([
          getVentas(),
          getClientes(),
          getPaquetes(),
        ]);
        setVentas(ventasData);
        setClientes(clientesData);
        setPaquetes(paquetesData);
      } catch (error) {
        console.error('Error al cargar los datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleNuevaVenta = async (formData) => {
  try {
    if (formData.acompañantes.includes(formData.id_cliente)) {
      alert("El cliente principal no puede ser también un acompañante.");
      return;
    }

    await createVenta(formData);
    alert("Venta creada con éxito.");
    setIsModalOpen(false);
    const ventasActualizadas = await getVentas();
    setVentas(ventasActualizadas);
  } catch (error) {
    console.error(error);
    alert("Error al crear la venta. Asegúrate de haber iniciado sesión.");
  }
};


  const filteredVentas = ventas.filter((venta) => {
    const clienteNombre = venta.id_cliente?.nombre || '';
    const paqueteNombre = venta.id_paquete?.nombre || '';
    const fecha = new Date(venta.fecha).toLocaleDateString();
    const valor = venta.valor?.toString() || '';
  
    const texto = filterText.toLowerCase();
  
    return (
      clienteNombre.toLowerCase().includes(texto) ||
      paqueteNombre.toLowerCase().includes(texto) ||
      fecha.toLowerCase().includes(texto) ||
      valor.toLowerCase().includes(texto)
    );
  });

const toggleEstado = async (row) => {
  const updatedVenta = {...row, estado: !row.estado};
  try{
    await updateVenta(row._id, updatedVenta);
    setVentas(prev =>
      prev.map(venta =>
        venta._id === row._id ? updatedVenta : venta
      )
    );
  }catch (error){
    console.error('Error actualizando estado:', error.message);
    alert('Error al cambiar el estado de la venta.');

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
      selector: row => (
        <span style={{ fontWeight: 'bold' }}>
          {row.id_cliente ? row.id_cliente.nombre : 'Desconocido'}
        </span>
      ),
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
      {Array.isArray(row.acompañantes) && row.acompañantes.length > 0
        ? row.acompañantes
            .map(acomp => {
              return acomp ? `${acomp.nombre} ${acomp.apellido}` : 'Desconocido';
            })
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
  

  if (loading) return <div className="loading">Cargando ventas...</div>;

  return (
    <div className="table-container">
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
            Crear Venta
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVentas}
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
              padding: '12px 8px',
              verticalAlign: 'top'
            },
          },
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="modal-title">Crear Venta</h2>
        <VentaForm
          onSubmit={handleNuevaVenta}
          clientes={clientes}
          paquetes={paquetes}
        />
      </Modal>

      {ventas.length === 0 && (
        <p style={{ textAlign: 'center', padding: '1rem' }}>
          No hay ventas registradas.
        </p>
      )}
    </div>
  );
};

export default Ventas;
