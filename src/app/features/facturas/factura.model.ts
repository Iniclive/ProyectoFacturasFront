import { LineaFacturaCreate } from "../lineas-factura/linea-factura.model";


export interface Factura {
  // Identificadores y Claves
  idFactura: string; // En C# es Int32
  numeroFactura: string | null;
  fechaFactura: string; // Las fechas en JSON viajan como string (ISO 8601)

  // Relaciones y Datos Numéricos
  aseguradora: number;
  importe: number | null; // Decimal? -> number
  tipoIva: number | null;
  importeIva: number | null;
  importeTotal: number | null;
  status: number;
  clientId: number;

  // Auditoría
  creado: string;
  creadoPor: number;
  modificado: string;
  modificadoPor: number;
  entityRowVersion: number;

  // Campos de la Vista (JOINs)
  clientLegalName: string | null;
  clientCif: string | null;
  userName: string | null;
  statusName: string | null;
  insuranceName?: string | null; // Para mostrar el nombre en la lista simple
}


export interface FacturaSimple {
  idFactura: string,
  numeroFactura: string;
  insuranceName: string;
  importe: number;
  tipoIva: number;
  importeTotal: number;
}

export interface FacturaCreate {
  numeroFactura: string | null;
  fechaFactura: string;
  aseguradora: number;
  importe: number|null;
  tipoIva: number | null;
  clientId: number;
  status: number;
}

export interface FacturaUpdate extends FacturaCreate{
idFactura: string;
entityRowVersion: number;
}

export interface FacturaLineasCreate {
  idFactura: number;
  lineas: LineaFacturaCreate[];
  importeBase: number; // suma de todos los subtotales, calculado en front
}


export interface FacturaResumen{
importe: number | null;
importeIva: number | null;
importeTotal: number | null;
modificado: string;
modificadoPor: number;
}

export interface StatusTransitionPayload{
idFactura: string;
entityRowVersion: number;
}
