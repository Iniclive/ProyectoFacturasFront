// models/linea-factura.model.ts

export interface LineaSimple {
  idLineaFactura?: number;
  idFactura: number;
  cantidad: number;
  importe: number;
  importeTotal: number;
  nombreMaterial: string;
}

export interface LineaFacturaCreate {
  idMaterial: number;
  idFactura: number;
  importe: number;
  cantidad: number;
  nombreMaterial: string;   // necesario para mostrar en tabla antes de guardar
  importeTotal: number;
}

// Modelo completo — idLineaFactura opcional para líneas nuevas no persistidas
export interface LineaFactura {
  idLineaFactura?: number;   // undefined = nueva, número = existente
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

// DTO que se envía al endpoint — el back recibe todo y hace el diff
export interface FacturaUpdateDto {
  idFactura: number;
  lineas: LineaFacturaDto[];
}

// Una línea en el DTO: id opcional (sin id = nueva para el back)
export interface LineaFacturaDto {
  idLineaFactura?: number;
  idMaterial: number;
  importe: number;
  cantidad: number;
}
export interface LineaFacturaLocal extends LineaFactura {
  _tempId: string;
}
