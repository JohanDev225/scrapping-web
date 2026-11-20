import { Link, Navigate } from 'react-router-dom';
import { useApp } from '../context.jsx';
import TablaJson from '../TablaJson.jsx';

const ETIQUETAS = {
  nombre: 'Nombre', email: 'Correo', telefono: 'Teléfono', fechaRadicacion: 'Fecha de radicación',
  cantidad: 'Cantidad de documentos', observaciones: 'Observaciones', tipoPersona: 'Tipo de persona',
  intereses: 'Intereses', aceptaTerminos: 'Acepta términos', tipoDocumento: 'Tipo de documento',
  ciudad: 'Ciudad', prioridad: 'Prioridad', canal: 'Canal de respuesta',
};

export default function Reporte() {
  const { reporte } = useApp();
  if (!reporte) return <Navigate to="/formulario" replace />;
  const { formulario, zip, enviadoEn } = reporte;
  const val = (v) =>
    Array.isArray(v) ? v.join(', ') || '—' : typeof v === 'boolean' ? (v ? 'Sí' : 'No') : v || '—';

  return (
    <div className="card" id="reporte">
      <h2>Reporte de envío</h2>
      <p className="ok" role="status">✔ Formulario enviado correctamente</p>
      <p className="muted">Enviado: {new Date(enviadoEn).toLocaleString('es-CO')}</p>

      <h3>Datos del formulario</h3>
      <table>
        <tbody>
          {Object.keys(ETIQUETAS).map((k) => (
            <tr key={k}><th>{ETIQUETAS[k]}</th><td>{val(formulario[k])}</td></tr>
          ))}
        </tbody>
      </table>

      <h3>Archivo cargado</h3>
      <p><strong>{zip.nombreZip}</strong> ({zip.nombreJson}, {zip.nombreTxt})</p>
      <h2 id="reporte-titulo">{zip.titulo}</h2>
      <TablaJson datos={zip.datos} />

      <div className="fila fin">
        <Link id="btn-nuevo" to="/paso/1" className="btn primary">Volver al inicio</Link>
      </div>
    </div>
  );
}
