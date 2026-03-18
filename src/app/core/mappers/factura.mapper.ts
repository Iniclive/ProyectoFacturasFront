import { Factura, FacturaCreate, FacturaSimple, FacturaUpdate } from "../models/factura.model";
export function mapearAFacturaCreate(f: Factura): FacturaCreate {
  return {
    numeroFactura: f.numeroFactura,
    fechaFactura: f.fechaFactura,
    aseguradora: f.aseguradora,
    importe: f.importe,
    tipoIva: f.tipoIva,
    status: f.status
  };
}

export function mapearAFacturaUpdate(f: Factura): FacturaUpdate {
  return {
    idFactura: f.idFactura,
    numeroFactura: f.numeroFactura,
    fechaFactura: f.fechaFactura,
    aseguradora: f.aseguradora,
    importe: f.importe,
    tipoIva: f.tipoIva,
    status: f.status
  };
}
export function mapearAFacturaSimple(f: Factura): FacturaSimple {
  return {
    idFactura: f.idFactura,
    numeroFactura: f.numeroFactura || '',
    nombreAseguradora: f.nombreAseguradora || '',
    importe: f.importe || 0,
    tipoIva: f.tipoIva || 0,
    importeTotal: f.importeTotal || 0
  };
}
