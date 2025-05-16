import React, { useState, useEffect } from 'react'; 
import DataTable from 'react-data-table-component';
import Modal from '../../common/Modal';
import TourForm from './TourForm';
import '../../../css/components/tables.css';
import '../../../css/components/admin/Tour.css';
import { getTours, createTour, updateTour, deleteTour } from '../../../api/tours';

// Importa tus alertas personalizadas
import { showConfirm, showSuccess, showError } from '../../../alerts/alerts';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const data = await getTours();
      setTours(data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar los tours:', err.message);
      setError('Error al cargar los tours');
      setLoading(false);
    }
  };

  const handleCrearTour = () => {
    setSelectedTour(null);
    setIsModalOpen(true);
  };

  const handleEditTour = (tour) => {
    setSelectedTour(tour);
    setIsModalOpen(true);
  };

  // Función modificada para eliminar con alertas personalizadas
  const handleDeleteTour = async (id) => {
    try {
      const result = await showConfirm('¿Estás seguro de que deseas eliminar este tour?', 'Confirmar eliminación');
      if (result.isConfirmed) {
        await deleteTour(id);
        await showSuccess('Tour eliminado correctamente');
        fetchTours();
      }
      // Si cancela, no hacemos nada
    } catch (err) {
      console.error('Error al eliminar el tour:', err);
      showError('Error', 'No se pudo eliminar el tour. Intenta nuevamente.');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedTour) {
        await updateTour(selectedTour._id, formData);
      } else {
        await createTour(formData);
      }
      fetchTours();
      setIsModalOpen(false);
    } catch (error) {
      // Aquí podrías agregar un showError si quieres
    }
  };

  const filteredData = tours.filter((tour) =>
    Object.values(tour).some((value) =>
      String(value).toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const columns = [
    {
      name: 'Nombre del Paquete',
      selector: (row) => row.id_paquete?.nombre || 'Sin paquete',
      sortable: true,
      wrap: true,
      width: '250px',
      cell: (row) => (
        <div style={{ fontWeight: 600 }}>
          {row.id_paquete?.nombre || 'Sin paquete'}
        </div>
      ),
    },
    {
      name: 'Fecha y Hora',
      selector: (row) => new Date(row.fechaHora).toLocaleString(),
      sortable: true,
      wrap: true,
      width: '300px',
    },
    {
      name: 'Acciones',
      cell: (row) => (
        <div className="action-buttons">
          <button
            className="action-button edit-button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditTour(row);
            }}
          >
            Editar
          </button>
          <button
            className="action-button delete-button"
            onClick={(e) => {
              e.stopPropagation(); 
              handleDeleteTour(row._id);
            }}
          >
            Eliminar
          </button>
        </div>
      ),
      ignoreRowClick: true,
      width: '160px',
    },
  ];
  

  if (loading) return <div className="loading">Cargando tours...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="table-container">
      <div className="table-header">
        <h2 className="table-title">Tours</h2>
        <div className="table-controls">
          <input
            type="text"
            placeholder="Buscar tours..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="table-search"
          />
          <button onClick={handleCrearTour} className="table-button">
            Crear Tour
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        paginationPerPage={10}
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
              padding: '12px 8px',
              verticalAlign: 'top',
            },
          },
        }}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="modal-title">
          {selectedTour ? 'Editar Tour' : 'Crear Nuevo Tour'}
        </h2>
        <TourForm
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          initialData={selectedTour || {}}
        />
      </Modal>
    </div>
  );
};

export default Tours;
