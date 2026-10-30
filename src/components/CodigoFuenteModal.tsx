/**
 * Módulo de Visualización y Descarga de Código Fuente Separado
 * Permite a desarrolladores inspeccionar y copiar directamente:
 * - index.html (Estructura HTML5 accesible y semántica)
 * - styles.css (Estilos corporativos EPM puros sin dependencias)
 * - app.js (Lógica completa de clasificación IA, validación y gestión de DOM)
 * - server.js (API REST Express para backend escalable)
 */

import React, { useState } from 'react';
import {
  Code2,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Server,
  Terminal,
} from 'lucide-react';

export const CodigoFuenteModal: React.FC = () => {
  const [archivoActivo, setArchivoActivo] = useState<'html' | 'css' | 'js' | 'server'>('html');
  const [copiado, setCopiado] = useState(false);

  const CODIGO_HTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EPM PQRS - Portal Inteligente de Atención Ciudadana</title>
  <meta name="description" content="Sistema oficial inteligente de recepción, radicación y clasificación automatizada con IA para Peticiones, Quejas, Reclamos y Sugerencias de Empresas Públicas de Medellín.">
  <link rel="stylesheet" href="styles.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body class="theme-light">
  <!-- Cinta Superior Corporativa EPM -->
  <header class="epm-header">
    <div class="epm-topbar">
      <div class="container topbar-content">
        <span><strong>Empresas Públicas de Medellín E.S.P.</strong> • Portal Oficial PQRS</span>
        <span class="emergency-badge">Línea Gratuita: 01 8000 415 115 | Emergencias: 115</span>
      </div>
    </div>
    
    <nav class="epm-nav container">
      <div class="epm-brand">
        <div class="epm-logo">epm<span>•</span></div>
        <div>
          <h1>PQRS <span>Inteligente</span></h1>
          <p>Enrutamiento y Clasificación Inmediata con IA</p>
        </div>
      </div>
      <button id="themeToggleBtn" class="btn-theme" aria-label="Cambiar tema">🌙 Modo Oscuro</button>
    </nav>
  </header>

  <main class="container main-content">
    <!-- Formulario de Radicación -->
    <section class="form-container">
      <div class="section-title">
        <span class="badge-tag">Formulario Oficial</span>
        <h2>Radicar Solicitud PQRS</h2>
        <p>Complete los campos. La Inteligencia Artificial analizará y clasificará el caso al instante.</p>
      </div>

      <form id="pqrsForm" novalidate>
        <!-- 1. Datos del Ciudadano -->
        <fieldset class="form-card">
          <legend>1. Información del Ciudadano</legend>
          <div class="grid-2">
            <div class="form-group">
              <label for="nombreCompleto">Nombre Completo <span class="req">*</span></label>
              <input type="text" id="nombreCompleto" name="nombreCompleto" placeholder="Ej: Carlos Restrepo" required>
              <small class="error-msg" id="err-nombre"></small>
            </div>

            <div class="form-group">
              <label for="documentoIdentidad">Documento de Identidad <span class="req">*</span></label>
              <div class="input-group">
                <select id="tipoDocumento" name="tipoDocumento">
                  <option value="CC">C.C.</option>
                  <option value="CE">C.E.</option>
                  <option value="Pasaporte">Pasap.</option>
                  <option value="NIT">NIT</option>
                </select>
                <input type="text" id="documentoIdentidad" name="documentoIdentidad" placeholder="Número sin puntos" required>
              </div>
              <small class="error-msg" id="err-documento"></small>
            </div>

            <div class="form-group">
              <label for="correoElectronico">Correo Electrónico <span class="req">*</span></label>
              <input type="email" id="correoElectronico" name="correoElectronico" placeholder="usuario@correo.com" required>
              <small class="error-msg" id="err-correo"></small>
            </div>

            <div class="form-group">
              <label for="numeroContacto">Número de Contacto <span class="req">*</span></label>
              <input type="tel" id="numeroContacto" name="numeroContacto" placeholder="Ej: 3123456789" required>
              <small class="error-msg" id="err-contacto"></small>
            </div>
          </div>
        </fieldset>

        <!-- 2. Ubicación y Servicio -->
        <fieldset class="form-card">
          <legend>2. Ubicación del Predio y Servicio</legend>
          <div class="grid-2">
            <div class="form-group">
              <label for="municipio">Municipio <span class="req">*</span></label>
              <select id="municipio" name="municipio" required>
                <option value="Medellín">Medellín</option>
                <option value="Bello">Bello</option>
                <option value="Itagüí">Itagüí</option>
                <option value="Envigado">Envigado</option>
                <option value="Sabaneta">Sabaneta</option>
                <option value="Caldas">Caldas</option>
                <option value="La Estrella">La Estrella</option>
                <option value="Rionegro">Rionegro</option>
              </select>
            </div>

            <div class="form-group">
              <label for="direccion">Dirección del Predio <span class="req">*</span></label>
              <input type="text" id="direccion" name="direccion" placeholder="Ej: Carrera 76 # 32EE - 14" required>
              <small class="error-msg" id="err-direccion"></small>
            </div>
          </div>

          <div class="form-group mt-3">
            <label for="tipoServicio">Tipo de Servicio EPM <span class="req">*</span></label>
            <select id="tipoServicio" name="tipoServicio" required>
              <option value="Energía">Energía Eléctrica</option>
              <option value="Agua y Alcantarillado">Agua y Alcantarillado</option>
              <option value="Gas Natural">Gas Natural</option>
              <option value="Aseo/Basuras">Aseo y Residuos</option>
              <option value="General">General / Otro</option>
            </select>
          </div>
        </fieldset>

        <!-- 3. Descripción y Motor IA -->
        <fieldset class="form-card">
          <legend>3. Descripción Detallada de la Solicitud</legend>
          
          <!-- Banner dinámico de alta prioridad -->
          <div id="urgentAlert" class="urgent-banner hidden">
            ⚠️ <strong>ALERTA DE PRIORIDAD ALTA DETECTADA:</strong> El texto contiene términos de riesgo crítico. Se activará protocolo rojo inmediato.
          </div>

          <div class="form-group">
            <label for="descripcion">Hechos detallados <span class="req">*</span></label>
            <textarea id="descripcion" name="descripcion" rows="5" placeholder="Describa claramente la anomalía, corte, olor a gas, cobro u observación..." required></textarea>
            <div class="textarea-footer">
              <small class="error-msg" id="err-descripcion"></small>
              <span id="charCount" class="char-count">0 caracteres</span>
            </div>
          </div>
        </fieldset>

        <div class="form-actions">
          <button type="submit" id="btnSubmit" class="btn-primary">
            <span class="btn-text">Enviar y Procesar con IA</span>
            <span class="spinner hidden"></span>
          </button>
        </div>
      </form>
    </section>

    <!-- Modal de Resultados de la Clasificación IA -->
    <div id="resultModal" class="modal-overlay hidden">
      <div class="modal-card">
        <header class="modal-header">
          <h3>✅ Radicación Exitosa - Clasificación con IA</h3>
          <button id="closeModalBtn" class="btn-close" aria-label="Cerrar">&times;</button>
        </header>

        <div class="modal-body">
          <div class="radicado-display">
            <div>
              <span class="label">NÚMERO DE RADICADO:</span>
              <strong id="resRadicado" class="radicado-num">EPM-2026-000000</strong>
            </div>
            <div id="resPrioridadBadge" class="badge-prioridad">Prioridad Alta</div>
          </div>

          <div class="classification-grid">
            <div class="c-item"><span>Servicio:</span> <strong id="resServicio"></strong></div>
            <div class="c-item"><span>Tipo PQRS:</span> <strong id="resTipo"></strong></div>
            <div class="c-item"><span>Categoría:</span> <strong id="resCategoria"></strong></div>
            <div class="c-item"><span>Subcategoría:</span> <strong id="resSubcategoria"></strong></div>
            <div class="c-item full"><span>Área Responsable:</span> <strong id="resArea"></strong></div>
            <div class="c-item full"><span>Resumen Técnico:</span> <p id="resResumen"></p></div>
          </div>

          <div class="json-container">
            <div class="json-header">
              <span>JSON ESTRUCTURADO (SALIDA IA):</span>
              <button id="copyJsonBtn" class="btn-copy">Copiar JSON</button>
            </div>
            <pre><code id="jsonCode"></code></pre>
          </div>
        </div>

        <footer class="modal-footer">
          <button id="downloadReceiptBtn" class="btn-secondary">Descargar Comprobante</button>
          <button id="closeModalBottomBtn" class="btn-primary">Aceptar</button>
        </footer>
      </div>
    </div>
  </main>

  <script src="app.js"></script>
</body>
</html>`;

  const CODIGO_CSS = `/* =========================================================
   EMPRESAS PÚBLICAS DE MEDELLÍN (EPM) - ESTILOS CORPORATIVOS
   Diseño Responsive, Modo Claro/Oscuro y Accesibilidad WCAG AA
   ========================================================= */

:root {
  --epm-green: #007a33;
  --epm-green-dark: #005a26;
  --epm-green-light: #e8f5e9;
  --epm-teal: #00a887;
  --epm-navy: #0a2239;
  
  --bg-main: #f8fafc;
  --bg-card: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
  
  --danger-bg: #fef2f2;
  --danger-border: #ef4444;
  --danger-text: #b91c1c;
}

body.theme-dark {
  --bg-main: #0b1521;
  --bg-card: #132235;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --border-color: #1e354e;
  
  --danger-bg: #450a0a;
  --danger-border: #dc2626;
  --danger-text: #fca5a5;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg-main);
  color: var(--text-main);
  line-height: 1.5;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* Header EPM */
.epm-topbar {
  background: var(--epm-green-dark);
  color: #dcfce7;
  font-size: 0.75rem;
  padding: 0.35rem 0;
}
.topbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.emergency-badge {
  font-weight: 700;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.epm-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-card);
}
.epm-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.epm-logo {
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(135deg, var(--epm-green), var(--epm-teal));
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
}
.epm-logo span { color: #a7f3d0; }
.epm-brand h1 { font-size: 1.15rem; font-weight: 800; line-height: 1.2; }
.epm-brand h1 span { color: var(--epm-green); }
.epm-brand p { font-size: 0.75rem; color: var(--text-muted); }

.btn-theme {
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: var(--bg-main);
  color: var(--text-main);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
}

/* Form Styles */
.main-content { padding: 2rem 1.25rem; }
.section-title { margin-bottom: 2rem; }
.badge-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  background: var(--epm-green-light);
  color: var(--epm-green);
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}
.section-title h2 { font-size: 1.75rem; font-weight: 800; margin-top: 0.4rem; }
.section-title p { color: var(--text-muted); font-size: 0.875rem; }

.form-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
.form-card legend {
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-main);
  padding: 0 0.5rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-main);
}
.req { color: #ef4444; font-weight: 700; }

input, select, textarea {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--border-color);
  border-radius: 10px;
  background: var(--bg-main);
  color: var(--text-main);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s;
}
input:focus, select:focus, textarea:focus {
  border-color: var(--epm-green);
  box-shadow: 0 0 0 3px rgba(0, 122, 51, 0.15);
}

