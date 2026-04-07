import { Injectable, signal } from "@angular/core";
import { Factura } from "../models/factura.model";
import { FACTURA_INICIAL } from "../constants/factura.constants";

// factura-state.service.ts — solo estado, cero HTTP
@Injectable({ providedIn: 'root' })
export class FacturaStateService {
  private facturaSeleccionada = signal<Factura>({ ...FACTURA_INICIAL });
  private cargando = signal(false);
  private error = signal<string | null>(null);

  // API pública
  currentFactura = this.facturaSeleccionada.asReadonly();
  cargando$ = this.cargando.asReadonly();
  error$ = this.error.asReadonly();

  setFactura(factura: Factura) {
    this.facturaSeleccionada.set(factura);
  }

  resetFactura() {
    this.facturaSeleccionada.set({ ...FACTURA_INICIAL });
  }

  actualizarFactura(cambios: Partial<Factura>) {
    this.facturaSeleccionada.update((f) => ({ ...f, ...cambios }));
  }

  actualizarFacturaIva(cambios: Partial<Factura>) {
    this.facturaSeleccionada.update((f) => {

      const facturaActualizada = { ...f, ...cambios };
      const base = facturaActualizada.importe || 0;
      const tipo = facturaActualizada.tipoIva || 0;
      const importeIva = +(base * tipo / 100).toFixed(2);
      const importeTotal = +(base + importeIva).toFixed(2);

    return { ...facturaActualizada, importeIva, importeTotal };
    });
  }

  setCargando(valor: boolean) {
    this.cargando.set(valor);
  }

  setError(mensaje: string | null) {
    this.error.set(mensaje);
  }
}
