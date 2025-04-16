import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';
import './LoginForm.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin'); 
    } catch (err) {
      setError(err.response?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          placeholder="Correo electrónico" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Contraseña" 
          value={password}
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>
      </form>

      <div className="login-links">
        <p>
          ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
        <p>
          ¿Olvidaste tu contraseña? <Link to="/recuperar">Recupérala aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
