import React, { useState, useEffect } from 'react';
import VentaForm from '../../../components/admin/tablas/VentaForm';
import DataTable from "react-data-table-component";
import Modal from '../../common/Modal';

import '../../../css/components/tables.css';

import { getVentas, createVenta, updateVenta } from '../../../api/ventas';
import { getClientes } from '../../../api/clientes';
import { getPaquetes } from '../../../api/paquetes';
import { getUsuarios } from '../../../api/usuarios';
import { getTours } from '../../../api/tours';

import Load from '../../common/Load';
import { toast } from 'sonner';
import { showConfirm } from '../../../alerts/alerts';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tours, setTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ventasData, clientesData, paquetesData, usuariosData, toursData] = await Promise.all([
          getVentas(),
          getClientes(),
          getPaquetes(),
          getUsuarios(),
          getTours()
        ]);
        setVentas(Array.isArray(ventasData) ? ventasData : []);
        setClientes(clientesData);
        setPaquetes(paquetesData);
        setUsuarios(usuariosData);
        setTours(toursData);
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

    const nuevaVenta = {
      ...formData,
      fecha: formData.fecha, // 👉 Aquí se mantiene la fecha en formato "YYYY-MM-DD"
    };

    await createVenta(nuevaVenta);
    setIsModalOpen(false);

    const ventasActualizadas = await getVentas();
    setVentas(ventasActualizadas);
  } catch (error) {
    console.error(error);
    toast.error("Error al crear la venta. Asegúrate de haber iniciado sesión.");
  }
};


  const filteredVentas = ventas.filter((venta) => {
    const cliente = venta.id_cliente;
    const clienteNombre = cliente?.id_usuario?.nombre
      ? `${cliente.id_usuario.nombre} ${cliente.id_usuario.apellido}`
      : cliente?.documento || 'Desconocido';

    const paqueteNombre = venta.id_paquete?.nombre || '';
    const fecha = new Date(venta.fecha).toLocaleDateString();
    const valor = venta.valor?.toString() || '';
    const acompañantesNombres = Array.isArray(venta.acompañantes)
      ? venta.acompañantes.map(acomp => {
          return acomp?.id_usuario?.nombre
            ? `${acomp.id_usuario.nombre} ${acomp.id_usuario.apellido}`
            : acomp?.documento || 'Desconocido';
        }).join(', ')
      : 'Ninguno';

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
      id_tour: row.id_tour?._id,
      acompañantes: row.acompañantes.map(acomp => acomp._id),
    };

    try {
      await updateVenta(row._id, updatedVenta);
      setVentas(prev => prev.map(venta => venta._id === row._id ? { ...venta, estado: !row.estado } : venta));
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando estado:', error.message);
      toast.error('Error al cambiar el estado de la venta.');
    }
  };

  const EstadoCell = ({ row }) => (
    <div className="estado-switch">
      <label className="switch">
        <input type="checkbox" checked={row.estado} onChange={() => toggleEstado(row)} />
        <span className="slider round"></span>
      </label>
    </div>
  );

  const columns = [
    {
      name: 'Cliente',
      selector: row => row.id_cliente?.id_usuario?.nombre
        ? `${row.id_cliente.id_usuario.nombre} ${row.id_cliente.id_usuario.apellido}`
        : row.id_cliente?.documento || 'Desconocido',
      sortable: true,
    },
    {
      name: 'Paquete',
      selector: row => row.id_paquete?.nombre || 'Desconocido',
      sortable: true,
    },
    {
      name: 'Fecha',
      selector: row => new Date(row.fecha).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Valor',
      selector: row => row.valor.toLocaleString('es-CO', {
        style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0
      }),
      sortable: true,
    },
    {
      name: 'Acompañantes',
      cell: row => (
        Array.isArray(row.acompañantes) && row.acompañantes.length > 0
          ? row.acompañantes.map(a => a.id_usuario?.nombre
              ? `${a.id_usuario.nombre} ${a.id_usuario.apellido}`
              : a.documento || 'Desconocido'
            ).join(', ')
          : 'Ninguno'
      ),
    },
    {
      name: 'Fecha del Tour',
      selector: row => {
        const fechaTour = row?.id_tour?.fechaHora;
        if (!fechaTour) return 'No disponible';
        const fecha = new Date(fechaTour);
        return `${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      },
      sortable: true,
    },
    {
      name: 'Estado',
      cell: row => <EstadoCell row={row} />, width: '150px'
    }
  ];

  if (error) return (
    <div className="error">
      <h3>Hubo un error al cargar los datos.</h3>
      <p>Probablemente solo haga falta un poco de paciencia.</p>
      <button className='btn btn-primary' onClick={() => window.location.reload()}>
        Vuelve a intentarlo
      </button>
    </div>
  );

  return (
    <>
      <div className="table-header">
        <h2 className="table-title">Gestión de Ventas</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar Ventas..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="table-search"
          />
          <button onClick={() => setIsModalOpen(true)} className="table-button">
            Registrar Venta
            <span className="material-symbols-outlined">add_circle</span>
          </button>
        </div>
      </div>

      <div className="table-container">
        <DataTable
          columns={columns}
          data={filteredVentas}
          pagination
          paginationPerPage={10}
          highlightOnHover
          progressPending={loading}
          progressComponent={<Load />}
        />

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="modal-title">Registrar Venta</h2>
          <VentaForm
            onSubmit={handleNuevaVenta}
            onClose={() => setIsModalOpen(false)}
            clientes={clientes}
            paquetes={paquetes}
            tours={tours}
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

