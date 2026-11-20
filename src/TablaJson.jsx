// Muestra un JSON (arreglo de objetos u objeto) como tabla.
export default function TablaJson({ datos }) {
  let filas;
  if (Array.isArray(datos)) {
    filas = datos.map((d) => (d !== null && typeof d === 'object' && !Array.isArray(d) ? d : { valor: d }));
  } else if (datos && typeof datos === 'object') {
    filas = Object.entries(datos).map(([clave, valor]) => ({ clave, valor }));
  } else {
    filas = [{ valor: datos }];
  }
  const cols = [...new Set(filas.flatMap((r) => Object.keys(r)))];
  const fmt = (v) => (v !== null && typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''));

  if (!filas.length) return <p className="muted">JSON vacío</p>;
  return (
    <div className="tabla-wrap">
      <table id="tabla-json">
        <thead>
          <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {filas.map((r, i) => (
            <tr key={i}>{cols.map((c) => <td key={c}>{fmt(r[c])}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
