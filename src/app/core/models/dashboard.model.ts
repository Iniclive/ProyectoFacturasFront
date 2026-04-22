import { Factura } from './factura.model';

export interface DashboardSummary {
  totalClientes: number;
  totalFacturado: number;
  totalUsuarios?: number;
  facturasRecientes: Factura[];
}
