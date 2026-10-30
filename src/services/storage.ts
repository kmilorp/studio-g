/**
 * Gestión de almacenamiento persistente en LocalStorage y semillas de datos
 * para el sistema de PQRS EPM.
 */

import { EstadoPQR, PQRRecord } from '../types';

const STORAGE_KEY = 'epm_pqrs_records_v1';

/**
 * Genera un número de radicado oficial con formato EPM-YYYY-XXXXXX
 */
export function generarNumeroRadicado(): string {
  const anio = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `EPM-${anio}-${random}`;
}

/**
 * Registros iniciales de ejemplo con casos típicos de Medellín y Antioquia
 */
const CASOS_SEMILLA: PQRRecord[] = [
  {
    id: 'EPM-2026-849201',
    fecha_creacion: '2026-10-29T10:15:00.000Z',
    nombre_completo: 'Carlos Mario Restrepo Vélez',
    tipo_documento: 'CC',
    documento_identidad: '71345892',
    correo_electronico: 'carlos.restrepo@epmmail.co',
    numero_contacto: '3124567890',
    direccion: 'Carrera 76 # 32EE - 14, Barrio Laureles',
    municipio: 'Medellín',
    tipo_servicio_seleccionado: 'Gas Natural',
    descripcion: 'Reporto fuerte olor a gas y aparente fuga de gas en la tubería exterior que conecta la acometida comunitaria con el edificio. Los vecinos están alarmados por el peligro inminente.',
    clasificacion: {
      servicio: 'Gas Natural',
      tipo: 'Reclamo',
      categoria_principal: 'Daños e Infraestructura',
      subcategoria: 'Fuga gas red',
      prioridad: 'Alta',
      area_responsable: 'Unidad de Distribución Gas',
      resumen_corto: 'Emergencia técnica crítica reportada: detección de fuga de gas, olor a gas, peligro inminente con riesgo para la comunidad.',
    },
    estado: 'Cuadrilla Asignada',
    confianza_ia: 98,
    tiempo_estimado_resolucion: '2 horas (Código Rojo)',
    origen_ia: 'gemini-3.8-flash',
    alerta_critica: true,
  },
  {
    id: 'EPM-2026-793412',
    fecha_creacion: '2026-10-28T14:30:00.000Z',
    nombre_completo: 'Mariana Duque Gómez',
    tipo_documento: 'CC',
    documento_identidad: '1037612459',
    correo_electronico: 'mduque@gmail.com',
    numero_contacto: '3009876543',
    direccion: 'Calle 38 Sur # 43A - 20, Barrio San Marcos',
    municipio: 'Envigado',
    tipo_servicio_seleccionado: 'Energía',
    descripcion: 'Inconformidad con la última factura del servicio de energía. El valor llegó por $480.000 cuando el promedio histórico de la vivienda de estrato 3 es de $110.000. No se agregaron nuevos electrodomésticos y el medidor parece haber marcado un salto.',
    clasificacion: {
      servicio: 'Energía',
      tipo: 'Reclamo',
      categoria_principal: 'Facturación y Cobros',
      subcategoria: 'Cobro excesivo',
      prioridad: 'Media',
      area_responsable: 'Área de Facturación Energía',
      resumen_corto: 'Usuario reporta inconformidad con el cobro en factura para el servicio de energía por salto atípico en consumo.',
    },
    estado: 'En Gestión',
    confianza_ia: 95,
    tiempo_estimado_resolucion: '5 días hábiles',
    origen_ia: 'gemini-3.8-flash',
    alerta_critica: false,
  },
  {
    id: 'EPM-2026-652190',
    fecha_creacion: '2026-10-27T09:00:00.000Z',
    nombre_completo: 'Javier Alonso Pérez',
    tipo_documento: 'CC',
    documento_identidad: '98541203',
    correo_electronico: 'javier.perez@outlook.com',
    numero_contacto: '3157849102',
    direccion: 'Calle 50 # 52 - 18, Parque Principal',
    municipio: 'Bello',
    tipo_servicio_seleccionado: 'Aseo/Basuras',
    descripcion: 'Pésima situación con la recolección de basuras en la esquina del parque. El camión recolector no pasa desde hace 4 días y hay acumulación de desechos que genera malos olores y plagas.',
    clasificacion: {
      servicio: 'Aseo/Basuras',
      tipo: 'Queja',
      categoria_principal: 'Daños e Infraestructura',
      subcategoria: 'Acumulación residuos',
      prioridad: 'Media',
      area_responsable: 'Operaciones de Aseo',
      resumen_corto: 'Reporte de acumulación prolongada de residuos y retraso en ruta habitual de recolección de aseo.',
    },
    estado: 'En Atención',
    confianza_ia: 92,
    tiempo_estimado_resolucion: '24 horas',
    origen_ia: 'gemini-3.8-flash',
    alerta_critica: false,
  },
  {
    id: 'EPM-2026-512084',
    fecha_creacion: '2026-10-26T16:45:00.000Z',
    nombre_completo: 'Construcciones Andinas S.A.S.',
    tipo_documento: 'NIT',
    documento_identidad: '900845123-1',
    correo_electronico: 'licitaciones@construandinas.com',
    numero_contacto: '3206541289',
    direccion: 'Carrera 48 # 75 Sur - 120, Las Lomitas',
    municipio: 'Sabaneta',
    tipo_servicio_seleccionado: 'Agua y Alcantarillado',
    descripcion: 'Solicitamos la viabilidad técnica e independización de acometida para 4 locales comerciales nuevos en la urbanización Los Sauces.',
    clasificacion: {
      servicio: 'Agua y Alcantarillado',
      tipo: 'Petición',
      categoria_principal: 'Nuevas Conexiones',
      subcategoria: 'Acometida nueva',
      prioridad: 'Baja',
      area_responsable: 'Gestión Comercial',
      resumen_corto: 'Solicitud ciudadana para trámite e instalación de nueva acometida/matrícula de agua y alcantarillado.',
    },
    estado: 'Radicado',
    confianza_ia: 96,
    tiempo_estimado_resolucion: '15 días hábiles',
    origen_ia: 'gemini-3.8-flash',
    alerta_critica: false,
  },
  {
    id: 'EPM-2026-440182',
    fecha_creacion: '2026-10-25T11:20:00.000Z',
    nombre_completo: 'Beatriz Elena Osorio',
    tipo_documento: 'CC',
    documento_identidad: '43128954',
    correo_electronico: 'beatriz.osorio@yahoo.es',
    numero_contacto: '3189023415',
    direccion: 'Diagonal 55 # 34 - 10, Niquía',
    municipio: 'Bello',
    tipo_servicio_seleccionado: 'Energía',
    descripcion: 'Hubo una fuerte tormenta y vimos cables de alta tensión caídos en la calle peatonal frente a la escuela. Hay riesgo eléctrico inminente para los niños y transeúntes.',
    clasificacion: {
      servicio: 'Energía',
      tipo: 'Reclamo',
      categoria_principal: 'Daños e Infraestructura',
      subcategoria: 'Cables caídos',
      prioridad: 'Alta',
      area_responsable: 'Gestión Comercial',
      resumen_corto: 'Emergencia técnica crítica reportada: detección de cables de alta tensión caídos, riesgo eléctrico con peligro para la comunidad.',
    },
    estado: 'Cerrado',
    confianza_ia: 99,
    tiempo_estimado_resolucion: 'Atendido de emergencia en 1h 15m',
    origen_ia: 'gemini-3.8-flash',
    alerta_critica: true,
  },
];

