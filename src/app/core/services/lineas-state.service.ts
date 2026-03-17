import { Injectable, signal } from "@angular/core";
import { LineaFactura } from "../models/linea-factura.model";
import { LINEA_INICIAL } from "../constants/linea-factura.constants";

@Injectable({ providedIn: 'root' })
export class LineaStateService {
  private _lineaSeleccionada = signal<LineaFactura>({ ...LINEA_INICIAL });
  lineaSeleccionada = this._lineaSeleccionada.asReadonly();

  seleccionar(linea: LineaFactura) {
    this._lineaSeleccionada.set(linea);
  }

  reset() {
    this._lineaSeleccionada.set({ ...LINEA_INICIAL });
  }

  actualizar(cambios: Partial<LineaFactura>) {
    this._lineaSeleccionada.update((l) => ({ ...l, ...cambios }));
  }
}
