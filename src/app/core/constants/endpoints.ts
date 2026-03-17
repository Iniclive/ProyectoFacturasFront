import { environment } from '@env/environment';

const API_URL = environment.apiUrl;

export const ENDPOINTS = {
  FACTURAS_SIMPLE: `${API_URL}/api/FacturaSimple`,
  FACTURAS: `${API_URL}/api/Facturas`,
  FACTURA_POR_ID: (id: string) => `${API_URL}/api/Facturas/${id}`,
  INSURANCES: `${API_URL}/api/Insurance`,
  LINEAS: `${API_URL}/api/LineasFactura`,
  LINEAS_FACTURA: (idFactura: string) => `${API_URL}/api/LineasFactura?idFactura=${idFactura}`,
  LINEA_POR_ID: (id: number|undefined) => `${API_URL}/api/LineasFactura/${id}`,
  MATERIALS: `${API_URL}/api/Material`,
  FACTURA_LINEAS: (idFactura: number) => `${API_URL}/api/Facturas/${idFactura}/lineas`,
};
