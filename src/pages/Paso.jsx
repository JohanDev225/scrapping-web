import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';

// Cada pestaña ubica su botón real en un lugar distinto de la pantalla.
const POSICION = { 1: 'pos-derecha-abajo', 2: 'pos-izquierda-abajo', 3: 'pos-centro', 4: 'pos-derecha-arriba' };
const COLOR = { 1: 'azul', 2: 'verde', 3: 'azul', 4: 'azul' };
const TEXTO = {
  1: 'Bienvenido. Para avanzar use el botón azul de la esquina inferior derecha.',
  2: 'Segunda pestaña. El botón verde correcto está abajo a la izquierda.',
  3: 'Tercera pestaña. El botón correcto está en el centro de la pantalla.',
  4: 'Última pestaña. El botón correcto está arriba a la derecha y lleva al formulario.',
};
// Textos distintos para el botón real (un bot no puede depender de una sola palabra).
const ETIQUETA_REAL = { 1: 'Continuar al paso 2', 2: 'Seguir', 3: 'Avanzar →', 4: 'Ir al formulario' };

const SENUELOS = [
  'Siguiente', 'Continuar', 'Avanzar', 'Ir al formulario', 'Siguiente paso', 'Seguir', 'Finalizar', 'Aceptar',
];

const FAQ = [
  ['¿Cómo avanzo a la siguiente pestaña?', 'Pulse el botón principal. Ignore los botones de colores de la publicidad.'],
  ['¿Por qué hay varios botones "Siguiente"?', 'Solo uno es real. Los demás son anuncios y no hacen nada útil.'],
  ['¿Puedo saltarme una pestaña?', 'No. El sistema valida el orden de las pestañas.'],
  ['¿Qué pasa si no avanzo?', 'Su sesión permanece activa durante 30 minutos.'],
];

const FILAS_RUIDO = Array.from({ length: 6 }, (_, i) => ({
  ref: `NOT-${1000 + i}`, asunto: ['Mantenimiento', 'Actualización', 'Aviso legal', 'Promoción', 'Soporte', 'Novedad'][i],
  estado: ['Leído', 'Nuevo', 'Archivado'][i % 3],
}));

