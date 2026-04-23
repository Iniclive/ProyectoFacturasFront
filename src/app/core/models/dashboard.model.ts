import { Factura } from './factura.model';

export interface DashboardSummary {
  totalClients: number;
  totalFacturado: number;
  totalUsers: number;
  facturasRecientes: Factura[];
}
