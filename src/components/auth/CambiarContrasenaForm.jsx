// src/components/auth/CambiarContrasenaForm.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cambiarContrasena } from '../../api/auth';
import './LoginForm.css';

const CambiarContrasenaForm = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setMensaje('');

    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria');
      return;
    }

    setLoading(true);
    try {
      await cambiarContrasena(token, password);
      setMensaje('Contraseña actualizada correctamente. Redirigiendo...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-form">
          <h2>Crear nueva contraseña</h2>

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={passwordError ? 'input-error' : ''}
            />
            {passwordError && <p className="field-error">{passwordError}</p>}
            {mensaje && <p className="success-message">{mensaje}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Cambiando...' : 'Actualizar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CambiarContrasenaForm;
