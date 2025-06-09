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
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [tokenValido, setTokenValido] = useState(true);

  // Verificar el token cuando el componente se monte
  useEffect(() => {
    const verificarToken = async () => {
      try {
        // No es necesario enviar nada, solo comprobar si el token decodifica
        await axios.post(`${import.meta.env.VITE_API_URL}/auth/cambiar-contrasena`, {
          token,
          nuevaContraseña: 'temporal' // solo para validación, no se guardará
        });

        // Si no lanza error, asumimos que es válido (aunque no cambia la contraseña aún)
        setTokenValido(true);
      } catch (err) {
        setTokenValido(false);
        toast.error('Token inválido o expirado. Serás redirigido al inicio de sesión.');
        setTimeout(() => navigate('/login'), 5000);
      }
    };

    verificarToken();
  }, [token, navigate]);

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

    if (nuevaContrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/cambiar-contrasena`, {
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
      <div className="login-wrapper">
        <div className="login-box">
          <div className="login-form">
            <h2>Token inválido</h2>
            <p className="input-description">
              El enlace de recuperación ha expirado o no es válido. Serás redirigido al inicio de sesión...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-form">
          <h2>Restablecer Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <p className="input-description">Ingresa tu nueva contraseña.</p>

            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              className={error ? 'input-error' : ''}
            />

            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              className={error ? 'input-error' : ''}
            />

            {error && <p className="field-error">{error}</p>}

            <button type="submit" disabled={cargando}>
              {cargando ? 'Cambiando...' : 'Cambiar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasena;
