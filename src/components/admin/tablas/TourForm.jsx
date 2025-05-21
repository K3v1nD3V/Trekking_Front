import React, { useState, useEffect } from 'react';
import { getPaquetes } from '../../../api/paquetes';
import '../../../css/components/admin/TourForm.css';

const TourForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fechaHora: initialData.fechaHora || '',
    id_paquete: initialData.id_paquete?._id || initialData.id_paquete || '', // Maneja el caso en que sea un objeto o un ID
    cupos: initialData.cupos || '',
    fecha_limite_inscripcion: initialData.fecha_limite_inscripcion || '',
  });
  const [paquetes, setPaquetes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPaquetes();
  }, []);

  useEffect(() => {
    setFormData({
      fechaHora: initialData.fechaHora
        ? new Date(initialData.fechaHora).toISOString().slice(0, 16) // Formato para datetime-local
        : '',
      id_paquete: initialData.id_paquete?._id || initialData.id_paquete || '', // Maneja el caso en que sea un objeto o un ID
      cupos: initialData.cupos || '',
      fecha_limite_inscripcion: initialData.fecha_limite_inscripcion
        ? new Date(initialData.fecha_limite_inscripcion).toISOString().slice(0, 10)
        : '',
    });
  }, [initialData]);

  const loadPaquetes = async () => {
    try {
      const response = await getPaquetes();
      setPaquetes(response);
    } catch (err) {
      setError('Error al cargar los paquetes', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fechaHora || !formData.id_paquete) {
      setError('Todos los campos son requeridos');
      return;
    }

    const formattedData = {
      fechaHora: new Date(formData.fechaHora).toISOString(), // Convertir a formato ISO
      id_paquete: formData.id_paquete,
      cupos: parseInt(formData.cupos, 10),
      fecha_limite_inscripcion: new Date(formData.fecha_limite_inscripcion).toISOString(),
    };
    onSubmit(formattedData);
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

      <div className="tour-form-group">
        <label htmlFor="cupos">Cupos</label>
        <input
          type="number"
          id="cupos"
          name="cupos"
          value={formData.cupos}
          onChange={handleChange}
          min="1"
          required
        />
      </div>
      
      <div className="tour-form-group">
        <label htmlFor="fecha_limite_inscripcion">Fecha Límite de Inscripción</label>
        <input
          type="date"
          id="fecha_limite_inscripcion"
          name="fecha_limite_inscripcion"
          value={formData.fecha_limite_inscripcion}
          onChange={handleChange}
          required
        />
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
