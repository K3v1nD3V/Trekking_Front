import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { toast } from 'sonner'; 

import { login } from '../../api/auth';
import { validateUsuario } from '../../api/usuarios';

import './LoginForm.css';
import logoImagen from '../../../public/LogoTrekking.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Validar token en URL (validación de usuario)
  useEffect(() => {
    const validate = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('t');
  
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/verificar/${token}`);
          const data = await res.json();
  
          if (res.ok) {
            toast.success(data.msg || 'Usuario verificado correctamente');
          } else {
            toast.error(data.msg || 'Error al verificar cuenta');
          }
        } catch (err) {
          toast.error('Error al verificar cuenta');
        }
      }
    };
    validate();
  }, []);
  

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');

    let isValid = true;

    if (!email.trim()) {
      setEmailError('El correo es obligatorio');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('El formato del correo no es válido');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es obligatoria');
      isValid = false;
    }

    if (!isValid) return;

    setLoading(true);
    try {
      const response = await login(email.toLowerCase(), password);
      const rol = response.usuario?.rol;

      if (rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'cliente' || rol === 'usuario') {
        localStorage.setItem('usuario', response.usuario.correo);
        navigate('/cliente');
      } else {
        setError('Rol no reconocido');
      }
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Tiempo de espera agotado. Intenta de nuevo más tarde.');
      } else if (err.response?.status === 401) {
        const msg = err.response?.data?.msg?.toLowerCase();
        if (msg?.includes('no verificada') || msg?.includes('no verificado')) {
          setError('Tu correo no ha sido verificado. Revisa tu bandeja de entrada.');
        } else {
          setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
        }
      } else {
        setError('Ocurrió un error al iniciar sesión. Inténtalo nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="login-image">
          <img
            src="https://i.pinimg.com/736x/1a/07/57/1a0757283b67edc17f77b83fa62ca8fe.jpg"
            alt="Login visual"
            className="main-image"
          />
          <div className="black-overlay"></div>
          <img
            src={logoImagen}
            alt="Logo superpuesto"
            className="overlay-image"
          />
        </div>

        <div className="login-form">
          <h2>Iniciar sesión</h2>

          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <p className="field-error">{emailError}</p>}

            <div className={`password-container ${passwordError ? 'input-error' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="material-icons toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </div>
            {passwordError && <p className="field-error">{passwordError}</p>}

            {error && <p className="field-error">{error}</p>}

            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </form>

          <div className="login-links">
            <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
            <p>¿Olvidaste tu contraseña? <Link to="/recuperar">Recupérala aquí</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
