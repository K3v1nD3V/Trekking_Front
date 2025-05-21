import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import './LoginForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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


      if (response.rol === 'admin') {
        navigate('/admin');
      } else if (response.rol === 'cliente') {
        navigate('/cliente');
      } else{
        setError('Rol no reconocido');
     }
     
    } catch (err) {
      setError(err.response?.message || 'Credenciales incorrectas');
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
          src="/src/assets/ORIGINAL_PNG.png"  
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

            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={e => setPassword(e.target.value)} 
              className={passwordError ? 'input-error' : ''}
            />
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
