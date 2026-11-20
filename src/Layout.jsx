import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from './context.jsx';

const TABS = [
  { to: '/paso/1', label: 'Pestaña 1' },
  { to: '/paso/2', label: 'Pestaña 2' },
  { to: '/paso/3', label: 'Pestaña 3' },
  { to: '/paso/4', label: 'Pestaña 4' },
];

export default function Layout({ children }) {
  const { logout } = useApp();
  const nav = useNavigate();
  return (
    <div className="app">
      <header className="topbar">
        <strong>Portal de pruebas</strong>
        <nav className="tabs">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
              {t.label}
            </NavLink>
          ))}
        </nav>
        <button id="btn-salir" className="btn ghost" onClick={() => { logout(); nav('/login'); }}>
          Cerrar sesión
        </button>
      </header>
      <main className="content">{children}</main>
    </div>
  );
}
