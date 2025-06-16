import React, { useState, useRef } from 'react';
import { createUsuario, updateUsuario, getUsuarios } from '../../../api/usuarios';
import { showConfirm } from '../../../alerts/alerts';
import { toast } from 'sonner';
import '../../../css/components/admin/ClienteForm.css';

const UsuarioForm = ({ onSubmit, onClose, initialData = {}, roles = [] }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    correo: initialData.correo || '',
    rol: initialData.rol || '',
    contraseña: ''
  });

  const [errors, setErrors] = useState({});
  const [correoExisteError, setCorreoExisteError] = useState('');
  const correoRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    if (name === 'correo') setCorreoExisteError('');
  };

  const validateForm = () => {
    const newErrors = {};
    const regexLetras = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s]+$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido.';
    } else if (formData.nombre.trim().length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres.';
    } else if (!regexLetras.test(formData.nombre.trim())) {
      newErrors.nombre = 'El nombre solo puede contener letras.';
    }

    // 2. Validar apellido
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido.';
    } else if (formData.apellido.trim().length < 5) {
      newErrors.apellido = 'El apellido debe tener al menos 5 caracteres.';
    } else if (!regexLetras.test(formData.apellido.trim())) {
      newErrors.apellido = 'El apellido solo puede contener letras.';
    }

    // 3. Validar correo
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido.';
    } else if (!regexCorreo.test(formData.correo.trim())) {
      newErrors.correo = 'Ingrese un correo válido con @ y dominio.';
    }

    // 4. Validar rol
    if (!formData.rol.trim()) {
      newErrors.rol = 'Debe seleccionar un rol.';
    }

    // 5. Validar contraseña solo si es nuevo usuario
    if (!initialData._id) {
      if (!formData.contraseña.trim()) {
        newErrors.contraseña = 'La contraseña es requerida.';
      } else if (formData.contraseña.trim().length < 6) {
        newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!initialData._id) {
      try {
        const usuarios = await getUsuarios();
        const correoExistente = usuarios.find(
          u => u.correo.toLowerCase() === formData.correo.toLowerCase()
        );
        if (correoExistente) {
          setCorreoExisteError('Este correo ya está registrado');
          correoRef.current?.focus();
          return;
        }
      } catch (error) {
        console.error('Error validando usuarios:', error);
      }
    }

    const confirmText = initialData._id
      ? '¿Estás seguro de actualizar este usuario?'
      : '¿Deseas crear este nuevo usuario?';
    const confirmTitle = initialData._id ? 'Actualizar' : 'Registrar';

    const result = await showConfirm(confirmText, confirmTitle);
    if (!result.isConfirmed) return;

    const dataToSubmit = { ...formData };
    if (initialData._id) delete dataToSubmit.contraseña;

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
          className={errors.nombre ? 'input-error' : ''}
        />
        {errors.nombre && <p className="field-error">{errors.nombre}</p>}
      </div>

      <div className="form-group">
        <label>Apellido</label>
        <input
          type="text"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          className={errors.apellido ? 'input-error' : ''}
        />
        {errors.apellido && <p className="field-error">{errors.apellido}</p>}
      </div>

      <div className="form-group">
        <label>Correo</label>
        <input
          ref={correoRef}
          type="email"
          name="correo"
          value={formData.correo}
          onChange={handleChange}
          className={(errors.correo || correoExisteError) ? 'input-error' : ''}
        />
        {errors.correo && <p className="field-error">{errors.correo}</p>}
        {correoExisteError && <p className="field-error">{correoExisteError}</p>}
      </div>

      <div className="form-group">
        <label>Rol</label>
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          className={errors.rol ? 'input-error' : ''}
        >
          <option value="">Seleccione un rol</option>
          {roles.map(rol => (
            <option key={rol._id} value={rol._id}>
              {rol.nombre}
            </option>
          ))}
        </select>
        {errors.rol && <p className="field-error">{errors.rol}</p>}
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
          className={errors.contraseña ? 'input-error' : ''}
        />
        {errors.contraseña && <p className="field-error">{errors.contraseña}</p>}
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

export default UsuarioForm;
