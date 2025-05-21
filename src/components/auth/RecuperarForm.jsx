// src/components/auth/RecuperarForm.jsx
import React, { useState } from 'react';
import { recuperarContrasena } from '../../api/auth';
import './LoginForm.css'; // reutiliza estilos del login

const RecuperarForm = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setMensaje('');

    if (!email.trim()) {
      setEmailError('El correo es obligatorio');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('El formato del correo no es válido');
      return;
    }

    setLoading(true);
    try {
      await recuperarContrasena(email);
      setMensaje('Se ha enviado un correo de recuperación. Revisa tu bandeja de entrada.');
      setEmail('');
    } catch (error) {
      setEmailError(error.response?.data?.message || 'Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-image">
          <img src="/src/assets/image/image_login_transparent.png" alt="Recuperar visual" />
        </div>

        <div className="login-form">
          <h2>Recuperar Contraseña</h2>

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <p className="field-error">{emailError}</p>}
            {mensaje && <p className="success-message">{mensaje}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecuperarForm;
