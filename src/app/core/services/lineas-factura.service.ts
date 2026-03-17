import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { LineaFactura, LineaFacturaCreate, LineaFacturaResponse, LineaFacturaUpdate } from '../models/linea-factura.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LineaStateService } from './lineas-state.service';
import { FacturaStateService } from './facturas-state.service';
import { FacturaResumen } from '../models/factura.model';

@Injectable({ providedIn: 'root' })
export class LineasFacturaService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private lineaState = inject(LineaStateService);
  private facturaState = inject(FacturaStateService);
  private _lineas = signal<LineaFactura[]>([]);

  lineas = this._lineas.asReadonly();
  lineaSeleccionada = this.lineaState.lineaSeleccionada;
  importeBase = computed(() =>
    this._lineas().reduce((acc, l) => acc + l.cantidad * l.importe, 0)
  );

  cargarLineas(idFactura: string) {
    return this.httpClient.get<LineaFactura[]>(ENDPOINTS.LINEAS_FACTURA(idFactura)).pipe(
      tap((lineas) => this._lineas.set(lineas)),
      catchError((err) => throwError(() => err)),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  cargarLineaId(id: string) {
    if (id === 'nueva') {
      this.lineaState.reset();
      return;
    }
    const linea = this._lineas().find((l) => String(l.idLineaFactura) === id);
    if (linea) this.lineaState.seleccionar(linea);
  }

  actualizarLineaSeleccionada(cambios: Partial<LineaFactura>) {
    this.lineaState.actualizar(cambios);
  }

  guardarLinea(linea: LineaFacturaCreate) {
    return this.httpClient.post<LineaFacturaResponse>(ENDPOINTS.LINEAS, linea).pipe(
      tap((nueva) => {
        this.lineaState.seleccionar(nueva.linea);
        this._lineas.update((lista) => [nueva.linea, ...lista]);
        this.facturaState.actualizarFactura(nueva.factura)
      }),
    );
  }

  actualizarLinea(linea: LineaFacturaUpdate) {
    return this.httpClient.put<LineaFacturaResponse>(ENDPOINTS.LINEAS, linea).pipe(
      tap((actualizada) => {
        this._lineas.update((lista) =>
          lista.map((l) => l.idLineaFactura === actualizada.linea.idLineaFactura ? actualizada.linea
        : l)
        );
        this.facturaState.actualizarFactura(actualizada.factura)
      }),
    );
  }

  eliminarLinea(idLinea: number | undefined) {
    const previas = this._lineas();
    this._lineas.update((lista) =>
      lista.filter((l) => l.idLineaFactura !== idLinea)
    );
    return this.httpClient.delete<FacturaResumen>(ENDPOINTS.LINEA_POR_ID(idLinea)).pipe(
      tap((actualizada) => {
       this.facturaState.actualizarFactura(actualizada);
      }),
      catchError((err) => {
        this._lineas.set(previas);
        return throwError(() => err);
      }),
    );
  }
}
