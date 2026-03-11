import { environment } from '@env/environment';

const API_URL = environment.apiUrl;

export const ENDPOINTS = {
  FACTURAS_SIMPLE: `${API_URL}/api/FacturaSimple`,
  FACTURAS: `${API_URL}/Facturas`,
  FACTURA_POR_ID: (id: string) => `${API_URL}/api/Facturas/${id}`,
  INSURANCES: `${API_URL}/api/Insurance`,
};
