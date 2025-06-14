import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCliente, checkClienteExistence } from "../../api/clientes.js"; 
import { createUsuario, getUsuarios } from "../../api/usuarios.js"; 
import logoImagen from '../../../public/LogoTrekking.png'; 
import { toast } from 'sonner';

import './LoginForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    documento: '',
    correo: '',
    contraseña: '',
    confirmarContraseña: '',
    observacion_medica: '',
    telefono: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
    setError('');
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFieldErrors = {};
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!formData.contraseña) {
      newFieldErrors.contraseña = 'La contraseña es requerida';
    } else if (!passwordRegex.test(formData.contraseña)) {
      newFieldErrors.contraseña = 'Debe tener al menos 6 caracteres, una letra mayúscula y una letra minúscula';
    }

    if (!formData.nombre) {
      newFieldErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 3) {
      newFieldErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.apellido) {
      newFieldErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.length < 2) {
      newFieldErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }

    if (!formData.documento) {
      newFieldErrors.documento = 'El documento es requerido';
    } else if (formData.documento.length < 8 || formData.documento.length > 12) {
      newFieldErrors.documento = 'El documento debe tener entre 8 y 12 caracteres';
    } else if (!/^\d+$/.test(formData.documento)) {
      newFieldErrors.documento = 'El documento debe contener solo números';
    }

    if (!formData.correo) {
      newFieldErrors.correo = 'El correo es requerido';
    } else if (!correoRegex.test(formData.correo)) {
      newFieldErrors.correo = 'El correo no tiene un formato válido';
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      newFieldErrors.confirmarContraseña = 'Las contraseñas no coinciden';
    }

    if (!formData.telefono) {
      newFieldErrors.telefono = 'El teléfono es requerido';
    } else if (!/^\d+$/.test(formData.telefono)) {
      newFieldErrors.telefono = 'El teléfono debe contener solo números';
    }

    // Validación de documento único
    if (!newFieldErrors.documento) {
      const docExists = await checkClienteExistence({ documento: formData.documento });
      if (docExists) {
        newFieldErrors.documento = 'El documento ya está registrado';
      }
    }

    // Validación de correo único en usuarios
    if (!newFieldErrors.correo) {
      const usuariosRes = await getUsuarios();
      console.log('Usuarios obtenidos:', usuariosRes);
      
      const usuarios = usuariosRes?.data || usuariosRes || [];
      const correoExists = usuarios.some(u => u.correo.toLowerCase() === formData.correo.toLowerCase());
      if (correoExists) {
        newFieldErrors.correo = 'El correo ya está registrado';
      }
    }

    if (Object.keys(newFieldErrors).length > 0) {
      setFieldErrors(newFieldErrors);
      return;
    }

    // 1. Crear usuario
    const nuevoUsuario = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo.toLowerCase(),
      contraseña: formData.contraseña,
      rol: '68350ff72c7fc19be2ddaab3' // ID del rol cliente
    };

    try {
      const usuarioRes = await createUsuario(nuevoUsuario);
    
      const usuarioId = usuarioRes?.data?._id || usuarioRes?._id || usuarioRes?.usuario?._id;

      const clienteData = {
        documento: formData.documento,
        telefono: formData.telefono,
        observacion_medica: formData.observacion_medica || '',
        estado: true,
        id_usuario: usuarioId
      };

      await createCliente(clienteData);
      toast.success('Se envió correo de verificación para acceder', { duration: 8000 });
      navigate('/login');
    } catch (err) {
      console.error('Error al registrar:', err);
      toast.error('Error al registrar usuario. Intenta de nuevo.');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-form">
          <h2>Crear cuenta</h2>
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-row">
              <input type="text" name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} className={fieldErrors.nombre ? 'input-error' : ''} />
              <input type="text" name="apellido" placeholder="Apellido" value={formData.apellido} onChange={handleChange} className={fieldErrors.apellido ? 'input-error' : ''} />
            </div>
            <div className="field-error-row">
              <span>{fieldErrors.nombre}</span>
              <span>{fieldErrors.apellido}</span>
            </div>

            <div className="input-row">
              <input type="text" name="documento" placeholder="Documento" value={formData.documento} onChange={handleChange} className={fieldErrors.documento ? 'input-error' : ''} />
              <input type="tel" name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} className={fieldErrors.telefono ? 'input-error' : ''} />
            </div>
            <div className="field-error-row">
              <span>{fieldErrors.documento}</span>
              <span>{fieldErrors.telefono}</span>
            </div>

            <input type="text" name="correo" placeholder="Correo electrónico" value={formData.correo} onChange={handleChange} className={fieldErrors.correo ? 'input-error' : ''} />
            {fieldErrors.correo && <div className="field-error">{fieldErrors.correo}</div>}

            <textarea name="observacion_medica" placeholder="Observación médica (opcional)" value={formData.observacion_medica} onChange={handleChange} rows={2} className="text-area" />

            <div className="input-row">
              <div className="password-container-register">
                <input type={showPassword ? 'text' : 'password'} name="contraseña" placeholder="Contraseña" value={formData.contraseña} onChange={handleChange} />
                <span className="material-icons toggle-password" onClick={() => setShowPassword(prev => !prev)}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
              <div className="password-container-register">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmarContraseña"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmarContraseña}
                  onChange={handleChange}
                />
                {formData.confirmarContraseña && (
                  <span
                    className={`material-icons password-check-icon ${
                      formData.confirmarContraseña === formData.contraseña ? 'valid' : 'invalid'
                    }`}
                  >
                    {formData.confirmarContraseña === formData.contraseña ? 'check_circle' : 'cancel'}
                  </span>
                )}
              </div>
            </div>
            <div className="field-error-row">
              <span>{fieldErrors.contraseña}</span>
              <span>{fieldErrors.confirmarContraseña}</span>
            </div>

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
          <img src={logoImagen} alt="Logo superpuesto" className="overlay-image" />
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;