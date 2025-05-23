import React, { useState } from 'react';
import '../../../css/components/admin/ServicioForm.css';
import { updateServicio, createServicio } from '../../../api/servicios';

const ICONS = [
  'restaurant', 'lunch_dining', 'local_cafe', 'table_bar', 'dining',
  'health_and_safety', 'shield_with_heart', 'photo_camera', 'camera',
  'calendar_month', 'schedule', 'sailing', 'water', 'attach_money',
  'shopping_cart', 'explore', 'map', 'waterfall_chart', 'filter_hdr',
  'landscape_2', 'location_on', 'directions_bus',
];

const ServicioForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    estado: initialData.estado ?? true,
    icono: initialData.icono || '',
  });

  const [iconPreview, setIconPreview] = useState(formData.icono || '');
  const [showPreview, setShowPreview] = useState(!!formData.icono);
  const [showIconMenu, setShowIconMenu] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIconSelect = (icon) => {
    setFormData((prev) => ({ ...prev, icono: icon }));
    setIconPreview(icon);
    setShowPreview(true);
    setShowIconMenu(false); // Ocultar el menú después de seleccionar un icono
  };

  const handleIconChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, icono: value }));
    setIconPreview(value);
    setShowPreview(!!value.trim()); // Mostrar la vista previa solo si hay texto
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
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida.';
    }

    if (formData.estado !== true && formData.estado !== false) {
      newErrors.estado = 'El estado debe ser un valor booleano.';
    }

    if (!formData.icono.trim()) {
      newErrors.icono = 'El icono es requerido.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (initialData._id) {
        await updateServicio(initialData._id, formData);
        alert('¡Servicio actualizado exitosamente!');
      } else {
        await createServicio(formData);
        alert('¡Servicio creado exitosamente!');
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error al enviar los datos:', error.message);
      alert('Hubo un error al procesar la solicitud.');
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
        {initialData._id ? 'Actualizar' : 'Crear'} Servicio
      </button>
    </form>
  );
};

export default ServicioForm;