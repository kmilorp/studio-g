/**
 * Modal y vista de resultados tras la radicación exitosa con IA.
 * Presenta el número de radicado, clasificación, prioridad, área responsable,
 * resumen técnico y el JSON estructurado oficial.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Download,
  AlertOctagon,
  Clock,
  Building2,
  Cpu,
  FileCheck,
  X,
  ExternalLink,
  ShieldAlert,
  HelpCircle,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { PQRRecord, ClasificacionResult } from '../types';

interface ResultadoModalProps {
  registro: PQRRecord | null;
  resultadoIA: ClasificacionResult | null;
  onCerrar: () => void;
  onIrAConsulta: (radicado: string) => void;
}

export const ResultadoModal: React.FC<ResultadoModalProps> = ({
  registro,
  resultadoIA,
  onCerrar,
  onIrAConsulta,
}) => {
  const [copiadoRadicado, setCopiadoRadicado] = useState(false);
  const [copiadoJson, setCopiadoJson] = useState(false);
  const [vistaJson, setVistaJson] = useState<'formateado' | 'crudo'>('formateado');

  if (!registro) return null;

  const jsonSalida = JSON.stringify(registro.clasificacion, null, 2);

  const copiarAlPortapapeles = (texto: string, tipo: 'radicado' | 'json') => {
    navigator.clipboard.writeText(texto);
    if (tipo === 'radicado') {
      setCopiadoRadicado(true);
      setTimeout(() => setCopiadoRadicado(false), 2000);
    } else {
      setCopiadoJson(true);
      setTimeout(() => setCopiadoJson(false), 2000);
    }
  };

  const descargarComprobante = () => {
    const contenido = `===============================================================
EMPRESAS PÚBLICAS DE MEDELLÍN E.S.P. (EPM)
COMPROBANTE OFICIAL DE RADICACIÓN INTELIGENTE DE PQRS
===============================================================
NÚMERO DE RADICADO: ${registro.id}
FECHA Y HORA: ${new Date(registro.fecha_creacion).toLocaleString('es-CO')}
ESTADO: ${registro.estado}

DATOS DEL CIUDADANO:
- Titular: ${registro.nombre_completo}
- Documento: ${registro.tipo_documento} ${registro.documento_identidad}
- Teléfono: ${registro.numero_contacto}
- Correo: ${registro.correo_electronico}
- Ubicación: ${registro.direccion}, ${registro.municipio} (Antioquia)

CLASIFICACIÓN AUTOMÁTICA POR INTELIGENCIA ARTIFICIAL:
- Servicio: ${registro.clasificacion.servicio}
- Tipo de Solicitud: ${registro.clasificacion.tipo}
- Categoría Principal: ${registro.clasificacion.categoria_principal}
- Subcategoría Técnica: ${registro.clasificacion.subcategoria}
- Nivel de Prioridad: ${registro.clasificacion.prioridad}
- Área Responsable: ${registro.clasificacion.area_responsable}
- Nivel de Confianza IA: ${registro.confianza_ia}%
- Tiempo Estimado (SLA): ${registro.tiempo_estimado_resolucion}

RESUMEN TÉCNICO PARA OPERADOR:
"${registro.clasificacion.resumen_corto}"

DESCRIPCIÓN ORIGINAL REGISTRADA:
"${registro.descripcion}"

PAYLOAD JSON OFICIAL:
${jsonSalida}

Para consultar el avance de su caso ingrese a: https://www.epm.com.co
Línea gratuita de atención: 01 8000 415 115 | Emergencias: 115
===============================================================`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Radicado_${registro.id}_EPM.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const prioridadColor = {
    Alta: 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 border-red-300 dark:border-red-800',
    Media: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    Baja: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
  }[registro.clasificacion.prioridad];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Top Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 p-5 sm:p-6 text-white relative">
          <button
            onClick={onCerrar}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-7 h-7 text-emerald-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-200">
                Radicación Exitosa • Empresas Públicas de Medellín
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Solicitud Clasificada y Enrutada con IA
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6">
          {/* Card 1: Radicado & Prioridad Header */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                1. NÚMERO DE RADICADO GENERADO
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {registro.id}
                </span>
                <button
                  onClick={() => copiarAlPortapapeles(registro.id, 'radicado')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                  title="Copiar radicado"
                >
                  {copiadoRadicado ? (
                    <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {new Date(registro.fecha_creacion).toLocaleString('es-CO')} • {registro.municipio}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                3. NIVEL DE PRIORIDAD
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold border ${prioridadColor} ${
                    registro.clasificacion.prioridad === 'Alta' ? 'radar-urgent' : ''
                  }`}
                >
                  {registro.clasificacion.prioridad === 'Alta' ? (
                    <ShieldAlert className="w-4 h-4 text-red-600 dark:text-red-400" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  Prioridad {registro.clasificacion.prioridad.toUpperCase()}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                SLA: {registro.tiempo_estimado_resolucion}
              </span>
            </div>
          </div>

          {/* Card 2: Clasificación Obtenida por la IA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2. CLASIFICACIÓN OBTENIDA POR LA IA
              </h3>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <Cpu className="w-3.5 h-3.5" />
                <span>Confianza: {registro.confianza_ia}%</span>
                <span>({registro.origen_ia === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : 'Motor EPM Heurístico'})</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Servicio
                </span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {registro.clasificacion.servicio}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Tipo PQRS
                </span>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                  {registro.clasificacion.tipo}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Categoría Principal
                </span>
                <p className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 leading-tight">
                  {registro.clasificacion.categoria_principal}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Subcategoría (Max 3 palabras)
                </span>
                <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {registro.clasificacion.subcategoria}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: Área Responsable Asignada */}
          <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-700 text-white flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                4. ÁREA RESPONSABLE ASIGNADA
              </div>
              <div className="text-base font-extrabold text-emerald-950 dark:text-emerald-100">
                {registro.clasificacion.area_responsable}
              </div>
              <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 mt-0.5">
                La solicitud fue enviada directamente a la bandeja operativa de despacho sin intermediación humana.
              </p>
            </div>
          </div>

          {/* Card 4: Resumen Técnico para el Operador */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              5. RESUMEN TÉCNICO PARA OPERADOR
            </div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 italic leading-relaxed">
              "{registro.clasificacion.resumen_corto}"
            </p>
          </div>

          {/* Card 5: JSON Procesado */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  6. JSON PROCESADO (ESTRUCTURA OBLIGATORIA)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copiarAlPortapapeles(jsonSalida, 'json')}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 transition cursor-pointer"
                >
                  {copiadoJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar JSON</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <pre className="p-4 text-xs font-mono bg-slate-900 text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{jsonSalida}</code>
            </pre>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={descargarComprobante}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Descargar Comprobante (.TXT)
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onIrAConsulta(registro.id)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <span>Consultar Trazabilidad</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onCerrar}
              className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
