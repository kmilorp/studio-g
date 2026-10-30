/**
 * Formulario de radicación de PQRS de EPM con validaciones en tiempo real,
 * detección de emergencias y procesamiento inteligente con IA.
 */

import React, { useState, useMemo } from 'react';
import {
  Send,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Zap,
  Droplet,
  Flame,
  Trash2,
  Layers,
  MapPin,
  Mail,
  Phone,
  User,
  CreditCard,
  FileText,
  RotateCcw,
  ShieldAlert,
} from 'lucide-react';
import {
  clasificarSolicitudPQRS,
  detectarTerminosCriticos,
} from '../services/aiClassifier';
import { generarNumeroRadicado, guardarNuevoRadicado } from '../services/storage';
import {
  PQRRecord,
  Servicio,
  TipoDocumento,
  ClasificacionResult,
} from '../types';

interface FormularioPQRSProps {
  onRadicadoExitoso: (nuevoRegistro: PQRRecord, resultadoIA: ClasificacionResult) => void;
}

const MUNICIPIOS_ANTIOQUIA = [
  'Medellín',
  'Bello',
  'Itagüí',
  'Envigado',
  'Sabaneta',
  'Caldas',
  'La Estrella',
  'Copacabana',
  'Girardota',
  'Barbosa',
  'Rionegro',
  'Guarne',
  'Marinilla',
  'Apartadó',
  'Caucasia',
  'Santa Fe de Antioquia',
];

