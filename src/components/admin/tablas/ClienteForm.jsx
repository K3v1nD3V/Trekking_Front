import React, { useRef } from 'react';
import { createCliente, updateCliente, getClientes } from '../../../api/clientes';
import '../../../css/components/admin/ClienteForm.css';
import { showConfirm, showSuccess, showError } from '../../../alerts/alerts';
import { toast } from 'sonner';


const ClienteForm = ({ onSubmit, onClose, initialData = {} }) => {
  const [formData, setFormData] = React.useState({
    documento: initialData.documento || '',
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    observacion_medica: initialData.observacion_medica || '',
    estado: initialData.estado ?? true,
  });

  const [errores, setErrores] = React.useState({});

  // Refs para inputs
  const correoRef = useRef(null);
  const documentoRef = useRef(null);

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
    setErrores({});

    const clientes = await getClientes();

    if (!initialData._id) {
      const correoExistente = clientes.find(c => c.correo === formData.correo);
      const documentoExistente = clientes.find(c => c.documento === formData.documento);

      const nuevosErrores = {};
      if (correoExistente) nuevosErrores.correo = 'Este correo ya está registrado';
      if (documentoExistente) nuevosErrores.documento = 'Este documento ya está registrado';

      if (Object.keys(nuevosErrores).length > 0) {
        setErrores(nuevosErrores);

        // Foco al primer campo con error
        if (nuevosErrores.documento) {
          documentoRef.current?.focus();
        } else if (nuevosErrores.correo) {
          correoRef.current?.focus();
        }

        return;
      }
    }

    const confirmResult = await showConfirm(
      initialData._id ? '¿Confirmas actualizar este cliente?' : '¿Confirmas crear este cliente?',
      'Confirmación'
    );
    if (!confirmResult.isConfirmed) return;

    try {
      if (initialData._id) {
        await updateCliente(initialData._id, formData);
        toast.success('Cliente actualizado exitosamente!');
      } else {
        await createCliente(formData);
        toast.success('Cliente creado exitosamente!');
      }
      setTimeout(() => {
        onSubmit(formData);
        onClose();
      }, 900);

    } catch (err) {
      toast.error('Error al guardar el cliente:', err);
      toast.error('Error al guardar el cliente. Verifica los datos o intenta más tarde.');
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
          ref={documentoRef}
          required
        />
        {errores.documento && <p className="error-text">{errores.documento}</p>}
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
          ref={correoRef}
          required
        />
        {errores.correo && <p className="error-text">{errores.correo}</p>}
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
        {initialData._id ? 'Actualizar' : 'Registrar'}
      </button>
      <button type="button" className="cancel-btn" onClick={onClose}>
        Cancelar
      </button>
    </form>
  );
};

export default ClienteForm;
