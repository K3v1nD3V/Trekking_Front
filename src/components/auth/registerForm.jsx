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
  
    const newFieldErrors = {};
  
    // Expresión regular para validar correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!formData.nombre) newFieldErrors.nombre = 'El nombre es requerido';
    if (!formData.correo) {
      newFieldErrors.correo = 'El correo es requerido';
    } else if (!correoRegex.test(formData.correo)) {
      newFieldErrors.correo = 'El correo no tiene un formato válido';
    }
    if (!formData.contraseña) newFieldErrors.contraseña = 'La contraseña es requerida';
  
    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }
  
    const nuevoUsuario = {
      ...formData,
      correo: formData.correo.toLowerCase(),
      rol: '682dc54f9765c3bf2ca47b0b',
    };

  
    try {
      await api.post('/usuarios', nuevoUsuario);
      navigate('/login');
    } catch (err) {
      const rawMessage = err?.response?.data?.message || err.message;
  
      if (rawMessage && rawMessage.includes('E11000') && rawMessage.includes('correo')) {
        setFieldErrors({ correo: 'Este correo ya está registrado.' });
        setError('');
      } else {
        setError('Ocurrió un error al registrar. Intenta nuevamente.');
      }
    }
  };
  return (
    <div className="login-wrapper">
      <div className="login-box">

        {/* Formulario del lado derecho */}
        <div className="login-form">
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
              type="text" 
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
        <div className="login-image">
        <img
          src="https://i.pinimg.com/736x/1a/07/57/1a0757283b67edc17f77b83fa62ca8fe.jpg"
          alt="Login visual"
          className="main-image"
        />
        <div className="black-overlay"></div>
        <img
          src="/src/assets/ORIGINAL_PNG.png"  
          alt="Logo superpuesto"
          className="overlay-image"
        />
      </div>
      </div>
    </div>
  );
};

export default RegisterForm;