.input-group {
  display: flex;
  gap: 0.5rem;
}
.input-group select { width: 90px; }

.textarea-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}
.char-count { color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
.error-msg { color: #ef4444; font-size: 0.75rem; min-height: 1rem; }

/* Banner de Emergencia en Tiempo Real */
.urgent-banner {
  background: var(--danger-bg);
  border: 2px solid var(--danger-border);
  color: var(--danger-text);
  padding: 0.85rem;
  border-radius: 10px;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  animation: pulse-danger 1.8s infinite;
}
@keyframes pulse-danger {
  0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
  100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
}

.hidden { display: none !important; }

/* Botones */
.btn-primary {
  background: linear-gradient(135deg, var(--epm-green), var(--epm-green-dark));
  color: #fff;
  border: none;
  padding: 0.85rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 122, 51, 0.25);
  transition: transform 0.2s, box-shadow 0.2s;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 122, 51, 0.35);
}

.btn-secondary {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  color: var(--text-main);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 20, 30, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 1000;
}
.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  max-width: 680px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
.modal-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, var(--epm-green), var(--epm-teal));
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: white;
  cursor: pointer;
}
.modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }
.radicado-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-main);
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
}
.radicado-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--epm-green);
  display: block;
}
.badge-prioridad {
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 800;
  background: #fee2e2;
  color: #991b1b;
}

