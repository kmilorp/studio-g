/**
 * Pie de página institucional oficial de Empresas Públicas de Medellín (EPM)
 */

import React from 'react';
import {
  PhoneCall,
  MapPin,
  Clock,
  ShieldCheck,
  ExternalLink,
  Mail,
  HelpCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Institucional */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                epm
              </div>
              <span className="text-white font-extrabold text-sm tracking-tight">
                Empresas Públicas de Medellín E.S.P.
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Prestadores de servicios públicos domiciliarios de Energía, Gas Natural, Agua y
              Alcantarillado en Medellín, el Valle de Aburrá y el departamento de Antioquia.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">NIT: 890.904.996-1</p>
          </div>

          {/* Col 2: Líneas de Atención */}
          <div className="space-y-2.5">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">
              Líneas de Atención Ciudadana
            </h3>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Línea Gratuita Nacional:</strong>
                  <div>01 8000 415 115</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded bg-red-600/20 text-red-400 flex items-center justify-center font-bold text-[10px] mt-0.5">
                  !
                </span>
                <div>
                  <strong className="text-red-400">Emergencias 24 Horas:</strong>
                  <div>115 (Energía, Gas y Acueducto)</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-200">Medellín y Valle de Aburrá:</strong>
                  <div>(604) 44 44 115</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 3: Sedes Principales */}
          <div className="space-y-2.5">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">
              Sede Principal y Horarios
            </h3>
            <div className="flex items-start gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">Edificio EPM (Inteligente)</p>
                <p>Carrera 58 # 42 - 125</p>
                <p>Medellín, Colombia</p>
              </div>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-200 font-semibold">Atención Presencial</p>
                <p>Lunes a Viernes: 8:00 a.m. - 5:00 p.m.</p>
              </div>
            </div>
          </div>

          {/* Col 4: Transparencia y Normatividad */}
          <div className="space-y-2.5">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider">
              Normatividad y Calidad
            </h3>
            <ul className="space-y-1.5 text-xs">
              <li className="hover:text-emerald-400 transition cursor-pointer">
                Ley 142 de 1994 (Servicios Públicos)
              </li>
              <li className="hover:text-emerald-400 transition cursor-pointer">
                Política de Tratamiento de Datos Personales
              </li>
              <li className="hover:text-emerald-400 transition cursor-pointer">
                Carta de Trato Digno al Ciudadano
              </li>
              <li className="hover:text-emerald-400 transition cursor-pointer">
                Términos y Condiciones del Portal PQRS
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-semibold mt-2">
                <ShieldCheck className="w-4 h-4" />
                <span>Certificación ISO 10002 en PQRS</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra Inferior */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Empresas Públicas de Medellín E.S.P. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Vigilado Superservicios</span>
            <span>•</span>
            <span>Sistema Inteligente de Gestión de Incidentes EPM</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
