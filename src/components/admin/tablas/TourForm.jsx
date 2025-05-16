import React, { useState, useEffect } from 'react';
import { getPaquetes } from '../../../api/paquetes';
import '../../../css/components/admin/TourForm.css';

// Importa las alertas que definiste
import { showSuccess, showError, showConfirm } from '../../../alerts/alerts'; // Ajusta la ruta según corresponda

const TourForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fechaHora: initialData.fechaHora || '',
    id_paquete: initialData.id_paquete?._id || initialData.id_paquete || ''
  });
  const [paquetes, setPaquetes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaquetes();
  }, []);

  useEffect(() => {
    setFormData({
      fechaHora: initialData.fechaHora
        ? new Date(initialData.fechaHora).toISOString().slice(0, 16)
        : '',
      id_paquete: initialData.id_paquete?._id || initialData.id_paquete || ''
    });
  }, [initialData]);

  const loadPaquetes = async () => {
    try {
      const response = await getPaquetes();
      setPaquetes(response);
    } catch (err) {
      setError('Error al cargar los paquetes');
      showError('Error', 'No se pudieron cargar los paquetes.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fechaHora || !formData.id_paquete) {
      setError('Todos los campos son requeridos');
      showError('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Confirmación antes de enviar
    const result = await showConfirm(
      initialData._id
        ? '¿Estás seguro de actualizar este tour?'
        : '¿Confirmas crear este tour?',
      initialData._id ? 'Actualizar Tour' : 'Crear Tour'
    );

    if (result.isConfirmed) {
      const formattedData = {
        fechaHora: new Date(formData.fechaHora).toISOString(),
        id_paquete: formData.id_paquete
      };

      try {
        await onSubmit(formattedData);
        showSuccess(
          initialData._id ? 'Tour actualizado con éxito' : 'Tour creado con éxito'
        );
        onClose(); // Opcional: cierra el formulario después de éxito
      } catch (submitError) {
        showError('Error', 'Ocurrió un error al guardar el tour.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="tour-form-container">
      <div className="tour-form-group">
        <label htmlFor="fechaHora">Fecha y Hora</label>
        <input
          type="datetime-local"
          id="fechaHora"
          name="fechaHora"
          value={formData.fechaHora}
          onChange={handleChange}
          required
        />
      </div>

      <div className="tour-form-group">
        <label htmlFor="id_paquete">Paquete</label>
        <select
          id="id_paquete"
          name="id_paquete"
          value={formData.id_paquete}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un paquete</option>
          {paquetes.map((paquete) => (
            <option key={paquete._id} value={paquete._id}>
              {paquete.nombre}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="tour-form-buttons">
        <button type="submit" className="tour-form-submit-button">
          {initialData._id ? 'Actualizar' : 'Crear'} Tour
        </button>
      </div>
    </form>
  );
};

export default TourForm;
