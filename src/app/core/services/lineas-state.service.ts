import { computed, Injectable, signal } from "@angular/core";
import { LineaEstado, LineaFactura, LineaFacturaCreate, LineaFacturaTracked } from "../models/linea-factura.model";

@Injectable({ providedIn: 'root' })
export class LineaStateService {
  private lineasTracked = signal<LineaFacturaTracked[]>([]);

  // Vista pública solo de los datos
  lineas = computed(() =>
  this.lineasTracked()
    .filter(l => l.estado !== 'eliminada')
    .map(l => l.datos)
);

  // Solo las líneas que hay que persistir
  lineasPendientes = computed(() =>
  this.lineasTracked().filter(l => l.estado !== 'sin_cambios')
);

  importeBase = computed(() =>
    this.lineas().reduce((acc, l) => acc + l.cantidad * l.importe, 0)
  );

 hayPendientes = computed(() => this.lineasPendientes().length > 0);

  // Carga inicial desde API — todas como sin_cambios
  setLineas(lineas: LineaFactura[]) {
    this.lineasTracked.set(
      lineas.map(l => ({ datos: l, estado: 'sin_cambios' }))
    );
  }

  agregarLinea(linea: LineaFactura) {
    this.lineasTracked.update(lista => [
      ...lista,
      { datos: linea, estado: 'nueva' }
    ]);
  }

  modificarLinea(index: number, cambios: Partial<LineaFacturaCreate>) {
    this.lineasTracked.update(lista =>
      lista.map((l, i) => {
        if (i !== index) return l;
        return {
          datos: { ...l.datos, ...cambios },
          // Si ya era nueva, sigue siendo nueva
          estado: l.estado === 'nueva' ? 'nueva' : 'modificada'
        };
      })
    );
  }

  eliminarLinea(index: number) {
  this.lineasTracked.update(lista =>
    lista.map((l, i) => {
      if (i !== index) return l;
      // Si era nueva y aún no está en BD, simplemente la quitamos
      if (l.estado === 'nueva') return null;
      // Si ya existía en BD, la marcamos para borrar
      return { ...l, estado: 'eliminada' as LineaEstado };
    }).filter(Boolean) as LineaFacturaTracked[]
  );
}

  // Tras guardar con éxito, resetea el estado de todas
  confirmarGuardado() {
    this.lineasTracked.update(lista =>
      lista.map(l => ({ ...l, estado: 'sin_cambios' }))
    );
  }
}
