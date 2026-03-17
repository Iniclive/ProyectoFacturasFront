import { FacturaLineasUpdateDto, LineaFactura, LineaFacturaBulkCreate, LineaFacturaBulkUpdate, LineaFacturaCreate, LineaFacturaTracked, LineaFacturaUpdate, LineaSimple } from '../models/linea-factura.model';


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
  } as LineaFacturaCreate;
}

export function mapearALineaFacturaUpdate(l: LineaFactura): LineaFacturaUpdate {
  return {
    idLineaFactura: l.idLineaFactura!,
    idFactura: l.idFactura,
    idMaterial: l.idMaterial,
    importe: l.importe,
    cantidad: l.cantidad,
  };
}
// mappers/linea-factura.mapper.ts

export function mapearALineaFacturaBulkCreate(linea: LineaFactura): LineaFacturaBulkCreate {
  return {
    idMaterial: linea.idMaterial,
    idFactura: linea.idFactura,
    importe: linea.importe,
    cantidad: linea.cantidad,
  };
}

export function mapearALineaFacturaBulkUpdate(linea: LineaFactura): LineaFacturaBulkUpdate {
  return {
    idLineaFactura: linea.idLineaFactura!,
    ...mapearALineaFacturaBulkCreate(linea),
  };
}

export function mapearAFacturaLineasUpdateDto(
  idFactura: number,
  importeBase: number,
  pendientes: LineaFacturaTracked[]
): FacturaLineasUpdateDto {
  return {
    idFactura,
    importeBase,
    nuevas: pendientes
      .filter(l => l.estado === 'nueva')
      .map(l => mapearALineaFacturaBulkCreate(l.datos)),
    modificadas: pendientes
      .filter(l => l.estado === 'modificada')
      .map(l => mapearALineaFacturaBulkUpdate(l.datos)),
    eliminadas: pendientes
      .filter(l => l.estado === 'eliminada')
      .map(l => l.datos.idLineaFactura!),
  };
}
