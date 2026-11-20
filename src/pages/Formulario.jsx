import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import { useApp } from '../context.jsx';
import TablaJson from '../TablaJson.jsx';

const SELECTS = [
  { name: 'tipoDocumento', label: 'Tipo de documento', opciones: ['Cédula de ciudadanía', 'Pasaporte', 'NIT', 'Cédula de extranjería'] },
  { name: 'ciudad', label: 'Ciudad', opciones: ['Bogotá', 'Medellín', 'Cali', 'Barranquilla'] },
  { name: 'prioridad', label: 'Prioridad', opciones: ['Baja', 'Media', 'Alta', 'Urgente'] },
  { name: 'canal', label: 'Canal de respuesta', opciones: ['Correo', 'Teléfono', 'Presencial', 'Mensajería'] },
];

const inicial = {
  nombre: '', email: '', telefono: '', fechaRadicacion: '', cantidad: 1,
  observaciones: '', tipoPersona: '', intereses: [], aceptaTerminos: false,
  tipoDocumento: '', ciudad: '', prioridad: '', canal: '',
};

export default function Formulario() {
  const nav = useNavigate();
  const { setReporte } = useApp();
  const [f, setF] = useState(inicial);
  const [zip, setZip] = useState(null); // { nombreZip, nombreJson, nombreTxt, titulo, datos }
  const [errZip, setErrZip] = useState('');
  const inputRef = useRef(null);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const onChange = (e) => {
    const { name, type, value, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  };
  const toggleInteres = (v) =>
    set('intereses', f.intereses.includes(v) ? f.intereses.filter((x) => x !== v) : [...f.intereses, v]);

  const cargarZip = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrZip('');
    setZip(null);
    try {
      const z = await JSZip.loadAsync(file);
      const archivos = Object.values(z.files).filter((x) => !x.dir && !x.name.startsWith('__MACOSX'));
      const jsonF = archivos.find((x) => x.name.toLowerCase().endsWith('.json'));
      const txtF = archivos.find((x) => x.name.toLowerCase().endsWith('.txt'));
      if (!jsonF || !txtF) throw new Error('El .zip debe contener un .json y un .txt');
      const datos = JSON.parse(await jsonF.async('string'));
      const titulo = (await txtF.async('string')).trim();
      setZip({ nombreZip: file.name, nombreJson: jsonF.name, nombreTxt: txtF.name, titulo, datos });
    } catch (err) {
      setErrZip(err.message || 'No se pudo leer el .zip');
    }
    e.target.value = '';
  };

  const selectsLlenos = SELECTS.every((s) => f[s.name]);
  const puedeEnviar = Boolean(zip) && selectsLlenos;

  const enviar = (e) => {
    e.preventDefault();
    if (!puedeEnviar) return;
    setReporte({ enviadoEn: new Date().toISOString(), formulario: f, zip });
    nav('/reporte');
  };

  return (
    <form className="card" onSubmit={enviar}>
      <h2>Formulario de radicación</h2>

      <div className="grid">
        <div>
          <label htmlFor="nombre">Nombre completo</label>
          <input id="nombre" name="nombre" type="text" value={f.nombre} onChange={onChange} />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico</label>
          <input id="email" name="email" type="email" value={f.email} onChange={onChange} />
        </div>
        <div>
          <label htmlFor="telefono">Teléfono</label>
          <input id="telefono" name="telefono" type="tel" value={f.telefono} onChange={onChange} />
        </div>
        <div>
          <label htmlFor="fechaRadicacion">Fecha de radicación</label>
          <input id="fechaRadicacion" name="fechaRadicacion" type="date" value={f.fechaRadicacion} onChange={onChange} />
        </div>
        <div>
          <label htmlFor="cantidad">Cantidad de documentos</label>
          <input id="cantidad" name="cantidad" type="number" min="1" max="99" value={f.cantidad} onChange={onChange} />
        </div>
      </div>

      <label htmlFor="observaciones">Observaciones</label>
      <textarea id="observaciones" name="observaciones" rows="3" value={f.observaciones} onChange={onChange} />

      <fieldset>
        <legend>Tipo de persona</legend>
        {['Natural', 'Jurídica'].map((v) => (
          <label key={v} className="inline">
            <input type="radio" name="tipoPersona" value={v} checked={f.tipoPersona === v} onChange={onChange} /> {v}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Intereses</legend>
        {['Facturación', 'Soporte', 'Reclamos'].map((v) => (
          <label key={v} className="inline">
            <input type="checkbox" name="intereses" value={v} checked={f.intereses.includes(v)} onChange={() => toggleInteres(v)} /> {v}
          </label>
        ))}
      </fieldset>

      <label className="inline">
        <input type="checkbox" name="aceptaTerminos" checked={f.aceptaTerminos} onChange={onChange} /> Acepto términos y condiciones
      </label>

      <hr />
      <h3>Archivo .zip (contiene un .json y un .txt)</h3>
      <input ref={inputRef} id="archivo-zip" type="file" accept=".zip" hidden onChange={cargarZip} />
      <div className="fila">
        <button id="btn-cargar-zip" type="button" className="btn" onClick={() => inputRef.current?.click()}>
          Cargar .zip
        </button>
        <button id="btn-zip-ejemplo" type="button" className="btn ghost" onClick={descargarEjemplo}>
          Descargar .zip de ejemplo
        </button>
      </div>
      {errZip && <p className="error" role="alert">{errZip}</p>}

      {zip && (
        <div className="zip-resultado" id="zip-resultado">
          <h2 id="zip-titulo">{zip.titulo}</h2>
          <p className="muted">{zip.nombreZip} · {zip.nombreJson} · {zip.nombreTxt}</p>
          <TablaJson datos={zip.datos} />

          <h3>Selecciona las opciones</h3>
          <div className="grid">
            {SELECTS.map((s) => (
              <div key={s.name}>
                <label htmlFor={s.name}>{s.label}</label>
                <select id={s.name} name={s.name} value={f[s.name]} onChange={onChange}>
                  <option value="">-- Seleccione --</option>
                  {s.opciones.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="fila fin">
        <button id="btn-enviar" type="submit" className="btn primary" disabled={!puedeEnviar}>Enviar</button>
      </div>
    </form>
  );
}

async function descargarEjemplo() {
  const z = new JSZip();
  z.file('datos.json', JSON.stringify([
    { id: 1, radicado: 'RAD-001', cliente: 'Ana Pérez', valor: 150000, estado: 'Pendiente' },
    { id: 2, radicado: 'RAD-002', cliente: 'Luis Gómez', valor: 320000, estado: 'Aprobado' },
    { id: 3, radicado: 'RAD-003', cliente: 'Marta Ruiz', valor: 87000, estado: 'Rechazado' },
  ], null, 2));
  z.file('titulo.txt', 'Reporte de radicaciones de prueba');
  const blob = await z.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'ejemplo.zip';
  a.click();
  URL.revokeObjectURL(a.href);
}
