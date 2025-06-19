import React, { useState, useEffect, useRef } from 'react';
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

  const [originalData, setOriginalData] = useState({});
  const [paquetes, setPaquetes] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPaquetes();
  }, []);

  useEffect(() => {
    const formattedInitial = {
      fechaHora: initialData.fechaHora
        ? new Date(initialData.fechaHora).toISOString().slice(0, 16)
        : '',
      id_paquete: initialData.id_paquete?._id || initialData.id_paquete || '',
      cupos: initialData.cupos || '',
      fecha_limite_inscripcion: initialData.fecha_limite_inscripcion
        ? new Date(initialData.fecha_limite_inscripcion).toISOString().slice(0, 10)
        : '',
    };
    setFormData(formattedInitial);
    setOriginalData(formattedInitial);
  }, [initialData]);

  const loadPaquetes = async () => {
    try {
      const response = await getPaquetes();
      setPaquetes(response);
    } catch (err) {
      showError('Error', 'No se pudieron cargar los paquetes.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!formData.fechaHora) {
      newErrors.fechaHora = 'Debe seleccionar una fecha y hora.';
    } else {
      const fechaHora = new Date(formData.fechaHora);
      if (isNaN(fechaHora.getTime())) {
        newErrors.fechaHora = 'La fecha y hora no es válida.';
      } else if (fechaHora < new Date()) {
        newErrors.fechaHora = 'La fecha del tour no puede ser en el pasado.';
      }
    }

    if (!formData.id_paquete) {
      newErrors.id_paquete = 'Debe seleccionar un paquete.';
    }

    const cupos = parseInt(formData.cupos, 10);
    if (!formData.cupos) {
      newErrors.cupos = 'Debe ingresar la cantidad de cupos.';
    } else if (isNaN(cupos) || cupos <= 0) {
      newErrors.cupos = 'Los cupos deben ser un número mayor a 0.';
    }

    if (!formData.fecha_limite_inscripcion) {
      newErrors.fecha_limite_inscripcion = 'Debe seleccionar una fecha límite.';
    } else {
      const fechaLimite = new Date(formData.fecha_limite_inscripcion);
      const fechaTour = new Date(formData.fechaHora);
      fechaLimite.setHours(0, 0, 0, 0);

      if (isNaN(fechaLimite.getTime())) {
        newErrors.fecha_limite_inscripcion = 'Fecha límite inválida.';
      } else if (fechaLimite < today) {
        newErrors.fecha_limite_inscripcion = 'No puede ser menor a la fecha actual.';
      } else if (formData.fechaHora && fechaLimite >= fechaTour) {
        newErrors.fecha_limite_inscripcion = 'Debe ser anterior a la fecha del tour.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isUnchanged = () => {
    return (
      formData.fechaHora === originalData.fechaHora &&
      formData.id_paquete === originalData.id_paquete &&
      String(formData.cupos) === String(originalData.cupos) &&
      formData.fecha_limite_inscripcion === originalData.fecha_limite_inscripcion
    );
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   if (!validate()) return;

  //   if (initialData._id && isUnchanged()) {
  //     toast.error('No se han realizado cambios en el formulario.');
  //     return;
  //   }

  //   const result = await showConfirm(
  //     initialData._id ? '¿Estás seguro de actualizar este tour?' : '¿Confirmas crear este tour?',
  //     initialData._id ? 'Actualizar Tour' : 'Crear Tour'
  //   );

  //   if (result.isConfirmed) {
  //     const formattedData = {
  //       fechaHora: new Date(formData.fechaHora).toISOString(),
  //       id_paquete: formData.id_paquete,
  //       cupos: parseInt(formData.cupos, 10),
  //       fecha_limite_inscripcion: new Date(formData.fecha_limite_inscripcion).toISOString(),
  //     };

  //     try {
  //       await onSubmit(formattedData);
  //       toast.success(initialData._id ? 'Tour actualizado con éxito' : 'Tour creado con éxito');
  //       onClose?.();
  //     } catch {
  //       toast.error('Error al guardar el tour.');
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  if (initialData._id && isUnchanged()) {
    toast.error('No se han realizado cambios en el formulario.');
    return;
  }

  const result = await showConfirm(
    initialData._id ? '¿Estás seguro de actualizar este tour?' : '¿Confirmas crear este tour?',
    initialData._id ? 'Actualizar Tour' : 'Crear Tour'
  );

  if (result.isConfirmed) {
    try {
      const fechaHora = new Date(formData.fechaHora).toISOString();

      // Corregir desfase solo para fecha_limite_inscripcion (tipo date)
      const fechaLimite = new Date(formData.fecha_limite_inscripcion + 'T12:00:00');
      const fecha_limite_inscripcion = fechaLimite.toISOString();

      const formattedData = {
        fechaHora,
        id_paquete: formData.id_paquete,
        cupos: parseInt(formData.cupos, 10),
        fecha_limite_inscripcion,
      };

      await onSubmit(formattedData);
      toast.success(initialData._id ? 'Tour actualizado con éxito' : 'Tour creado con éxito');
      onClose?.();
    } catch {
      toast.error('Error al guardar el tour.');
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
          className={errors.fechaHora ? 'input-error' : ''}
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
          className={errors.id_paquete ? 'input-error' : ''}
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
          className={errors.cupos ? 'input-error' : ''}
          min="1"
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
          className={errors.fecha_limite_inscripcion ? 'input-error' : ''}
        />
        {errors.fecha_limite_inscripcion && <p className="form-error">{errors.fecha_limite_inscripcion}</p>}
      </div>

      <div className="tour-form-buttons">
        <button type="submit" className="tour-form-submit-button">
          {initialData._id ? 'Actualizar' : 'Registrar'}
        </button>
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default TourForm;
