import { Factura } from "../facturas/factura.model";


export interface DashboardSummary {
  totalClients: number;
  totalFacturado: number;
  totalUsers: number;
  facturasRecientes: Factura[];
}
