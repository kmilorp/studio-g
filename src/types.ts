/**
 * Definiciones de tipos y contratos de datos para el sistema PQRS Inteligente EPM
 */

export type Servicio =
  | 'Energía'
  | 'Agua y Alcantarillado'
  | 'Gas Natural'
  | 'Aseo/Basuras'
  | 'General';

export type TipoPQRS = 'Petición' | 'Queja' | 'Reclamo' | 'Sugerencia';

export type CategoriaPrincipal =
  | 'Facturación y Cobros'
  | 'Daños e Infraestructura'
  | 'Continuidad del Servicio (Cortes)'
  | 'Nuevas Conexiones'
  | 'Atención y Canales';

export type Prioridad = 'Alta' | 'Media' | 'Baja';

export type AreaResponsable =
  | 'Dirección Operativa Agua'
  | 'Área de Facturación Energía'
  | 'Unidad de Distribución Gas'
  | 'Gestión Comercial'
  | 'Operaciones de Aseo'
  | 'Atención Ciudadana';

export type TipoDocumento = 'CC' | 'CE' | 'Pasaporte' | 'NIT';

export interface PQRClassification {
  servicio: Servicio;
  tipo: TipoPQRS;
  categoria_principal: CategoriaPrincipal;
  subcategoria: string;
  prioridad: Prioridad;
  area_responsable: AreaResponsable;
  resumen_corto: string;
}

export type EstadoPQR =
  | 'Radicado'
  | 'En Gestión'
  | 'Cuadrilla Asignada'
  | 'En Atención'
  | 'Cerrado';

export interface PQRRecord {
  id: string; // Ej: EPM-2026-894210
  fecha_creacion: string;
  nombre_completo: string;
  tipo_documento: TipoDocumento;
  documento_identidad: string;
  correo_electronico: string;
  numero_contacto: string;
  direccion: string;
  municipio: string;
  tipo_servicio_seleccionado: string;
  descripcion: string;
  clasificacion: PQRClassification;
  estado: EstadoPQR;
  confianza_ia: number;
  tiempo_estimado_resolucion: string;
  origen_ia: 'gemini-3.8-flash' | 'motor-reglas-epm';
  alerta_critica?: boolean;
}

export interface ClasificacionResult {
  data: PQRClassification;
  confianza: number;
  origen: 'gemini-3.8-flash' | 'motor-reglas-epm';
  tiempo_ms: number;
  terminos_criticos_detectados: string[];
}
