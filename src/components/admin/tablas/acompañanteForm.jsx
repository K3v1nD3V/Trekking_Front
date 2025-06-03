import React, { useState } from 'react';
import { createCliente, checkClienteExistence } from '../../../api/clientes'; 

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

  const [errors, setErrors] = useState({}); // Estado para almacenar los errores

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = async () => {
    const newErrors = {};

    // Validación de documento
    if (!formData.documento) {
      newErrors.documento = 'El documento es requerido.';
    } else if (formData.documento.length < 8 || formData.documento.length > 12) {
      newErrors.documento = 'El documento debe tener entre 8 y 12 caracteres.';
    } else if (!/^\d+$/.test(formData.documento)) {
      newErrors.documento = 'El documento debe contener solo números.';
    } else {
      // Verificar existencia del documento
      const exists = await checkClienteExistence({ documento: formData.documento });
      if (exists) {
        newErrors.documento = 'El documento ya está registrado.';
      }
    }

    // Validación de nombre
    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es requerido.';
    }

    // Validación de apellido
    if (!formData.apellido) {
      newErrors.apellido = 'El apellido es requerido.';
    }

    // Validación de correo
    if (formData.correo && !/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = 'El correo debe tener un formato válido.';
    } else if (formData.correo) {
      // Verificar existencia del correo
      const exists = await checkClienteExistence({ correo: formData.correo });
      if (exists) {
        newErrors.correo = 'El correo ya está registrado.';
      }
    }

    // Validación de teléfono
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido.';
    } else if (!/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe contener solo números.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await validate())) {
      return; // Detener el envío si hay errores
    }

    try {
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
        />
        {errors.documento && <p className="form-error">{errors.documento}</p>}
      </div>

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
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
        />
        {errors.apellido && <p className="form-error">{errors.apellido}</p>}
      </div>

      <div className="form-group">
        <label>Correo</label>
        <input
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
        />
        {errors.correo && <p className="form-error">{errors.correo}</p>}
      </div>

      <div className="form-group">
        <label>Teléfono</label>
        <input
          type="number"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
        />
        {errors.telefono && <p className="form-error">{errors.telefono}</p>}
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

      <button type="submit" className="form-submit-button">
        Crear Acompañante
      </button>
    </form>
  );
};

export default AcompananteForm;