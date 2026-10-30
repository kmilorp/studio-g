/**
 * Tablero de Gestión Interna para Operadores y Analistas de EPM.
 * Permite filtrar, monitorear la distribución, ver alertas rojas y actualizar estados.
 */

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  ShieldAlert,
  Clock,
  Filter,
  CheckCircle2,
  Building2,
  Eye,
  FileSpreadsheet,
  AlertOctagon,
  RefreshCw,
  Search,
} from 'lucide-react';
import { PQRRecord, EstadoPQR, Servicio, Prioridad } from '../types';
import { obtenerEstadisticasRadicados } from '../services/storage';

interface TableroGestionProps {
  radicados: PQRRecord[];
  onActualizarEstado: (id: string, nuevoEstado: EstadoPQR) => void;
  onVerDetalle: (registro: PQRRecord) => void;
}

export const TableroGestion: React.FC<TableroGestionProps> = ({
  radicados,
  onActualizarEstado,
  onVerDetalle,
}) => {
  const [filtroServicio, setFiltroServicio] = useState<string>('todos');
  const [filtroPrioridad, setFiltroPrioridad] = useState<string>('todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  const stats = useMemo(() => obtenerEstadisticasRadicados(radicados), [radicados]);

  // Filtrado de la tabla
  const filtrados = useMemo(() => {
    return radicados.filter((item) => {
      if (filtroServicio !== 'todos' && item.clasificacion.servicio !== filtroServicio) {
        return false;
      }
      if (filtroPrioridad !== 'todos' && item.clasificacion.prioridad !== filtroPrioridad) {
        return false;
      }
      if (filtroEstado !== 'todos' && item.estado !== filtroEstado) {
        return false;
      }
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const coincide =
          item.id.toLowerCase().includes(q) ||
          item.nombre_completo.toLowerCase().includes(q) ||
          item.documento_identidad.toLowerCase().includes(q) ||
          item.municipio.toLowerCase().includes(q) ||
          item.clasificacion.subcategoria.toLowerCase().includes(q);
        if (!coincide) return false;
      }
      return true;
    });
  }, [radicados, filtroServicio, filtroPrioridad, filtroEstado, busqueda]);

  const exportarCSV = () => {
    const encabezados = [
      'Radicado',
      'Fecha',
      'Ciudadano',
      'Documento',
      'Municipio',
      'Servicio',
      'Tipo',
      'Categoria',
      'Subcategoria',
      'Prioridad',
      'Area Responsable',
      'Estado',
    ];

    const filas = filtrados.map((r) => [
      r.id,
      r.fecha_creacion,
      `"${r.nombre_completo}"`,
      r.documento_identidad,
      r.municipio,
      r.clasificacion.servicio,
      r.clasificacion.tipo,
      `"${r.clasificacion.categoria_principal}"`,
      `"${r.clasificacion.subcategoria}"`,
      r.clasificacion.prioridad,
      `"${r.clasificacion.area_responsable}"`,
      r.estado,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [encabezados.join(','), ...filas.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Reporte_PQRS_EPM_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Consola Operativa EPM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Monitoreo y Despacho de PQRS
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Vista unificada de solicitudes clasificadas en tiempo real para las áreas operativas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportarCSV}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Solicitudes
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats.total}
          </div>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
            100% procesadas con IA
          </span>
        </div>

        {/* Alta Prioridad */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-red-200 dark:border-red-900/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              Prioridad Alta (Urgentes)
            </div>
            {stats.altas > 0 && (
              <span className="p-1 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                <ShieldAlert className="w-4 h-4" />
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-red-600 dark:text-red-400 mt-2">
            {stats.altas}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 inline-block">
            {((stats.altas / (stats.total || 1)) * 100).toFixed(0)}% del volumen total
          </span>
        </div>

        {/* Media Prioridad */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-amber-200 dark:border-amber-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Prioridad Media
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">
            {stats.medias}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 inline-block">
            SLA regular (3 a 5 días)
          </span>
        </div>

        {/* Baja Prioridad */}
        <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-emerald-200 dark:border-emerald-900/40 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
            Prioridad Baja (Trámites)
          </div>
          <div className="text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
            {stats.bajas}
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 inline-block">
            Nuevas conexiones y sugerencias
          </span>
        </div>
      </div>

      {/* Filtros de la Tabla */}
      <div className="bg-white dark:bg-slate-800/90 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Búsqueda rápida */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por radicado, ciudadano, cédula o subcategoría..."
              className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
            />
          </div>

          {/* Selectores de filtro */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Servicio */}
            <select
              value={filtroServicio}
              onChange={(e) => setFiltroServicio(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="todos">Todos los Servicios</option>
              <option value="Energía">Energía</option>
              <option value="Agua y Alcantarillado">Agua y Alcantarillado</option>
              <option value="Gas Natural">Gas Natural</option>
              <option value="Aseo/Basuras">Aseo/Basuras</option>
              <option value="General">General</option>
            </select>

            {/* Prioridad */}
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="todos">Todas las Prioridades</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>

            {/* Estado */}
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Radicado">Radicado</option>
              <option value="En Gestión">En Gestión</option>
              <option value="Cuadrilla Asignada">Cuadrilla Asignada</option>
              <option value="En Atención">En Atención</option>
              <option value="Cerrado">Cerrado</option>
            </select>
          </div>
        </div>

        {/* Tabla Responsiva */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3.5">Radicado</th>
                <th className="py-3 px-3">Ciudadano & Municipio</th>
                <th className="py-3 px-3">Servicio & Subcategoría</th>
                <th className="py-3 px-3">Prioridad</th>
                <th className="py-3 px-3">Área Responsable</th>
                <th className="py-3 px-3">Estado Operativo</th>
                <th className="py-3 px-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700/60 bg-white dark:bg-slate-800">
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500">
                    No hay solicitudes que coincidan con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filtrados.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition"
                  >
                    {/* Radicado */}
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {item.id}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {new Date(item.fecha_creacion).toLocaleDateString('es-CO')}
                      </div>
                    </td>

                    {/* Ciudadano */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">
                        {item.nombre_completo}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {item.municipio} • {item.tipo_documento} {item.documento_identidad}
                      </div>
                    </td>

                    {/* Servicio y Subcategoría */}
                    <td className="py-3 px-3">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {item.clasificacion.servicio}
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 truncate max-w-[150px]">
                        {item.clasificacion.subcategoria}
                      </div>
                    </td>

                    {/* Prioridad */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          item.clasificacion.prioridad === 'Alta'
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 radar-urgent'
                            : item.clasificacion.prioridad === 'Media'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {item.clasificacion.prioridad === 'Alta' && (
                          <ShieldAlert className="w-3 h-3 text-red-600" />
                        )}
                        {item.clasificacion.prioridad}
                      </span>
                    </td>

                    {/* Área Responsable */}
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-700 dark:text-slate-300 text-[11px] line-clamp-1">
                        {item.clasificacion.area_responsable}
                      </span>
                    </td>

                    {/* Estado con selector de cambio inmediato */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <select
                        value={item.estado}
                        onChange={(e) =>
                          onActualizarEstado(item.id, e.target.value as EstadoPQR)
                        }
                        className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="Radicado">Radicado</option>
                        <option value="En Gestión">En Gestión</option>
                        <option value="Cuadrilla Asignada">Cuadrilla Asignada</option>
                        <option value="En Atención">En Atención</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </td>

                    {/* Botón ver */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => onVerDetalle(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-300 font-bold text-[11px] transition cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
