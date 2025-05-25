import React, { useState } from 'react';
import { createUsuario, updateUsuario } from '../../../api/usuarios';
import { showSuccess, showError, showConfirm } from '../../../alerts/alerts';
import '../../../css/components/admin/ClienteForm.css';

const UsuarioForm = ({ onSubmit, onClose, initialData = {}, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    correo: initialData.correo || '',
    rol: initialData.rol || '',
    contraseña: '' // Siempre inicia vacío
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isEditing = !!initialData._id;
    const confirmText = isEditing
      ? '¿Estás seguro de actualizar este usuario?'
      : '¿Deseas crear este nuevo usuario?';
    const confirmTitle = isEditing ? 'Actualizar' : 'Registrar';

    const result = await showConfirm(confirmText, confirmTitle);
    if (!result.isConfirmed) return;

    try {
      const dataToSubmit = { ...formData };
      if (isEditing) {
        delete dataToSubmit.contraseña;
        await updateUsuario(initialData._id, formData);
        await showSuccess('¡Usuario actualizado exitosamente!');
      } else {
          await createUsuario(formData);
          await showSuccess('¡Usuario creado exitosamente!');
      }
      onSubmit(formData);
    } catch (error) {
      console.error('Error en UsuarioForm:', error);
      showError('Error al guardar usuario', error.message || 'Error desconocido');
    }
  };

  return (
    <form className="cliente-form" onSubmit={handleSubmit}>
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
        <label>Rol</label>
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione un rol</option>
          {roles.map(rol => (
            <option key={rol._id} value={rol._id}>
              {rol.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Contraseña</label>
        <input
          type="password"
          name="contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          disabled={!!initialData._id}
          placeholder={
            initialData._id
              ? 'No se puede editar la contraseña'
              : 'Ingrese una contraseña'
          }
        />
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

export default UsuarioForm;