export default function Paso() {
  const { n } = useParams();
  const num = Number(n);
  const valido = [1, 2, 3, 4].includes(num);

  const [cookies, setCookies] = useState(true);
  const [modal, setModal] = useState(false);
  const [realListo, setRealListo] = useState(false);
  const [subtab, setSubtab] = useState(0);
  const [aviso, setAviso] = useState('');
  const [abierto, setAbierto] = useState(null);

  // Reinicia el estado "ruidoso" al cambiar de pestaña.
  useEffect(() => {
    setCookies(true);
    setModal(false);
    setRealListo(false);
    setSubtab(0);
    setAviso('');
    setAbierto(null);
    const t1 = setTimeout(() => setModal(true), 1200);   // modal que bloquea la pantalla
    const t2 = setTimeout(() => setRealListo(true), 1800); // botón real aparece tarde
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [num]);

  if (!valido) return <Navigate to="/paso/1" replace />;
  const destino = num === 4 ? '/formulario' : `/paso/${num + 1}`;

  // Señuelos: botones/enlaces que parecen el real pero no avanzan.
  const senuelos = SENUELOS.slice(num % 3, (num % 3) + 5);
  const clickSenuelo = (e, txt) => {
    e.preventDefault();
    setAviso(`"${txt}" es un anuncio. No avanza de pestaña.`);
  };

  return (
    <section className="paso">
      <h2>Pestaña {num} de 4</h2>
      <p>{TEXTO[num]}</p>
      {aviso && <p className="aviso" role="status">{aviso}</p>}

      {/* Banner publicitario con botón engañoso */}
      <div className="banner-ad" role="complementary" aria-label="Publicidad">
        <span className="ad-tag">Publicidad</span>
        <strong>¡Gane premios hoy!</strong>
        <a href="#premio" className="btn ad" onClick={(e) => clickSenuelo(e, 'Siguiente')}>Siguiente</a>
      </div>

      {/* Sub-pestañas internas con contenido parecido */}
      <div className="subtabs" role="tablist">
        {['Resumen', 'Detalle', 'Historial', 'Ayuda'].map((s, i) => (
          <button key={s} role="tab" aria-selected={subtab === i}
            className={'subtab' + (subtab === i ? ' on' : '')} onClick={() => setSubtab(i)}>{s}</button>
        ))}
      </div>
      <div className="subpanel">
        {subtab === 0 && <p>Resumen de la pestaña {num}. Estado: pendiente. No hay acciones disponibles aquí.</p>}
        {subtab === 1 && (
          <p>Detalle técnico. <a href="#detalle" onClick={(e) => clickSenuelo(e, 'Continuar')}>Continuar</a> leyendo la documentación.</p>
        )}
        {subtab === 2 && (
          <div className="tabla-wrap">
            <table>
              <thead><tr><th>Ref</th><th>Asunto</th><th>Estado</th><th>Acción</th></tr></thead>
              <tbody>
                {FILAS_RUIDO.map((r) => (
                  <tr key={r.ref}>
                    <td>{r.ref}</td><td>{r.asunto}</td><td>{r.estado}</td>
                    <td><button className="btn ghost chico" onClick={(e) => clickSenuelo(e, 'Avanzar')}>Avanzar</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {subtab === 3 && <p>Ayuda: llame al soporte. Este panel no contiene el botón que busca.</p>}
      </div>

      {/* Botones señuelo */}
      <div className="senuelos">
        {senuelos.map((t, i) => (
          <button key={t + i} type="button" className={`btn ${['ad', 'ghost', 'ad-alt', ''][i % 4]}`}
            onClick={(e) => clickSenuelo(e, t)}>{t}</button>
        ))}
      </div>

      {/* FAQ con instrucciones contradictorias */}
      <div className="faq">
        {FAQ.map(([q, a], i) => (
          <div key={q}>
            <button className="faq-q" aria-expanded={abierto === i} onClick={() => setAbierto(abierto === i ? null : i)}>
              {abierto === i ? '▼' : '▶'} {q}
            </button>
            {abierto === i && <p className="faq-a">{a}</p>}
          </div>
        ))}
      </div>

      {/* Texto largo de relleno */}
      <p className="muted relleno">
        Aviso legal: la información de esta pantalla es de carácter informativo. Para continuar, siga las
        instrucciones del encabezado de la pestaña. Cualquier botón con la palabra «Siguiente» fuera del área
        principal corresponde a contenido de terceros. Versión del portal 2026.{num}.{num * 7}.
      </p>

      {/* Trampas ocultas (honeypot): enlaces que un humano nunca ve */}
      <a href="/paso/1" className="oculto-display" id={`trampa-${num}-a`}>Siguiente</a>
      <a href="/login" className="oculto-fuera" aria-hidden="true" tabIndex={-1}>Ir al formulario</a>
      <button type="button" className="oculto-opaco" tabIndex={-1} onClick={(e) => clickSenuelo(e, 'Continuar')}>Continuar</button>

      {/* Botón real: aparece con retraso y en una posición distinta por pestaña */}
      {realListo && (
        <Link id={`btn-paso-${num}`} data-accion="avanzar" to={destino}
          className={`btn primary flotante ${COLOR[num] === 'verde' ? 'verde' : ''} ${POSICION[num]}`}>
          {ETIQUETA_REAL[num]}
        </Link>
      )}

      {/* Modal que tapa la pantalla hasta cerrarlo */}
      {modal && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Suscripción">
          <div className="modal">
            <h3>¿Quiere recibir ofertas?</h3>
            <p>Suscríbase a nuestro boletín y reciba promociones.</p>
            <div className="fila fin">
              <button className="btn ad" onClick={(e) => clickSenuelo(e, 'Aceptar')}>Aceptar</button>
              <button id="cerrar-modal" className="btn ghost" onClick={() => setModal(false)}>Ahora no</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner de cookies fijo al pie */}
      {cookies && (
        <div className="cookies" role="region" aria-label="Cookies">
          Usamos cookies para mejorar su experiencia.
          <button className="btn chico" onClick={() => setCookies(false)}>Aceptar cookies</button>
          <button className="btn ghost chico" onClick={() => setCookies(false)}>Rechazar</button>
        </div>
      )}
    </section>
  );
}
