// models/linea-factura.model.ts

import { FacturaResumen } from "./factura.model";

export interface LineaSimple {
  idLineaFactura?: number;
  idFactura: number;
  cantidad: number;
  importe: number;
  importeTotal: number;
  nombreMaterial: string;
}

// DTO para crear una línea individual — back calcula importeTotal
export interface LineaFacturaCreate {
  idMaterial: number;
  idFactura: number;
  importe: number;
  cantidad: number;
}

// DTO para modificar una línea individual — con id obligatorio
export interface LineaFacturaUpdate extends LineaFacturaCreate {
  idLineaFactura: number;
}

// Modelo completo con auditoría — idLineaFactura opcional para líneas nuevas no persistidas
export interface LineaFactura {
  idLineaFactura?: number;
  idFactura: number;
  idMaterial: number;
  importe: number;
  cantidad: number;
  importeTotal: number;
  creado: string;
  creadoPor: string;
  modificado: string;
  modificadoPor: string;
  nombreMaterial: string;
}

// DTO para envío en bloque — front no envía importeTotal, back lo calcula por línea
export interface LineaFacturaBulkCreate {
  idMaterial: number;
  idFactura: number;
  importe: number;
  cantidad: number;
}

// DTO para modificar en bloque — igual que bulk create pero con id obligatorio
export interface LineaFacturaBulkUpdate extends LineaFacturaBulkCreate {
  idLineaFactura: number;
}

// DTO completo que se envía al endpoint bulk
export interface FacturaLineasUpdateDto {
  idFactura: number;
  importeBase: number;        // calculado en front: suma de (importe * cantidad) de todas las líneas
  nuevas: LineaFacturaBulkCreate[];
  modificadas: LineaFacturaBulkUpdate[];
  eliminadas: number[];       // solo los ids
}

// Tracking de estado para gestión reactiva en el front
export type LineaEstado = 'nueva' | 'modificada' | 'eliminada' | 'sin_cambios';

export interface LineaFacturaTracked {
  datos: LineaFactura;
  estado: LineaEstado;
}

export interface LineaFacturaResponse {
  linea: LineaFactura;
  factura: FacturaResumen;
}