/**
 * Obtiene todos los radicados guardados en LocalStorage (o inicializa con casos semilla)
 */
export function obtenerTodosLosRadicados(): PQRRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(CASOS_SEMILLA));
      return CASOS_SEMILLA;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return CASOS_SEMILLA;
  } catch (e) {
    console.error('Error al leer de localStorage:', e);
    return CASOS_SEMILLA;
  }
}

/**
 * Guarda un nuevo radicado en la primera posición de la lista
 */
export function guardarNuevoRadicado(registro: PQRRecord): PQRRecord[] {
  const existentes = obtenerTodosLosRadicados();
  const actualizados = [registro, ...existentes];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  } catch (e) {
    console.error('Error al guardar en localStorage:', e);
  }
  return actualizados;
}

/**
 * Actualiza el estado de un radicado
 */
export function actualizarEstadoRadicado(id: string, nuevoEstado: EstadoPQR): PQRRecord[] {
  const existentes = obtenerTodosLosRadicados();
  const actualizados = existentes.map((rec) =>
    rec.id === id ? { ...rec, estado: nuevoEstado } : rec
  );
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
  } catch (e) {
    console.error('Error al actualizar en localStorage:', e);
  }
  return actualizados;
}

/**
 * Busca por radicado o documento de identidad
 */
export function buscarRadicado(termino: string): PQRRecord[] {
  if (!termino.trim()) return obtenerTodosLosRadicados();
  const q = termino.trim().toLowerCase();
  const todos = obtenerTodosLosRadicados();
  return todos.filter(
    (item) =>
      item.id.toLowerCase().includes(q) ||
      item.documento_identidad.toLowerCase().includes(q) ||
      item.nombre_completo.toLowerCase().includes(q) ||
      item.municipio.toLowerCase().includes(q)
  );
}

/**
 * Resumen estadístico para el dashboard
 */
export function obtenerEstadisticasRadicados(registros: PQRRecord[]) {
  const total = registros.length;
  const altas = registros.filter((r) => r.clasificacion.prioridad === 'Alta').length;
  const medias = registros.filter((r) => r.clasificacion.prioridad === 'Media').length;
  const bajas = registros.filter((r) => r.clasificacion.prioridad === 'Baja').length;

  const porServicio: Record<string, number> = {};
  const porArea: Record<string, number> = {};

  registros.forEach((r) => {
    const s = r.clasificacion.servicio;
    porServicio[s] = (porServicio[s] || 0) + 1;
    const a = r.clasificacion.area_responsable;
    porArea[a] = (porArea[a] || 0) + 1;
  });

  return {
    total,
    altas,
    medias,
    bajas,
    porServicio,
    porArea,
  };
}
