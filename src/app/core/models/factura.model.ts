import { LineaFacturaCreate } from "./linea-factura.model";

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

  // Auditoría
  creado: string;
  creadoPor: number;
  modificado: string;
  modificadoPor: number;

  // Campos de la Vista (JOINs)
  nombreUsuario: string | null;
  nombreEstado: string | null;
  nombreAseguradora?: string | null; // Para mostrar el nombre en la lista simple
}


export interface FacturaSimple {
  idFactura: string,
  numeroFactura: string;
  nombreAseguradora: string;
  importe: number;
  tipoIva: number;
  importeTotal: number;
}

export interface FacturaCreate {
  numeroFactura: string | null;
  fechaFactura: string;
  aseguradora: number;
  tipoIva: number | null;
  status: number;
}

export interface FacturaUpdate extends FacturaCreate{
idFactura: string;

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
