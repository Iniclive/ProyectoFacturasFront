import { LineaFactura, LineaFacturaCreate, LineaFacturaUpdate, LineaSimple } from '../../features/lineas-factura/linea-factura.model';


export function mapearALineaSimple(l: LineaFactura): LineaSimple {
  return {
    idLineaFactura: l.idLineaFactura,
    idFactura: l.idFactura,
    cantidad: l.cantidad || 0,
    importe: l.importe || 0,
    importeTotal: l.importeTotal || 0,
    productName: l.productName || '',
  };
}
export function mapearALineaFacturaCreate(l: LineaFactura): LineaFacturaCreate {
  return {
    idFactura: l.idFactura,
    productId: l.productId,
    importe: l.importe,
    cantidad: l.cantidad,
  } as LineaFacturaCreate;
}

export function mapearALineaFacturaUpdate(l: LineaFactura): LineaFacturaUpdate {
  return {
    idLineaFactura: l.idLineaFactura!,
    idFactura: l.idFactura,
    productId: l.productId,
    importe: l.importe,
    cantidad: l.cantidad,
  };
}
/*
export function mapearALineaFacturaBulkCreate(linea: LineaFactura): LineaFacturaBulkCreate {
  return {
    productId: linea.productId,
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
}*/
