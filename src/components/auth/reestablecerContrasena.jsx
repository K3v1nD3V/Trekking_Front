import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';
import { toast } from 'sonner';

const RestablecerContrasena = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nuevaContrasena || !confirmarContrasena) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    const contrasenaValida = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(nuevaContrasena);
    if (!contrasenaValida) {
      setError('La contraseña debe tener mínimo 6 caracteres, una mayúscula y una minúscula');
      return;
    }

    setCargando(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/usuarios/cambiar-contrasena`, {
        token,
        nuevaContraseña: nuevaContrasena,
      });

      toast.success(response.data.msg);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al cambiar la contraseña');
    } finally {
      setCargando(false);
    }
  };

  if (!tokenValido) {
    return (
      <div className="recuperar-box">
        <div className="recuperar-formulario">
          <h2>Token inválido</h2>
          <p className="input-description">
            El enlace de recuperación ha expirado o no es válido. Serás redirigido al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="recuperar-box">
      <div className="recuperar-message">
        <h2>¿Listo para recuperar el acceso?</h2>
        <p>
          Estás a un paso de volver a ingresar. Ingresa tu nueva contraseña y asegúrate de que sea segura.
        </p>
      </div>

      <div className="recuperar-formulario">
        <h2>Restablecer Contraseña</h2>
        <p className="input-description">Digita tu nueva contraseña. Debe contener al menos 6 caracteres, una mayúscula y una minúscula.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="password-container-register">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className={error ? 'input-error' : ''}
            />
            <span
              className="material-icons toggle-password"
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </div>

          <div className="password-container-register">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className={error ? 'input-error' : ''}
            />
            {confirmarContrasena && (
              <span
                className={`material-icons password-check-icon ${
                  confirmarContrasena === nuevaContrasena ? 'valid' : 'invalid'
                }`}
              >
                {confirmarContrasena === nuevaContrasena ? 'check_circle' : 'cancel'}
              </span>
            )}
          </div>

          {error && <p className="field-error">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Cambiando...' : 'Cambiar contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
