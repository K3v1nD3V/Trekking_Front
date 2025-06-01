import React, { useState } from 'react';
import { createCliente } from '../../../api/clientes'; 

const AcompananteForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    documento: '',
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    observacion_medica: '',
    estado: true, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validación de campos obligatorios
      if (!formData.documento || !formData.nombre || !formData.apellido || !formData.telefono) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
      }

      await createCliente(formData);
      alert('Acompañante creado correctamente');
        onSubmit();
    } catch (error) {
      alert('Error al crear acompañante: ' + error.message);
      console.error('Error en AcompananteForm:', error);
    }
  };

  return (
    <form className="acompanante-form" onSubmit={handleSubmit}>
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

      <button 
        // type="submit" 
        className="form-submit-button"
    >
        Crear Acompañante
      </button>
    </form>
  );
};

export default AcompananteForm;