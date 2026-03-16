import { computed, inject, Injectable, signal } from "@angular/core";
import { Factura } from "../models/factura.model";
import { FACTURA_INICIAL } from "../constants/factura.constants";
import { LineaStateService } from "./lineas-state.service";

@Injectable({ providedIn: 'root' })
export class FacturaStateService {
  private lineaState = inject(LineaStateService);

  private _factura = signal<Factura>({ ...FACTURA_INICIAL });
  private cargando = signal(false);
  private error = signal<string | null>(null);

  // importeBase reactivo: usa las líneas si están cargadas, si no el valor del back
  importeBase = computed(() => {
    const totalLineas = this.lineaState.importeBase();
    return totalLineas !== null ? totalLineas : (this._factura().importe ?? 0);
  });

  // IVA en euros, reacciona a cambios en importeBase o en el % de IVA
  importeIva = computed(() => {
    const porcentaje = this._factura().tipoIva ?? 0;
    return this.importeBase() * (porcentaje / 100);
  });

  // Total = base + IVA, siempre actualizado
  importeTotal = computed(() => this.importeBase() + this.importeIva());

  // Factura con todos los importes sincronizados
  currentFactura = computed(() => ({
    ...this._factura(),
    importeBase: this.importeBase(),
    importeIva: this.importeIva(),
    importeTotal: this.importeTotal(),
  }));

  cargando$ = this.cargando.asReadonly();
  error$ = this.error.asReadonly();

  setFactura(factura: Factura) {
    this._factura.set(factura);
  }

  resetFactura() {
    this._factura.set({ ...FACTURA_INICIAL });
  }

  actualizarFactura(cambios: Partial<Factura>) {
    this._factura.update((f) => ({ ...f, ...cambios }));
  }

  setCargando(valor: boolean) {
    this.cargando.set(valor);
  }

  setError(mensaje: string | null) {
    this.error.set(mensaje);
  }
}

