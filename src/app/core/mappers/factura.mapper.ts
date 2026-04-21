import { Factura, FacturaCreate, FacturaSimple, FacturaUpdate, StatusTransitionPayload } from "../models/factura.model";
export function mapearAFacturaCreate(f: Factura): FacturaCreate {
  return {
    numeroFactura: f.numeroFactura,
    fechaFactura: f.fechaFactura,
    aseguradora: f.aseguradora,
    importe: f.importe,
    tipoIva: f.tipoIva,
    clientId: f.clientId,
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
    clientId: f.clientId,
    status: f.status,
    entityRowVersion: f.entityRowVersion
  };
}
export function mapearAFacturaSimple(f: Factura): FacturaSimple {
  return {
    idFactura: f.idFactura,
    numeroFactura: f.numeroFactura || '',
    insuranceName: f.insuranceName || '',
    importe: f.importe || 0,
    tipoIva: f.tipoIva || 0,
    importeTotal: f.importeTotal || 0
  };
}

export function mapFacturaToStatusPayload(f: Factura): StatusTransitionPayload {
  return {
    idFactura: f.idFactura,
    entityRowVersion: f.entityRowVersion
  };
}
