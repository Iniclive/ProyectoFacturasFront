import { environment } from '@env/environment';

const API_URL = environment.apiUrl;

export const ENDPOINTS = {
  FACTURAS_SIMPLE: `${API_URL}/api/FacturaSimple`,
  FACTURAS: `${API_URL}/api/Facturas`,
  FACTURA_POR_ID: (id: string) => `${API_URL}/api/Facturas/${id}`,
  FACTURA_SEND_TO_VALIDATE: (id: string) => `${API_URL}/api/Facturas/${id}/sendToValidate`,
  FACTURA_SEND_TO_APPROVE: (id: string) => `${API_URL}/api/Facturas/${id}/sendToApprove`,
  FACTURA_SEND_TO_CANCEL_VALIDATE: (id: string) => `${API_URL}/api/Facturas/${id}/sendToCancelValidate`,
  INSURANCES: `${API_URL}/api/Insurance`,
  INSURANCES_FILTERED: (searchString: string) => `${API_URL}/api/Insurance/${searchString}`,
  LINEAS: `${API_URL}/api/LineasFactura`,
  LINEAS_FACTURA: (idFactura: string) => `${API_URL}/api/LineasFactura?idFactura=${idFactura}`,
  LINEA_POR_ID: (id: number|undefined) => `${API_URL}/api/LineasFactura/${id}`,
  MATERIALS: `${API_URL}/api/Material`,
  FACTURA_LINEAS: (idFactura: number) => `${API_URL}/api/Facturas/${idFactura}/lineas`,
  AUTH_REGISTRO: `${API_URL}/api/Auth/register`,
  AUTH_LOGIN: `${API_URL}/api/Auth/login`,
  AUTH_LOGOUT: `${API_URL}/api/Auth/logout`,
  AUTH_ME: `${API_URL}/api/Auth/me`,
  USERS: `${API_URL}/api/Users`,
  USERS_ID: (id: string) => `${API_URL}/api/Users/${id}`,
  CLIENTS: `${API_URL}/api/Clients`,
  CLIENTS_ID: (id: string) => `${API_URL}/api/Clients/${id}`,

};
