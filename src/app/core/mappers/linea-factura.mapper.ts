import { LineaFactura, LineaFacturaCreate, LineaSimple } from '../models/linea-factura.model';


export function mapearALineaSimple(l: LineaFactura): LineaSimple {
  return {
    idLineaFactura: l.idLineaFactura,
    idFactura: l.idFactura,
    cantidad: l.cantidad || 0,
    importe: l.importe || 0,
    importeTotal: l.importeTotal || 0,
    nombreMaterial: l.nombreMaterial || '',
  };
}
export function mapearALineaFacturaCreate(l: LineaFactura): LineaFacturaCreate {
  return {
    idFactura: l.idFactura,
    idMaterial: l.idMaterial,
    importe: l.importe,
    cantidad: l.cantidad,
  };
}
