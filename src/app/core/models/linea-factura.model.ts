export interface LineaSimple {
  idLineaFactura: number;
  idFactura: number;
  cantidad: number;
  importe: number;
  importeTotal: number;
  nombreMaterial: string;
}

export interface LineaSimpleCreate {
  cantidad: number;
  idFactura: number;
  importe: number;
  nombreMaterial: string;
}

export interface LineaFactura {
  idLineaFactura: number;
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

export interface LineaFacturaCreate {
  idMaterial: number;
  idFactura: number; 
  importe: number;
  cantidad: number;
}
