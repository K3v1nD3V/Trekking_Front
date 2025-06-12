import React, { useState } from 'react';
import { recuperarContrasena } from '../../api/auth';
import './LoginForm.css';

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
    <div className="recuperar-box">
      <div className="recuperar-message">
        <h2>¿Olvidaste tu contraseña?</h2>
        <p>
          No te preocupes, a todos nos pasa. Ingresa tu correo y te ayudaremos a restablecer tu acceso rápidamente y de forma segura.
        </p>
      </div>

      <div className="recuperar-formulario">
        <h2>Recuperar Contraseña</h2>
        <p className="input-description">Digita tu correo para recibir el enlace de recuperación.</p>

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
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarForm;
