import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useApp } from '../context.jsx';

export default function Login() {
  const { auth, login } = useApp();
  const nav = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  if (auth) return <Navigate to="/paso/1" replace />;

  const enviar = (e) => {
    e.preventDefault();
    if (login(usuario, clave)) nav('/paso/1');
    else setError('Usuario o contraseña incorrectos');
  };

  return (
    <div className="login-wrap">
      <form className="card login" onSubmit={enviar}>
        <h1>Iniciar sesión</h1>
        <label htmlFor="usuario">Usuario</label>
        <input id="usuario" name="usuario" type="email" autoComplete="username"
          value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
        <label htmlFor="clave">Contraseña</label>
        <input id="clave" name="clave" type="password" autoComplete="current-password"
          value={clave} onChange={(e) => setClave(e.target.value)} required />
        {error && <p className="error" role="alert">{error}</p>}
        <button id="btn-ingresar" type="submit" className="btn primary">Ingresar</button>
      </form>
    </div>
  );
}
