/**
 * Barra de navegación corporativa EPM con selector de temas y accesos rápidos
 */

import React from 'react';
import {
  FileText,
  Search,
  LayoutDashboard,
  Code2,
  Moon,
  Sun,
  PhoneCall,
  ShieldAlert,
  Droplet,
  Zap,
  Flame,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'formulario' | 'consulta' | 'tablero' | 'codigo';
  setActiveTab: (tab: 'formulario' | 'consulta' | 'tablero' | 'codigo') => void;
  isDark: boolean;
  toggleTheme: () => void;
  totalCasos: number;
  casosUrgentes: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  totalCasos,
  casosUrgentes,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top emergency ribbon */}
      <div className="bg-emerald-800 dark:bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 flex flex-wrap justify-between items-center border-b border-emerald-900/50">
        <div className="flex items-center gap-4">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Empresas Públicas de Medellín E.S.P.
          </span>
          <span className="hidden md:inline text-emerald-200/80">|</span>
          <span className="hidden md:inline text-emerald-200/90 text-xs">
            Portal Oficial de Atención y Radicación de PQRS con IA
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-emerald-200 hover:text-white transition">
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="font-medium">Línea gratuita: 01 8000 415 115</span>
          </div>
          <span className="text-emerald-300 font-bold bg-emerald-900/80 px-2 py-0.5 rounded text-[11px] border border-emerald-700/60">
            Emergencias: 115
          </span>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('formulario')}>
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white shadow-md shadow-emerald-700/20">
              <div className="relative">
                <div className="text-lg font-black tracking-tight flex items-baseline">
                  <span>epm</span>
                  <span className="w-2 h-2 rounded-full bg-teal-300 ml-0.5 animate-pulse"></span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  PQRS <span className="text-emerald-700 dark:text-emerald-400">Inteligente</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  IA Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Enrutamiento y Clasificación Inmediata
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/70 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setActiveTab('formulario')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'formulario'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Radicar PQRS</span>
            </button>

            <button
              onClick={() => setActiveTab('consulta')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'consulta'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Consultar Radicado</span>
            </button>

            <button
              onClick={() => setActiveTab('tablero')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all relative ${
                activeTab === 'tablero'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Gestión EPM</span>
              {casosUrgentes > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-red-600 text-white animate-pulse">
                  {casosUrgentes}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('codigo')}
              className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'codigo'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Código & Archivos</span>
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Quick stats badge */}
            <div className="hidden xl:flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <span className="text-slate-500 dark:text-slate-400">Total Casos:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{totalCasos}</span>
            </div>

            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Cambiar tema visual"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Tabs */}
        <div className="lg:hidden flex items-center justify-between gap-1 pb-3 overflow-x-auto pt-1">
          <button
            onClick={() => setActiveTab('formulario')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'formulario'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Radicar</span>
          </button>
          <button
            onClick={() => setActiveTab('consulta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'consulta'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Consultar</span>
          </button>
          <button
            onClick={() => setActiveTab('tablero')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'tablero'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Gestión</span>
          </button>
          <button
            onClick={() => setActiveTab('codigo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap ${
              activeTab === 'codigo'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Código</span>
          </button>
        </div>
      </div>
    </header>
  );
};
