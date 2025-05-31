import React, { useState, useRef } from 'react'; 
import { createUsuario, updateUsuario, getUsuarios } from '../../../api/usuarios'; // asumo getUsuarios está disponible
import { showSuccess, showConfirm } from '../../../alerts/alerts';
import '../../../css/components/admin/ClienteForm.css';
import { toast } from 'sonner';


const UsuarioForm = ({ onSubmit, onClose, initialData = {}, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    correo: initialData.correo || '',
    rol: initialData.rol || '',
    contraseña: '' // Siempre inicia vacío
  });

  const [correoExisteError, setCorreoExisteError] = useState('');
  const correoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'correo') {
      setCorreoExisteError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación correo existe SOLO al crear
    if (!initialData._id) {
      try {
        const usuarios = await getUsuarios();

        const correoExistente = usuarios.find(u => u.correo.toLowerCase() === formData.correo.toLowerCase());
        if (correoExistente) {
          setCorreoExisteError('Este correo ya está registrado');
          correoRef.current?.focus();
          return; // Sale sin mostrar confirmación ni enviar datos
        }
      } catch (error) {
        console.error('Error validando usuarios:', error);
        // Opcional: mostrar alerta o continuar con confirmación
      }
    }

    // Confirmación
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
        await updateUsuario(initialData._id, dataToSubmit);
        await toast.success('¡Usuario actualizado exitosamente!');
      } else {
        await createUsuario(dataToSubmit);
        await toast.success('¡Usuario creado exitosamente!');
      }
      setTimeout(() => {
        onSubmit(dataToSubmit);
        onClose();
    }, 900);
    } catch (error) {
      const mensaje = error?.response?.data?.message || error.message || '';
      console.error('Error en UsuarioForm:', mensaje);

      if (
        mensaje.includes('E11000') ||
        mensaje.toLowerCase().includes('duplicate key') ||
        mensaje.toLowerCase().includes('correo')
      ) {
        setCorreoExisteError('Este correo ya está registrado');
        correoRef.current?.focus();
      } else {
        // Manejo genérico u otro error
        console.error('Error al guardar usuario:', mensaje);
      }
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
          ref={correoRef}
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          required
          className={correoExisteError ? 'input-error' : ''}
        />
        {correoExisteError && <p className="field-error">{correoExisteError}</p>}
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
