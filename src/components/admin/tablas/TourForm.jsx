import React, { useState, useEffect } from 'react';
import { getPaquetes } from '../../../api/paquetes';
import { showSuccess, showError, showConfirm } from '../../../alerts/alerts';
import '../../../css/components/admin/TourForm.css';
import { toast } from 'sonner';


const TourForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    fechaHora: initialData.fechaHora || '',
    id_paquete: initialData.id_paquete?._id || initialData.id_paquete || '',
    cupos: initialData.cupos || '',
    fecha_limite_inscripcion: initialData.fecha_limite_inscripcion || '',
  });

  const [paquetes, setPaquetes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPaquetes();
  }, []);

  useEffect(() => {
    setFormData({
      fechaHora: initialData.fechaHora
        ? new Date(initialData.fechaHora).toISOString().slice(0, 16)
        : '',
      id_paquete: initialData.id_paquete?._id || initialData.id_paquete || '',
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
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError('Error al cargar los paquetes');
      showError('Error', 'No se pudieron cargar los paquetes.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorar la hora para comparar solo la fecha
  
    if (!formData.fechaHora) {
      newErrors.fechaHora = 'Debe seleccionar una fecha y hora.';
    } else {
      const fechaHora = new Date(formData.fechaHora);
      if (fechaHora < new Date()) {
        newErrors.fechaHora = 'La fecha y hora del tour no pueden ser menores a la fecha actual.';
      }
    }
  
    if (!formData.id_paquete) {
      newErrors.id_paquete = 'Debe seleccionar un paquete.';
    }
  
    if (!formData.cupos || formData.cupos <= 0) {
      newErrors.cupos = 'Debe ingresar un número de cupos mayor a 0.';
    }
  
    if (!formData.fecha_limite_inscripcion) {
      newErrors.fecha_limite_inscripcion = 'Debe seleccionar una fecha límite de inscripción.';
    } else {
      const fechaLimite = new Date(formData.fecha_limite_inscripcion);
      const fechaHora = new Date(formData.fechaHora);
  
      if (fechaLimite < today) {
        newErrors.fecha_limite_inscripcion = 'La fecha límite de inscripción no puede ser menor a la fecha actual.';
      }
  
      if (fechaLimite >= fechaHora) {
        newErrors.fecha_limite_inscripcion = 'La fecha límite de inscripción debe ser menor que la fecha y hora del tour.';
      }
  
      if (fechaLimite < today) {
        newErrors.fecha_limite_inscripcion = 'La fecha límite de inscripción no puede ser menor a la fecha actual.';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await showConfirm(
      initialData._id ? '¿Estás seguro de actualizar este tour?' : '¿Confirmas crear este tour?',
      initialData._id ? 'Actualizar Tour' : 'Crear Tour'
    );

    if (result.isConfirmed) {
      const formattedData = {
        fechaHora: new Date(formData.fechaHora).toISOString(),
        id_paquete: formData.id_paquete,
        cupos: parseInt(formData.cupos, 10),
        fecha_limite_inscripcion: new Date(formData.fecha_limite_inscripcion).toISOString(),
      };

      try {
        await onSubmit(formattedData);
        toast.success(initialData._id ? 'Tour actualizado con éxito' : 'Tour creado con éxito');
        onClose?.();
      // eslint-disable-next-line no-unused-vars
      } catch (submitError) {
        toast.error('Error', 'Ocurrió un error al guardar el tour.');
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
        {errors.fechaHora && <p className="form-error">{errors.fechaHora}</p>}
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
        {errors.id_paquete && <p className="form-error">{errors.id_paquete}</p>}
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
        {errors.cupos && <p className="form-error">{errors.cupos}</p>}
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
        {errors.fecha_limite_inscripcion && <p className="form-error">{errors.fecha_limite_inscripcion}</p>}
      </div>

      <div className="tour-form-buttons">
        <button type="submit" className="tour-form-submit-button">
          {initialData._id ? 'Actualizar' : 'Registrar'}
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TourForm;