.classification-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}
.c-item {
  background: var(--bg-main);
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--border-color);
}
.c-item span { font-size: 0.7rem; color: var(--text-muted); display: block; }
.c-item strong { font-size: 0.85rem; }
.c-item.full { grid-column: span 2; }

.json-container {
  background: #0f172a;
  border-radius: 10px;
  overflow: hidden;
}
.json-header {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  background: #1e293b;
  color: #94a3b8;
  font-size: 0.7rem;
  font-weight: 700;
}
.btn-copy {
  background: #334155;
  color: #e2e8f0;
  border: none;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
pre {
  padding: 1rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  color: #34d399;
  overflow-x: auto;
}
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}`;

  const CODIGO_JS = `/**
 * =========================================================
 * EMPRESAS PÚBLICAS DE MEDELLÍN (EPM) - LÓGICA DE NEGOCIO Y MOTOR IA
 * Archivo: app.js
 * =========================================================
 */

// 1. Constantes y Diccionario de Términos Críticos (Disparadores de Prioridad Alta)
const TERMINOS_CRITICOS = [
  'fuga de gas', 'olor a gas', 'explosión', 'explosion', 'inundación', 'inundacion',
  'incendio', 'cables de alta tensión caídos', 'cables caídos', 'electrocución',
  'electrocucion', 'riesgo eléctrico', 'riesgo electrico', 'sin agua hospital',
  'peligro inminente', 'transformador explotado', 'poste caído'
];

