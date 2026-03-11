import { Factura, FacturaCreate, FacturaSimple } from "../models/factura.model";
export function mapearAFacturaCreate(f: Factura): FacturaCreate {
  return {
    numeroFactura: f.numeroFactura,
    fechaFactura: f.fechaFactura,
    aseguradora: f.aseguradora,
    importe: f.importe,
    tipoIva: f.tipoIva,
    importeIva: f.importeIva,
    importeTotal: f.importeTotal,
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
