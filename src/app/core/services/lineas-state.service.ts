import { computed, Injectable, signal } from "@angular/core";
import { LineaFactura, LineaFacturaCreate, LineaFacturaLocal} from "../models/linea-factura.model";
import { LINEA_INICIAL } from "../constants/linea-factura.constants";

@Injectable({ providedIn: 'root' })
export class LineaStateService {
  private _lineas = signal<LineaFacturaLocal[]>([]);
  lineas = this._lineas.asReadonly();
  private cargando = signal(false);
  private error = signal<string | null>(null);
  cargando$ = this.cargando.asReadonly();
  error$ = this.error.asReadonly();
  importeBase = computed(() =>
    this._lineas().reduce((acc, l) => acc + l.cantidad * l.importe, 0)
  );

  // Carga inicial desde API — asigna _tempId a cada línea
  setLineas(lineas: LineaFactura[]) {
    this._lineas.set(
      lineas.map(l => ({ ...l, _tempId: crypto.randomUUID() }))
    );
  }

  agregarLinea(linea: LineaFacturaCreate) {
    const nueva: LineaFacturaLocal = {
      ...LINEA_INICIAL,
      ...linea,
      _tempId: crypto.randomUUID(),
    };
    this._lineas.update(lista => [...lista, nueva]);
  }

  modificarLinea(tempId: string, cambios: Partial<LineaFacturaCreate>) {
    this._lineas.update(lista =>
      lista.map(l => l._tempId === tempId ? { ...l, ...cambios } : l)
    );
  }

  eliminarLinea(tempId: string) {
    this._lineas.update(lista =>
      lista.filter(l => l._tempId !== tempId)
    );
  }

  // Tras guardar, recarga con los ids reales del back
  setLineasTrasGuardado(lineas: LineaFactura[]) {
    this.setLineas(lineas);
  }

  setCargando(valor: boolean) {
    this.cargando.set(valor);
  }

  setError(mensaje: string | null) {
    this.error.set(mensaje);
  }
}