const SERVICIOS_OPCIONES: { id: Servicio; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: 'Energía', label: 'Energía Eléctrica', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
  { id: 'Agua y Alcantarillado', label: 'Agua y Alcantarillado', icon: Droplet, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
  { id: 'Gas Natural', label: 'Gas Natural', icon: Flame, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
  { id: 'Aseo/Basuras', label: 'Aseo y Residuos', icon: Trash2, color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800' },
  { id: 'General', label: 'General / Otro', icon: Layers, color: 'text-slate-600 bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700' },
];

const CASOS_EJEMPLO = [
  {
    titulo: '🚨 Emergencia: Fuga de gas',
    servicio: 'Gas Natural' as Servicio,
    municipio: 'Medellín',
    direccion: 'Carrera 65 # 48 - 20, Barrio Suramericana',
    desc: 'Hay un fuerte olor a gas y una fuga de gas en el medidor principal del edificio. Se escucha un silbido continuo y hay peligro inminente para las familias.',
  },
  {
    titulo: '⚡ Reclamo: Facturación energía',
    servicio: 'Energía' as Servicio,
    municipio: 'Envigado',
    direccion: 'Calle 37 Sur # 40 - 15',
    desc: 'Presento reclamo formal por error en facturación. El consumo habitual es de 120 kWh y la factura llegó por 580 kWh con un cobro excesivo injustificado.',
  },
  {
    titulo: '💧 Daño: Tubo matriz roto',
    servicio: 'Agua y Alcantarillado' as Servicio,
    municipio: 'Bello',
    direccion: 'Diagonal 52 # 38 - 10, Cabañas',
    desc: 'Tubo matriz roto en plena vía pública que está provocando una grave inundación en la calzada y los sótanos de las viviendas aledañas. Sin agua en todo el sector.',
  },
  {
    titulo: '🔌 Riesgo: Cables caídos',
    servicio: 'Energía' as Servicio,
    municipio: 'Itagüí',
    direccion: 'Carrera 50 # 44 - 12',
    desc: 'Cables de alta tensión caídos sobre la acera tras tormenta eléctrica. El transformador explotado echó chispas y hay riesgo eléctrico severo.',
  },
  {
    titulo: '📋 Petición: Nueva conexión',
    servicio: 'Gas Natural' as Servicio,
    municipio: 'Sabaneta',
    direccion: 'Calle 77 Sur # 46 - 30',
    desc: 'Solicito trámite de nueva matrícula y acometida para instalación del servicio de gas natural residencial en vivienda unifamiliar terminada.',
  },
  {
    titulo: '🗑️ Queja: Retraso en aseo',
    servicio: 'Aseo/Basuras' as Servicio,
    municipio: 'Medellín',
    direccion: 'Calle 45 # 80 - 15, Calasanz',
    desc: 'Queja por incumplimiento en la ruta de recolección de basuras. El camión lleva 4 días sin pasar y los residuos acumulados están esparcidos por la acera.',
  },
];

export const FormularioPQRS: React.FC<FormularioPQRSProps> = ({ onRadicadoExitoso }) => {
  // Estados del formulario
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState<TipoDocumento>('CC');
  const [documentoIdentidad, setDocumentoIdentidad] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [numeroContacto, setNumeroContacto] = useState('');
  const [direccion, setDireccion] = useState('');
  const [municipio, setMunicipio] = useState('Medellín');
  const [tipoServicio, setTipoServicio] = useState<Servicio>('Energía');
  const [descripcion, setDescripcion] = useState('');

  // Estados de control y procesamiento
  const [tocados, setTocados] = useState<Record<string, boolean>>({});
  const [enviando, setEnviando] = useState(false);
  const [faseIA, setFaseIA] = useState<string>('');
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);

  // Marcar campo como tocado para mostrar errores
  const handleBlur = (campo: string) => {
    setTocados((prev) => ({ ...prev, [campo]: true }));
  };

  // Detección de términos críticos en tiempo real
  const terminosCriticos = useMemo(() => {
    return detectarTerminosCriticos(descripcion);
  }, [descripcion]);

  // Validaciones en tiempo real
  const errores = useMemo(() => {
    const errs: Record<string, string> = {};

    if (!nombreCompleto.trim()) {
      errs.nombreCompleto = 'El nombre completo es obligatorio';
    } else if (nombreCompleto.trim().length < 5) {
      errs.nombreCompleto = 'Ingrese nombre y apellido válidos';
    }

    if (!documentoIdentidad.trim()) {
      errs.documentoIdentidad = 'El documento es obligatorio';
    } else if (documentoIdentidad.trim().length < 6) {
      errs.documentoIdentidad = 'El documento debe tener al menos 6 dígitos';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoElectronico.trim()) {
      errs.correoElectronico = 'El correo electrónico es obligatorio';
    } else if (!emailRegex.test(correoElectronico)) {
      errs.correoElectronico = 'Ingrese un formato de correo válido (ej: usuario@correo.com)';
    }

    const telRegex = /^[0-9+ ]{7,15}$/;
    if (!numeroContacto.trim()) {
      errs.numeroContacto = 'El número de contacto es obligatorio';
    } else if (!telRegex.test(numeroContacto.replace(/\s/g, ''))) {
      errs.numeroContacto = 'Ingrese un teléfono o celular válido (mínimo 7 dígitos)';
    }

    if (!direccion.trim()) {
      errs.direccion = 'La dirección de la solicitud es requerida';
    } else if (direccion.trim().length < 5) {
      errs.direccion = 'Ingrese una dirección completa (ej: Calle 50 # 45 - 20)';
    }

    if (!municipio.trim()) {
      errs.municipio = 'Seleccione el municipio';
    }

    if (!descripcion.trim()) {
      errs.descripcion = 'La descripción de los hechos es obligatoria';
    } else if (descripcion.trim().length < 20) {
      errs.descripcion = `La descripción debe ser más detallada (faltan ${20 - descripcion.trim().length} caracteres)`;
    }

    return errs;
  }, [
    nombreCompleto,
    documentoIdentidad,
    correoElectronico,
    numeroContacto,
    direccion,
    municipio,
    descripcion,
  ]);

  const esValido = Object.keys(errores).length === 0;

  // Cargar caso de prueba rápido
  const cargarCasoEjemplo = (caso: typeof CASOS_EJEMPLO[0]) => {
    setNombreCompleto('Santiago Montoya Botero');
    setTipoDocumento('CC');
    setDocumentoIdentidad('1017245890');
    setCorreoElectronico('santiago.montoya@ejemplo.com');
    setNumeroContacto('3114567890');
    setDireccion(caso.direccion);
    setMunicipio(caso.municipio);
    setTipoServicio(caso.servicio);
    setDescripcion(caso.desc);
    setTocados({});
    setErrorEnvio(null);
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombreCompleto('');
    setDocumentoIdentidad('');
    setCorreoElectronico('');
    setNumeroContacto('');
    setDireccion('');
    setDescripcion('');
    setTocados({});
    setErrorEnvio(null);
  };

  // Enviar y procesar con IA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTocados({
      nombreCompleto: true,
      documentoIdentidad: true,
      correoElectronico: true,
      numeroContacto: true,
      direccion: true,
      municipio: true,
      descripcion: true,
    });

    if (!esValido) {
      setErrorEnvio('Por favor corrija los campos marcados antes de enviar.');
      return;
    }

    setEnviando(true);
    setErrorEnvio(null);

    try {
      setFaseIA('Analizando texto y extrayendo parámetros semánticos...');
      await new Promise((r) => setTimeout(r, 450));

      setFaseIA('Clasificando servicio, tipo, categoría y nivel de prioridad...');
      const resultadoIA = await clasificarSolicitudPQRS(descripcion, tipoServicio);

      setFaseIA('Validando esquema JSON y asignando área responsable de EPM...');
      await new Promise((r) => setTimeout(r, 400));

      const idRadicado = generarNumeroRadicado();

      // Determinar tiempo estimado de resolución según prioridad
      let sla = '15 días hábiles';
      if (resultadoIA.data.prioridad === 'Alta') {
        sla = 'Atención Inmediata (2 a 4 horas)';
      } else if (resultadoIA.data.prioridad === 'Media') {
        sla = '3 a 5 días hábiles';
      }

      const nuevoRegistro: PQRRecord = {
        id: idRadicado,
        fecha_creacion: new Date().toISOString(),
        nombre_completo: nombreCompleto.trim(),
        tipo_documento: tipoDocumento,
        documento_identidad: documentoIdentidad.trim(),
        correo_electronico: correoElectronico.trim(),
        numero_contacto: numeroContacto.trim(),
        direccion: direccion.trim(),
        municipio,
        tipo_servicio_seleccionado: tipoServicio,
        descripcion: descripcion.trim(),
        clasificacion: resultadoIA.data,
        estado: resultadoIA.data.prioridad === 'Alta' ? 'Cuadrilla Asignada' : 'Radicado',
        confianza_ia: resultadoIA.confianza,
        tiempo_estimado_resolucion: sla,
        origen_ia: resultadoIA.origen,
        alerta_critica: resultadoIA.terminos_criticos_detectados.length > 0,
      };

      // Guardar en almacenamiento
      guardarNuevoRadicado(nuevoRegistro);

      // Notificar al componente padre para desplegar el modal con los resultados
      onRadicadoExitoso(nuevoRegistro, resultadoIA);

      // Resetear campos
      limpiarFormulario();
    } catch (err: unknown) {
      console.error('Error al procesar PQRS:', err);
      setErrorEnvio('Ocurrió un error al procesar la solicitud. Por favor intente nuevamente.');
    } finally {
      setEnviando(false);
      setFaseIA('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Módulo Oficial de Radicación Automática
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Radicar Petición, Queja, Reclamo o Sugerencia
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            Su solicitud será analizada instantáneamente por el motor inteligente de EPM para su
            clasificación técnica y direccionamiento sin intermediarios.
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center justify-end">
          <button
            type="button"
            onClick={limpiarFormulario}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Limpiar campos
          </button>
        </div>
      </div>

      {/* Preset Test Scenarios */}
      <div className="mb-8 bg-slate-50 dark:bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Plantillas de Pruebas Rápidas (1 Clic)
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline">
            Cargue casos reales para comprobar la IA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {CASOS_EJEMPLO.map((caso, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => cargarCasoEjemplo(caso)}
              className="text-left p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:shadow-sm transition-all group cursor-pointer"
            >
              <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-1">
                {caso.titulo}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {caso.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} noValidate className="space-y-8">
        {/* Sección 1: Datos del Solicitante */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                1. Información del Ciudadano o Titular
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Datos de contacto para notificación oficial de la radicación
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Nombre Completo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  onBlur={() => handleBlur('nombreCompleto')}
                  placeholder="Ej: Laura Gómez Cardona"
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition ${
                    tocados.nombreCompleto && errores.nombreCompleto
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {tocados.nombreCompleto && errores.nombreCompleto && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {errores.nombreCompleto}
                </p>
              )}
            </div>

            {/* Documento de Identidad con selector de tipo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Documento de Identidad <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as TipoDocumento)}
                  className="w-24 text-sm px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:border-emerald-500"
                >
                  <option value="CC">C.C.</option>
                  <option value="CE">C.E.</option>
                  <option value="Pasaporte">Pasap.</option>
                  <option value="NIT">NIT</option>
                </select>
                <input
                  type="text"
                  value={documentoIdentidad}
                  onChange={(e) => setDocumentoIdentidad(e.target.value)}
                  onBlur={() => handleBlur('documentoIdentidad')}
                  placeholder="Número sin puntos ni comas"
                  className={`flex-1 text-sm px-3.5 py-2.5 rounded-xl border transition ${
                    tocados.documentoIdentidad && errores.documentoIdentidad
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {tocados.documentoIdentidad && errores.documentoIdentidad && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {errores.documentoIdentidad}
                </p>
              )}
            </div>

            {/* Correo Electrónico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  onBlur={() => handleBlur('correoElectronico')}
                  placeholder="ejemplo@correo.com"
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition ${
                    tocados.correoElectronico && errores.correoElectronico
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {tocados.correoElectronico && errores.correoElectronico && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {errores.correoElectronico}
                </p>
              )}
            </div>

            {/* Número de Contacto */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Número de Contacto (Celular / Fijo) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={numeroContacto}
                  onChange={(e) => setNumeroContacto(e.target.value)}
                  onBlur={() => handleBlur('numeroContacto')}
                  placeholder="Ej: 3123456789"
                  className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition ${
                    tocados.numeroContacto && errores.numeroContacto
                      ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                      : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                />
              </div>
              {tocados.numeroContacto && errores.numeroContacto && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {errores.numeroContacto}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección 2: Ubicación del Predio y Servicio */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                2. Ubicación y Servicio EPM
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Indique dónde ocurre el evento y la línea de servicio público
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            {/* Municipio */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Municipio <span className="text-red-500">*</span>
              </label>
              <select
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              >
                {MUNICIPIOS_ANTIOQUIA.map((mun) => (
                  <option key={mun} value={mun}>
                    {mun} (Antioquia)
                  </option>
                ))}
              </select>
            </div>

            {/* Dirección exacta */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Dirección del Predio o Lugar de los Hechos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                onBlur={() => handleBlur('direccion')}
                placeholder="Ej: Calle 50 # 45 - 20, Barrio Boston"
                className={`w-full text-sm px-3.5 py-2.5 rounded-xl border transition ${
                  tocados.direccion && errores.direccion
                    ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                    : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
              />
              {tocados.direccion && errores.direccion && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {errores.direccion}
                </p>
              )}
            </div>
          </div>

          {/* Selector visual de Tipo de Servicio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Tipo de Servicio Asociado <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {SERVICIOS_OPCIONES.map((serv) => {
                const IconComponent = serv.icon;
                const activo = tipoServicio === serv.id;
                return (
                  <button
                    key={serv.id}
                    type="button"
                    onClick={() => setTipoServicio(serv.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all cursor-pointer ${
                      activo
                        ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50/60 dark:bg-emerald-950/40 shadow-sm'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mb-1.5 ${serv.color}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs font-bold text-center ${
                        activo
                          ? 'text-emerald-800 dark:text-emerald-300'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {serv.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
              * Nota: El motor de IA verificará la coherencia técnica del texto y confirmará o corregirá el servicio correspondiente.
            </p>
          </div>
        </div>

        {/* Sección 3: Descripción Detallada y Análisis en Tiempo Real */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 sm:p-7 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-700/60 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  3. Descripción Detallada de la Solicitud
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Explique con precisión lo sucedido para el análisis instantáneo del modelo IA
                </p>
              </div>
            </div>

            {/* Contador de caracteres */}
            <span
              className={`text-xs font-mono px-2 py-0.5 rounded ${
                descripcion.length >= 20
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
              }`}
            >
              {descripcion.length} caracteres
            </span>
          </div>

          {/* Alerta en tiempo real si se detectan términos de alta prioridad */}
          {terminosCriticos.length > 0 && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-950/50 border-2 border-red-500/80 text-red-900 dark:text-red-200 flex items-start gap-3 radar-urgent">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 text-red-700 dark:text-red-300">
                  <span>Alerta de Seguridad Detectada: Prioridad Alta Automática</span>
                  <span className="px-1.5 py-0.5 rounded bg-red-600 text-white text-[10px]">
                    Código Rojo
                  </span>
                </div>
                <p className="text-xs mt-1 text-red-800/90 dark:text-red-300/90">
                  Se identificaron términos de riesgo operativo:{' '}
                  <strong className="underline">{terminosCriticos.join(', ')}</strong>.
                  El sistema asignará prioridad inmediata y enrutará la solicitud para atención
                  urgente de cuadrillas.
                </p>
              </div>
            </div>
          )}

          <div className="relative">
            <textarea
              rows={5}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              onBlur={() => handleBlur('descripcion')}
              placeholder="Describa claramente la situación, indicando referencias del lugar, si hay olor a gas, cables caídos, cobro erróneo o interrupción del servicio..."
              className={`w-full text-sm p-4 rounded-xl border leading-relaxed transition ${
                tocados.descripcion && errores.descripcion
                  ? 'border-red-400 bg-red-50/30 text-red-900 focus:ring-red-300'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
              }`}
            />
          </div>

          {tocados.descripcion && errores.descripcion && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 flex-shrink-0" />
              {errores.descripcion}
            </p>
          )}

          {/* Guía de apoyo para redacción */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>
              Incluya detalles técnicos como: códigos de medidor, poste de referencia o si hay afectación colectiva.
            </span>
          </div>
        </div>

        {/* Mensaje de error general si aplica */}
        {errorEnvio && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{errorEnvio}</span>
          </div>
        )}

        {/* Botón Enviar con estado de análisis IA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            Al radicar, su solicitud quedará formalmente registrada en los sistemas corporativos de EPM.
          </div>

          <button
            type="submit"
            disabled={enviando}
            className={`w-full sm:w-auto min-w-[220px] px-8 py-4 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2.5 ${
              enviando
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-700 hover:to-teal-900 shadow-emerald-700/25 hover:shadow-xl hover:-translate-y-0.5 cursor-pointer'
            }`}
          >
            {enviando ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Procesando con IA...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Radicar Solicitud PQRS</span>
              </>
            )}
          </button>
        </div>

        {/* Panel de progreso de análisis durante el envío */}
        {enviando && (
          <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center animate-pulse">
            <div className="flex items-center justify-center gap-2 text-emerald-800 dark:text-emerald-200 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
              <span>Motor Inteligente EPM en Ejecución</span>
            </div>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
              {faseIA || 'Procesando semántica del caso...'}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