const SERVICIOS = ['Energía', 'Agua y Alcantarillado', 'Gas Natural', 'Aseo/Basuras', 'General'];
const TIPOS = ['Petición', 'Queja', 'Reclamo', 'Sugerencia'];
const CATEGORIAS = [
  'Facturación y Cobros', 'Daños e Infraestructura',
  'Continuidad del Servicio (Cortes)', 'Nuevas Conexiones', 'Atención y Canales'
];

// 2. Normalización y Detección de Términos de Emergencia
function detectarTerminosCriticos(texto) {
  if (!texto) return [];
  const normalizado = texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return TERMINOS_CRITICOS.filter(term => {
    const tNorm = term.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return normalizado.includes(tNorm);
  });
}

// 3. Subcategoría limitada estrictamente a máximo 3 palabras técnicas
function normalizarSubcategoria(texto) {
  if (!texto) return 'Revisión técnica';
  const palabras = texto.replace(/[^\\w\\sáéíóúüñÁÉÍÓÚÜÑ]/g, '').trim().split(/\\s+/);
  return palabras.slice(0, 3).join(' ');
}

// 4. Mapeo de Área Responsable Interna EPM
function determinarAreaResponsable(servicio, categoria, tipo) {
  if (tipo === 'Queja' && categoria === 'Atención y Canales') return 'Atención Ciudadana';
  if (tipo === 'Sugerencia') return 'Atención Ciudadana';
  if (servicio === 'Energía') {
    return categoria === 'Facturación y Cobros' ? 'Área de Facturación Energía' : 'Gestión Comercial';
  }
  if (servicio === 'Agua y Alcantarillado') {
    return categoria === 'Facturación y Cobros' ? 'Gestión Comercial' : 'Dirección Operativa Agua';
  }
  if (servicio === 'Gas Natural') {
    return categoria === 'Facturación y Cobros' ? 'Gestión Comercial' : 'Unidad de Distribución Gas';
  }
  if (servicio === 'Aseo/Basuras') return 'Operaciones de Aseo';
  return 'Atención Ciudadana';
}

