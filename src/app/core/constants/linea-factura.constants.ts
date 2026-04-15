import { LineaFactura } from "../models/linea-factura.model";

export const LINEA_INICIAL: LineaFactura = {
  // Identificadores
  idLineaFactura: 0,
  productId: 0,
  idFactura: 0,
  // Datos Numéricos
  importe: 0,
  cantidad: 0,
  importeTotal: 0,

  // Auditoría
  creado: '',
  creadoPor: '',
  modificado: '',
  modificadoPor: '',

  // Campos de la Vista
  productName: '',
};
