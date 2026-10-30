/**
 * Vista de consulta ciudadana de estado y trazabilidad de radicado PQRS.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  FileSearch,
  CheckCircle2,
  Clock,
  ShieldAlert,
  Building2,
  User,
  MapPin,
  Tag,
  Copy,
  Check,
  ChevronRight,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import { PQRRecord } from '../types';

interface ConsultarRadicadoProps {
  radicados: PQRRecord[];
  radicadoInicial?: string;
  onSeleccionarRadicado: (registro: PQRRecord) => void;
}

export const ConsultarRadicado: React.FC<ConsultarRadicadoProps> = ({
  radicados,
  radicadoInicial = '',
  onSeleccionarRadicado,
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState(radicadoInicial);
  const [radicadoSeleccionadoId, setRadicadoSeleccionadoId] = useState<string>(
    radicadoInicial || (radicados[0]?.id ?? '')
  );
  const [copiado, setCopiado] = useState(false);

  // Filtrado reactivo
  const resultados = useMemo(() => {
    if (!terminoBusqueda.trim()) return radicados;
    const q = terminoBusqueda.trim().toLowerCase();
    return radicados.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.documento_identidad.toLowerCase().includes(q) ||
        r.nombre_completo.toLowerCase().includes(q) ||
        r.municipio.toLowerCase().includes(q)
    );
  }, [radicados, terminoBusqueda]);

  const casoActual = useMemo(() => {
    return (
      radicados.find((r) => r.id === radicadoSeleccionadoId) ||
      resultados[0] ||
      null
    );
  }, [radicados, radicadoSeleccionadoId, resultados]);

  const copiarRadicado = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // Etapas del flujo de atención
  const etapas = [
    { label: 'Radicado', estado: 'Radicado' },
    { label: 'En Gestión', estado: 'En Gestión' },
    { label: 'Cuadrilla Asignada', estado: 'Cuadrilla Asignada' },
    { label: 'En Atención', estado: 'En Atención' },
    { label: 'Cerrado / Resuelto', estado: 'Cerrado' },
  ];

  const getEtapaIndex = (estado: string) => {
    const idx = etapas.findIndex((e) => e.estado === estado);
    return idx === -1 ? 0 : idx;
  };

  const etapaActualIndex = casoActual ? getEtapaIndex(casoActual.estado) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs font-bold mb-2">
          <FileSearch className="w-3.5 h-3.5" />
          Trazabilidad y Estado en Tiempo Real
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Consulta de Radicado PQRS
        </h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Consulte el estado de su solicitud con el número de radicado (ej: EPM-2026-849201) o con su documento de identidad.
        </p>
      </div>

      {/* Buscador */}
      <div className="mb-8 bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            placeholder="Buscar por radicado (EPM-2026-...) o cédula de ciudadanía..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        {/* Chips de casos recientes para prueba rápida */}
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            Casos disponibles:
          </span>
          {radicados.slice(0, 4).map((r) => (
            <button
              key={r.id}
              onClick={() => {
                setTerminoBusqueda(r.id);
                setRadicadoSeleccionadoId(r.id);
              }}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 transition cursor-pointer"
            >
              {r.id} ({r.clasificacion.servicio})
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Lista lateral y detalle principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Resultados de Búsqueda */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1">
            Solicitudes Encontradas ({resultados.length})
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {resultados.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-xs">No se encontraron solicitudes con los datos ingresados.</p>
              </div>
            ) : (
              resultados.map((item) => {
                const activo = casoActual?.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setRadicadoSeleccionadoId(item.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                      activo
                        ? 'border-emerald-600 dark:border-emerald-400 bg-white dark:bg-slate-800 shadow-md ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-black text-slate-900 dark:text-white">
                        {item.id}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          item.clasificacion.prioridad === 'Alta'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : item.clasificacion.prioridad === 'Media'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {item.clasificacion.prioridad}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.clasificacion.servicio} • {item.clasificacion.subcategoria}
                    </div>

                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                      <span>{item.municipio}</span>
                      <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                        {item.estado}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Columna Derecha: Detalle Completo del Caso Seleccionado */}
        <div className="lg:col-span-8">
          {casoActual ? (
            <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-7 shadow-sm space-y-6">
              {/* Header Caso */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-700/60 pb-5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Número de Radicado EPM
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <h2 className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {casoActual.id}
                    </h2>
                    <button
                      onClick={() => copiarRadicado(casoActual.id)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                      title="Copiar radicado"
                    >
                      {copiado ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Radicado el {new Date(casoActual.fecha_creacion).toLocaleString('es-CO')}
                  </p>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                      casoActual.clasificacion.prioridad === 'Alta'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300'
                        : casoActual.clasificacion.prioridad === 'Media'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                    }`}
                  >
                    {casoActual.clasificacion.prioridad === 'Alta' && (
                      <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    )}
                    Prioridad {casoActual.clasificacion.prioridad}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Estado: <strong className="text-emerald-700 dark:text-emerald-400">{casoActual.estado}</strong>
                  </span>
                </div>
              </div>

              {/* Barra de Trazabilidad / Timeline */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  Línea de Vida y Trazabilidad del Caso
                </div>
                <div className="relative">
                  {/* Línea conectora */}
                  <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 relative z-10">
                    {etapas.map((etapa, idx) => {
                      const completado = idx <= etapaActualIndex;
                      const esActual = idx === etapaActualIndex;
                      return (
                        <div
                          key={etapa.label}
                          className={`flex flex-col items-center p-2.5 rounded-xl border text-center transition ${
                            esActual
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 font-bold'
                              : completado
                              ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 text-slate-700 dark:text-slate-300'
                              : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                              completado
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                            }`}
                          >
                            {completado ? '✓' : idx + 1}
                          </div>
                          <span className="text-[11px] leading-tight">{etapa.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Tarjetas de Clasificación IA */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-extrabold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                      Diagnóstico del Motor de IA EPM
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                    Confianza {casoActual.confianza_ia}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Servicio</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {casoActual.clasificacion.servicio}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Tipo</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {casoActual.clasificacion.tipo}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Categoría</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {casoActual.clasificacion.categoria_principal}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Subcategoría</span>
                    <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 truncate">
                      {casoActual.clasificacion.subcategoria}
                    </p>
                  </div>
                </div>

                {/* Área Responsable */}
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Área Responsable
                    </div>
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                      {casoActual.clasificacion.area_responsable}
                    </div>
                  </div>
                </div>

                {/* Resumen Técnico */}
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-300">
                    Resumen Técnico de Despacho
                  </span>
                  <p className="text-xs text-slate-800 dark:text-slate-200 italic mt-0.5">
                    "{casoActual.clasificacion.resumen_corto}"
                  </p>
                </div>
              </div>

              {/* Datos del Ciudadano y Ubicación */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Datos del Titular</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    {casoActual.nombre_completo}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {casoActual.tipo_documento}: {casoActual.documento_identidad}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    Tel: {casoActual.numero_contacto}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Ubicación del Predio</span>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">
                    {casoActual.direccion}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">
                    {casoActual.municipio}, Antioquia
                  </p>
                </div>
              </div>

              {/* Descripción Original */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Descripción Registrada por el Usuario
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                  {casoActual.descripcion}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-3 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Seleccione un radicado
              </h3>
              <p className="text-xs mt-1 text-slate-500">
                Elija un caso de la lista o escriba el número de radicado en la barra superior.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