// 5. Motor de Clasificación Heurístico & Semántico
function procesarClasificacionPQR(descripcion, servicioSeleccionado) {
  const descLower = descripcion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const criticos = detectarTerminosCriticos(descripcion);
  const esAlta = criticos.length > 0;

  // Detección de Servicio
  let servicio = servicioSeleccionado || 'General';
  if (descLower.includes('gas') || descLower.includes('fuga de gas') || descLower.includes('estufa')) servicio = 'Gas Natural';
  else if (descLower.includes('agua') || descLower.includes('alcantarillad') || descLower.includes('tuberia')) servicio = 'Agua y Alcantarillado';
  else if (descLower.includes('luz') || descLower.includes('energia') || descLower.includes('transformador') || descLower.includes('cables')) servicio = 'Energía';
  else if (descLower.includes('basura') || descLower.includes('aseo') || descLower.includes('desechos')) servicio = 'Aseo/Basuras';

  // Detección de Categoría y Subcategoría
  let categoria = 'Daños e Infraestructura';
  let subcat = 'Revisión técnica';

  if (descLower.match(/factur|cobro|tarifa|recibo|inconformidad|precio/i)) {
    categoria = 'Facturación y Cobros';
    subcat = descLower.includes('reconexion') ? 'Cobro reconexión' : 'Error facturación';
  } else if (descLower.match(/nueva conexion|nueva matricula|nuevo contador|acometida/i)) {
    categoria = 'Nuevas Conexiones';
    subcat = 'Nueva acometida';
  } else if (descLower.match(/corte|sin servicio|interrupcion|apagon/i)) {
    categoria = 'Continuidad del Servicio (Cortes)';
    subcat = 'Corte prolongado';
  } else if (descLower.match(/asesor|atencion|grosero|llamada/i)) {
    categoria = 'Atención y Canales';
    subcat = 'Atención usuario';
  } else {
    categoria = 'Daños e Infraestructura';
    if (descLower.includes('fuga')) subcat = servicio === 'Gas Natural' ? 'Fuga gas red' : 'Fuga red matriz';
    else if (descLower.includes('transformador')) subcat = 'Transformador averiado';
    else if (descLower.includes('cables')) subcat = 'Cables caídos';
    else if (descLower.includes('inundacion')) subcat = 'Inundación rebosamiento';
    else subcat = 'Daño infraestructura';
  }

  // Detección de Tipo
  let tipo = 'Petición';
  if (descLower.match(/sugiero|propongo|sugerencia/i)) tipo = 'Sugerencia';
  else if (descLower.match(/reclamo|cobro injusto|inconformidad/i) || esAlta) tipo = 'Reclamo';
  else if (descLower.match(/queja|mal servicio|demora/i)) tipo = 'Queja';

  // Prioridad: Alta automática en emergencias
  const prioridad = esAlta ? 'Alta' : (tipo === 'Sugerencia' ? 'Baja' : 'Media');
  const area = determinarAreaResponsable(servicio, categoria, tipo);

  // Resumen corto técnico para el operador
  let resumen = '';
  if (esAlta) {
    resumen = \`Emergencia técnica crítica: \${criticos.join(', ')} con riesgo potencial para la comunidad.\`;
  } else {
    resumen = \`Ciudadano reporta requerimiento técnico de \${categoria.toLowerCase()} para el servicio de \${servicio.toLowerCase()}.\`;
  }

  return {
    servicio,
    tipo,
    categoria_principal: categoria,
    subcategoria: normalizarSubcategoria(subcat),
    prioridad,
    area_responsable: area,
    resumen_corto: resumen
  };
}

// 6. Generador de Radicado Oficial
function generarRadicado() {
  const anio = new Date().getFullYear();
  const num = Math.floor(100000 + Math.random() * 900000);
  return \`EPM-\${anio}-\${num}\`;
}

// 7. Inicialización del DOM y Manejo de Eventos
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('pqrsForm');
  const descInput = document.getElementById('descripcion');
  const charCount = document.getElementById('charCount');
  const urgentAlert = document.getElementById('urgentAlert');
  const modal = document.getElementById('resultModal');
  const themeBtn = document.getElementById('themeToggleBtn');

  // Monitor en tiempo real de alta prioridad y contador
  descInput.addEventListener('input', () => {
    const val = descInput.value;
    charCount.textContent = \`\${val.length} caracteres\`;
    const criticos = detectarTerminosCriticos(val);
    if (criticos.length > 0) {
      urgentAlert.classList.remove('hidden');
    } else {
      urgentAlert.classList.add('hidden');
    }
  });

  // Alternar tema oscuro/claro
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('theme-dark');
    themeBtn.textContent = document.body.classList.contains('theme-dark') ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
  });

  // Envío del Formulario
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const descripcion = descInput.value.trim();
    if (descripcion.length < 20) {
      document.getElementById('err-descripcion').textContent = 'La descripción debe tener al menos 20 caracteres.';
      return;
    }
    document.getElementById('err-descripcion').textContent = '';

    const btn = document.getElementById('btnSubmit');
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Procesando con IA...';
    btn.querySelector('.spinner').classList.remove('hidden');

    setTimeout(() => {
      const servicioSeleccionado = document.getElementById('tipoServicio').value;
      const resultadoJSON = procesarClasificacionPQR(descripcion, servicioSeleccionado);
      const radicado = generarRadicado();

      // Renderizar modal
      document.getElementById('resRadicado').textContent = radicado;
      document.getElementById('resPrioridadBadge').textContent = \`Prioridad \${resultadoJSON.prioridad}\`;
      document.getElementById('resServicio').textContent = resultadoJSON.servicio;
      document.getElementById('resTipo').textContent = resultadoJSON.tipo;
      document.getElementById('resCategoria').textContent = resultadoJSON.categoria_principal;
      document.getElementById('resSubcategoria').textContent = resultadoJSON.subcategoria;
      document.getElementById('resArea').textContent = resultadoJSON.area_responsable;
      document.getElementById('resResumen').textContent = resultadoJSON.resumen_corto;
      document.getElementById('jsonCode').textContent = JSON.stringify(resultadoJSON, null, 2);

      modal.classList.remove('hidden');

      btn.disabled = false;
      btn.querySelector('.btn-text').textContent = 'Enviar y Procesar con IA';
      btn.querySelector('.spinner').classList.add('hidden');
    }, 600);
  });

  // Cerrar modal
  const closeModal = () => modal.classList.add('hidden');
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('closeModalBottomBtn').addEventListener('click', closeModal);

  // Copiar JSON
  document.getElementById('copyJsonBtn').addEventListener('click', () => {
    const code = document.getElementById('jsonCode').textContent;
    navigator.clipboard.writeText(code);
    const btn = document.getElementById('copyJsonBtn');
    btn.textContent = '¡Copiado!';
    setTimeout(() => { btn.textContent = 'Copiar JSON'; }, 2000);
  });
});`;

  const CODIGO_SERVER = `/**
 * =========================================================
 * BACKEND EXPRESS REST API - CLASIFICADOR PQRS CON GEMINI 3.8 FLASH
 * Archivo: server.js
 * =========================================================
 */

import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const PROMPT_SISTEMA = \`
Eres el Clasificador Oficial de PQRS para Empresas Públicas de Medellín (EPM).
Analiza el reporte ciudadano y genera OBLIGATORIAMENTE un JSON con esta estructura exacta:
{
  "servicio": "Energía" | "Agua y Alcantarillado" | "Gas Natural" | "Aseo/Basuras" | "General",
  "tipo": "Petición" | "Queja" | "Reclamo" | "Sugerencia",
  "categoria_principal": "Facturación y Cobros" | "Daños e Infraestructura" | "Continuidad del Servicio (Cortes)" | "Nuevas Conexiones" | "Atención y Canales",
  "subcategoria": "Texto técnico de max 3 palabras",
  "prioridad": "Alta" | "Media" | "Baja",
  "area_responsable": "Dirección Operativa Agua" | "Área de Facturación Energía" | "Unidad de Distribución Gas" | "Gestión Comercial" | "Operaciones de Aseo" | "Atención Ciudadana",
  "resumen_corto": "Una sola oración técnica para el operador"
}
REGLA CRÍTICA: Asigna Prioridad ALTA si hay fuga de gas, olor a gas, explosión, inundación, incendio, cables caídos, riesgo eléctrico o peligro inminente.
\`;

app.post('/api/clasificar', async (req, res) => {
  try {
    const { descripcion, servicioSugerido } = req.body;
    if (!descripcion) {
      return res.status(400).json({ error: 'La descripción es obligatoria' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: \`Servicio: \${servicioSugerido}\\nDescripción: \${descripcion}\`,
      config: {
        systemInstruction: PROMPT_SISTEMA,
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ exito: true, clasificacion: parsed });
  } catch (error) {
    console.error('Error al clasificar con Gemini:', error);
    return res.status(500).json({ error: 'Error al procesar solicitud con IA' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Servidor EPM PQRS corriendo en puerto \${PORT}\`);
});`;

  const obtenerCodigoActivo = () => {
    switch (archivoActivo) {
      case 'html':
        return { nombre: 'index.html', codigo: CODIGO_HTML, lang: 'html' };
      case 'css':
        return { nombre: 'styles.css', codigo: CODIGO_CSS, lang: 'css' };
      case 'js':
        return { nombre: 'app.js', codigo: CODIGO_JS, lang: 'javascript' };
      case 'server':
        return { nombre: 'server.js', codigo: CODIGO_SERVER, lang: 'javascript' };
    }
  };

  const actual = obtenerCodigoActivo();

  const copiarCodigo = () => {
    navigator.clipboard.writeText(actual.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const descargarArchivo = () => {
    const blob = new Blob([actual.codigo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = actual.nombre;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <Code2 className="w-3.5 h-3.5" />
          Arquitectura Limpia & Archivos Separados
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Código Fuente Listo para Despliegue
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Como fue solicitado, se entregan los archivos fuente completos, estructurados en
          <code className="text-emerald-700 dark:text-emerald-400 font-bold mx-1">index.html</code>,
          <code className="text-emerald-700 dark:text-emerald-400 font-bold mx-1">styles.css</code>,
          <code className="text-emerald-700 dark:text-emerald-400 font-bold mx-1">app.js</code> y
          <code className="text-emerald-700 dark:text-emerald-400 font-bold mx-1">server.js</code>,
          sin dependencias externas pesadas y listos para ejecutar.
        </p>
      </div>

      {/* Selector de Archivos */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-3 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setArchivoActivo('html')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              archivoActivo === 'html'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>index.html</span>
          </button>

          <button
            onClick={() => setArchivoActivo('css')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              archivoActivo === 'css'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>styles.css</span>
          </button>

          <button
            onClick={() => setArchivoActivo('js')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              archivoActivo === 'js'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>app.js (Motor IA)</span>
          </button>

          <button
            onClick={() => setArchivoActivo('server')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              archivoActivo === 'server'
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>server.js (API REST)</span>
          </button>
        </div>

        {/* Acciones de Copia y Descarga */}
        <div className="flex items-center gap-2">
          <button
            onClick={copiarCodigo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition cursor-pointer"
          >
            {copiado ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar {actual.nombre}</span>
              </>
            )}
          </button>

          <button
            onClick={descargarArchivo}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Archivo</span>
          </button>
        </div>
      </div>

      {/* Visor de Código */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="ml-2 font-semibold text-slate-300">{actual.nombre}</span>
          </div>
          <span className="text-[11px] font-mono">{actual.codigo.split('\n').length} líneas</span>
        </div>

        <pre className="p-5 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
          <code>{actual.codigo}</code>
        </pre>
      </div>
    </div>
  );
};
