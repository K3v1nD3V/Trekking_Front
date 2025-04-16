import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/base';
import './LoginForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contraseña: '',
  });

  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({}); // Para inputs individuales

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError(''); // Limpiar el error global cuando un campo cambia
    setFieldErrors({}); // Limpiar los errores de los campos
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si hay campos vacíos
    const newFieldErrors = {};
    if (!formData.nombre) newFieldErrors.nombre = 'El nombre es requerido';
    if (!formData.correo) newFieldErrors.correo = 'El correo es requerido';
    if (!formData.contraseña) newFieldErrors.contraseña = 'La contraseña es requerida';

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    const nuevoUsuario = {
      ...formData,
      rol: '67e355c0b60ed98a9af8e8f6',
    };

    try {
      await api.post('/usuarios', nuevoUsuario);
      navigate('/login');
    } catch (err) {
      const rawMessage = err?.response?.data?.message || err.message;

      // Verificar si el mensaje contiene "duplicate key" y específicamente el correo
      if (rawMessage && rawMessage.includes('E11000') && rawMessage.includes('correo')) {
        setFieldErrors({ correo: 'Este correo ya está registrado.' });
        setError(''); // No mostramos el error general, solo el del campo específico
      } else {
        setError('Ocurrió un error al registrar. Intenta nuevamente.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Crear cuenta</h2>

      {/* Mostrar el error global si existe */}
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          className={fieldErrors.nombre ? 'input-error' : ''}
        />
        {fieldErrors.nombre && <div className="field-error">{fieldErrors.nombre}</div>}

        <input
          type="email"
          name="correo"
          placeholder="Correo electrónico"
          value={formData.correo}
          onChange={handleChange}
          className={fieldErrors.correo ? 'input-error' : ''}
        />
        {fieldErrors.correo && <div className="field-error">{fieldErrors.correo}</div>}

        <input
          type="password"
          name="contraseña"
          placeholder="Contraseña"
          value={formData.contraseña}
          onChange={handleChange}
          className={fieldErrors.contraseña ? 'input-error' : ''}
        />
        {fieldErrors.contraseña && <div className="field-error">{fieldErrors.contraseña}</div>}

        <button type="submit">Registrar</button>
      </form>

      <div className="login-links">
        <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </div>
    </div>
  );
};

export default RegisterForm;
