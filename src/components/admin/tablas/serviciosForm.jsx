import React, { useState, useEffect } from 'react';
import '../../../css/components/admin/ServicioForm.css';
import { updateServicio, createServicio } from '../../../api/servicios';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';

const ICONS = [
  'restaurant', 'lunch_dining', 'local_cafe', 'table_bar', 'dining',
  'health_and_safety', 'shield_with_heart', 'photo_camera', 'camera',
  'calendar_month', 'schedule', 'sailing', 'water', 'attach_money',
  'shopping_cart', 'explore', 'map', 'waterfall_chart', 'filter_hdr',
  'landscape_2', 'location_on', 'directions_bus',
];

const ServicioForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    estado: initialData.estado ?? true,
    icono: initialData.icono || '',
  });

  const [originalData, setOriginalData] = useState(null);
  const [iconPreview, setIconPreview] = useState(formData.icono || '');
  const [showPreview, setShowPreview] = useState(!!formData.icono);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData._id) {
      setOriginalData({
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        estado: initialData.estado ?? true,
        icono: initialData.icono || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({ ...prev, icono: icon }));
    setIconPreview(icon);
    setShowPreview(true);
    setShowIconMenu(false);
  };

  const handleIconChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, icono: value }));
    setIconPreview(value);
    setShowPreview(!!value.trim());
  };

  const resetIcon = () => {
    setFormData((prev) => ({ ...prev, icono: '' }));
    setIconPreview('');
    setShowPreview(false);
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del servicio es requerido.';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/.test(formData.nombre)) {
      newErrors.nombre = 'El nombre solo puede contener letras y espacios.';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida.';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres.';
    }

    if (!formData.icono.trim()) {
      newErrors.icono = 'El icono es requerido.';
    } else if (!/^[a-z_]+$/.test(formData.icono)) {
      newErrors.icono = 'El icono debe contener solo letras minúsculas y guiones bajos.';
    }

    if (typeof formData.estado !== 'boolean') {
      newErrors.estado = 'El estado debe ser un valor booleano.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isEqualToOriginal = () => {
    return (
      originalData &&
      originalData.nombre === formData.nombre &&
      originalData.descripcion === formData.descripcion &&
      originalData.icono === formData.icono &&
      originalData.estado === formData.estado
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    if (initialData._id && isEqualToOriginal()) {
      toast.error('No se han realizado cambios en el formulario.');
      return;
    }

    const result = await showConfirm(
      initialData._id
        ? '¿Quieres actualizar este servicio?'
        : '¿Quieres crear este servicio?',
      'Confirma la acción'
    );

    if (!result.isConfirmed) return;

    try {
      if (initialData._id) {
        await updateServicio(initialData._id, formData);
        await toast.success('¡Servicio actualizado exitosamente!');
      } else {
        await createServicio(formData);
        await toast.success('¡Servicio creado exitosamente!');
      }
      setTimeout(() => {
        onSubmit(formData);
        onClose();
      }, 900);
    } catch (error) {
      console.error('Error al enviar los datos:', error.message);
      await toast.error('Hubo un error al procesar la solicitud.');
    }
  };

  return (
    <form className="servicio-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        {errors.nombre && <p className="form-error">{errors.nombre}</p>}
      </div>

      <div className="form-group">
        <label>Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
        />
        {errors.descripcion && <p className="form-error">{errors.descripcion}</p>}
      </div>

      <div className="form-group">
        <label>Estado</label>
        <div className="estado-switch">
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estado: e.target.checked,
                }))
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
        {errors.estado && <p className="form-error">{errors.estado}</p>}
      </div>

      <div className="form-group">
        <label>Icono</label>
        <div className="icon-selector">
          <input
            type="text"
            name="icono"
            value={formData.icono}
            onChange={handleIconChange}
            placeholder="Ingresa la clase del icono"
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowIconMenu(!showIconMenu)}
          >
            Menu
          </button>
        </div>
        {errors.icono && <p className="form-error">{errors.icono}</p>}

        {showPreview && (
          <div className="icon-preview-container">
            <span className="material-symbols-outlined icon-preview">
              {iconPreview}
            </span>
            <button
              type="button"
              className="btn btn-outline"
              onClick={resetIcon}
            >
              Remplazar
            </button>
          </div>
        )}

        {showIconMenu && (
          <div className="icon-menu">
            {ICONS.map((icon) => (
              <div
                key={icon}
                className="icon-item"
                onClick={() => handleIconSelect(icon)}
              >
                <span className="material-symbols-outlined">{icon}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="form-submit-button">
        {initialData._id ? 'Actualizar' : 'Registrar'}
      </button>
      <button
        type="button"
        className="cancel-btn"
        onClick={onClose}
      >
        Cancelar
      </button>
    </form>
  );
};

export default ServicioForm;
