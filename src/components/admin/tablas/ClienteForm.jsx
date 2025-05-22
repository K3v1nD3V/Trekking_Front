import React from 'react';
import { createCliente, updateCliente } from '../../../api/clientes';
import '../../../css/components/admin/ClienteForm.css';

import { showConfirm, showSuccess, showError } from '../../../alerts/alerts'; // Ajusta la ruta según dónde tengas las alertas

const ClienteForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = React.useState({
    documento: initialData.documento || '',
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    observacion_medica: initialData.observacion_medica || '',
    estado: initialData.estado ?? true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirmación antes de enviar
    const confirmResult = await showConfirm(
      initialData._id ? '¿Confirmas actualizar este cliente?' : '¿Confirmas crear este cliente?',
      'Confirmación'
    );

    if (!confirmResult.isConfirmed) return;

    try {
      if (initialData && initialData._id) {
        await updateCliente(initialData._id, formData);
        await showSuccess('Cliente actualizado correctamente');
      } else {
        await createCliente(formData);
        await showSuccess('Cliente creado correctamente');
      }

      onSubmit();
    } catch (error) {
      console.error('Error en ClienteForm:', error);
      await showError('Error', 'Error al guardar cliente: ' + error.message);
    }
  };

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Documento</label>
        <input
          type="number"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="number"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Observación Médica</label>
        <textarea
          name="observacion_medica"
          value={formData.observacion_medica}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <div className="form-group">
        <label>Estado</label>
        <label className="switch">
          <input
            type="checkbox"
            name="estado"
            checked={formData.estado}
            onChange={handleCheckboxChange}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <button type="submit" className="form-submit-button">
        {initialData._id ? 'Actualizar' : 'Crear'} Cliente
      </button>
    </form>
  );
};

export default ClienteForm;
