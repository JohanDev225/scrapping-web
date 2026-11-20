import { Navigate, Route, Routes } from 'react-router-dom';
import { useApp } from './context.jsx';
import Layout from './Layout.jsx';
import Login from './pages/Login.jsx';
import Paso from './pages/Paso.jsx';
import Formulario from './pages/Formulario.jsx';
import Reporte from './pages/Reporte.jsx';

function Protegida({ children }) {
  const { auth } = useApp();
  return auth ? <Layout>{children}</Layout> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/paso/:n" element={<Protegida><Paso /></Protegida>} />
      <Route path="/formulario" element={<Protegida><Formulario /></Protegida>} />
      <Route path="/reporte" element={<Protegida><Reporte /></Protegida>} />
      <Route path="*" element={<Navigate to="/paso/1" replace />} />
    </Routes>
  );
}
