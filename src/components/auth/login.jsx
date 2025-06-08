import { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { login } from '../../api/auth';
import { validateUsuario } from '../../api/usuarios';

import './LoginForm.css';
import logoImagen from '../../../public/LogoTrekking.png'; // Asegúrate de que la ruta sea correcta

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  // Validación de usuario

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('t');
    if (token) {
      try {
        const data = jwtDecode(token);
        // Validar que tenga los campos requeridos
        if (data && data.id && data.correo && data.contraseña) {
          const res = validateUsuario(token);
          if (res) {
            alert('Usuario validado correctamente');
          }
        } else {
          console.warn('Token inválido: faltan campos requeridos');
        }
      } catch (err) {
        console.error('Token inválido:', err);
      }
    }
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
      const decodedToken = jwtDecode(response.token);

      const rol = response.usuario?.rol;

      if (rol === 'admin') {
        navigate('/admin');
      } else if (rol === 'cliente' || rol === 'usuario') {
        // console.log('Usuario autenticado:', JSON.stringify(decodedToken.id));
        localStorage.setItem('usuario', decodedToken.id);
        navigate('/cliente');
      } else{
        setError('Rol no reconocido');
     }
     
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        setError('Tiempo de espera agotado. Intenta de nuevo más tarde.');
      } else if (err.response?.status === 401) {
        setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
      } else {
        setError('Ocurrió un error al iniciar sesión. Inténtalo nuevamente.');
      }
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
              onChange={e => setEmail(e.target.value)} 
              className={emailError ? 'input-error' : ''}
            />
            {emailError && <p className="field-error">{emailError}</p>}

            <div className={`password-container ${passwordError ? 'input-error' : ''}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <span
                className="material-icons toggle-password"
                onClick={() => setShowPassword(prev => !prev)}
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