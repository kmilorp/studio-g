/**
 * @license
 * Aplicación Web Completa de PQRS para Empresas Públicas de Medellín (EPM)
 * Arquitectura modular con React, Tailwind CSS y Motor de Clasificación con IA.
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FormularioPQRS } from './components/FormularioPQRS';
import { ResultadoModal } from './components/ResultadoModal';
import { ConsultarRadicado } from './components/ConsultarRadicado';
import { TableroGestion } from './components/TableroGestion';
import { CodigoFuenteModal } from './components/CodigoFuenteModal';
import { Footer } from './components/Footer';
import {
  obtenerTodosLosRadicados,
  actualizarEstadoRadicado,
} from './services/storage';
import { PQRRecord, ClasificacionResult, EstadoPQR } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'formulario' | 'consulta' | 'tablero' | 'codigo'>('formulario');
  const [radicados, setRadicados] = useState<PQRRecord[]>([]);
  const [registroModal, setRegistroModal] = useState<PQRRecord | null>(null);
  const [resultadoIAModal, setResultadoIAModal] = useState<ClasificacionResult | null>(null);
  const [radicadoSeleccionadoParaConsulta, setRadicadoSeleccionadoParaConsulta] = useState<string>('');

  // Modo Oscuro / Claro
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const guardado = localStorage.getItem('epm_theme');
      if (guardado) return guardado === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Sincronizar clase dark en el elemento HTML raíz
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('epm_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('epm_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // Cargar radicados desde LocalStorage
  useEffect(() => {
    const datos = obtenerTodosLosRadicados();
    setRadicados(datos);
  }, []);

  // Manejador de nueva radicación exitosa
  const handleRadicadoExitoso = (
    nuevoRegistro: PQRRecord,
    resultadoIA: ClasificacionResult
  ) => {
    setRadicados((prev) => [nuevoRegistro, ...prev]);
    setRegistroModal(nuevoRegistro);
    setResultadoIAModal(resultadoIA);
  };

  // Actualizar estado de un caso en la tabla de gestión
  const handleActualizarEstado = (id: string, nuevoEstado: EstadoPQR) => {
    const actualizados = actualizarEstadoRadicado(id, nuevoEstado);
    setRadicados(actualizados);
    if (registroModal && registroModal.id === id) {
      setRegistroModal({ ...registroModal, estado: nuevoEstado });
    }
  };

  // Abrir vista de detalle desde cualquier módulo
  const handleVerDetalle = (registro: PQRRecord) => {
    setRegistroModal(registro);
    setResultadoIAModal(null);
  };

  // Navegar directamente a la vista de consulta con el radicado precargado
  const handleIrAConsulta = (idRadicado: string) => {
    setRadicadoSeleccionadoParaConsulta(idRadicado);
    setRegistroModal(null);
    setActiveTab('consulta');
  };

  const totalCasos = radicados.length;
  const casosUrgentes = radicados.filter(
    (r) => r.clasificacion.prioridad === 'Alta' && r.estado !== 'Cerrado'
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Navegación Corporativa EPM */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isDark={isDark}
        toggleTheme={toggleTheme}
        totalCasos={totalCasos}
        casosUrgentes={casosUrgentes}
      />

      {/* Contenido Principal según Pestaña Activa */}
      <main className="flex-1">
        {activeTab === 'formulario' && (
          <FormularioPQRS onRadicadoExitoso={handleRadicadoExitoso} />
        )}

        {activeTab === 'consulta' && (
          <ConsultarRadicado
            radicados={radicados}
            radicadoInicial={radicadoSeleccionadoParaConsulta}
            onSeleccionarRadicado={handleVerDetalle}
          />
        )}

        {activeTab === 'tablero' && (
          <TableroGestion
            radicados={radicados}
            onActualizarEstado={handleActualizarEstado}
            onVerDetalle={handleVerDetalle}
          />
        )}

        {activeTab === 'codigo' && <CodigoFuenteModal />}
      </main>

      {/* Modal de Resultados de la Radicación y Visor de JSON */}
      {registroModal && (
        <ResultadoModal
          registro={registroModal}
          resultadoIA={resultadoIAModal}
          onCerrar={() => setRegistroModal(null)}
          onIrAConsulta={handleIrAConsulta}
        />
      )}

      {/* Pie de Página Institucional */}
      <Footer />
    </div>
  );
}
