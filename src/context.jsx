import { createContext, useContext, useState } from 'react';

// Credenciales "quemadas" para pruebas
export const USUARIO = 'usuario1@correo.com';
export const CLAVE = 'scrapingtest2026*';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [auth, setAuth] = useState(() => sessionStorage.getItem('auth') === '1');
  const [reporte, setReporte] = useState(null);

  const login = (u, p) => {
    if (u.trim() === USUARIO && p === CLAVE) {
      sessionStorage.setItem('auth', '1');
      setAuth(true);
      return true;
    }
    return false;
  };
  const logout = () => {
    sessionStorage.removeItem('auth');
    setAuth(false);
    setReporte(null);
  };

  return <Ctx.Provider value={{ auth, login, logout, reporte, setReporte }}>{children}</Ctx.Provider>;
}
