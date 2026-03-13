import { computed, DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { FacturaLineasUpdateDto, LineaFactura, LineaFacturaCreate, LineaSimple } from '../models/linea-factura.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LINEA_INICIAL } from '../constants/linea-factura.constants';
import { mapearAFacturaLineasUpdateDto, mapearALineaSimple } from '../mappers/linea-factura.mapper';
import { LineaStateService } from './lineas-state.service';


@Injectable({
  providedIn: 'root',
})
export class LineasFacturaService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  private listaLineasSimple = signal<LineaSimple[]>([]);
  private listaLineasCompleta = signal<LineaFactura[]>([]);

  lineasSimple = this.listaLineasSimple.asReadonly();
  lineasCompleto = this.listaLineasCompleta.asReadonly();
  lineaState = inject(LineaStateService);
  private lineaSeleccionada = signal<LineaFactura>({ ...LINEA_INICIAL });
  currentLinea = this.lineaSeleccionada.asReadonly();
  importeBase = computed(() =>
  this.lineasCompleto().reduce((acc, linea) => acc + linea.cantidad * linea.importe, 0)
    );
  cargarLineasSimple(idFactura: string) {
    return this.httpClient.get<LineaSimple[]>(ENDPOINTS.LINEAS_SIMPLE(idFactura)).pipe(
      tap((lineas) => {
        this.listaLineasSimple.set(lineas);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  cargarLineaId(id: string) {
    if (id === 'nueva') {
      this.lineaSeleccionada.set({ ...LINEA_INICIAL });
      return;
    }
    return this.httpClient
      .get<LineaFactura>(ENDPOINTS.LINEA_POR_ID(id))
      .pipe(
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error en API'));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (datos) => {
          console.log('¡Datos de línea cargados!', datos);
          this.lineaSeleccionada.set(datos);
        },
      });
  }

  guardarLinea(linea: LineaFacturaCreate) {
    return this.httpClient.post<LineaFactura>(ENDPOINTS.LINEAS, linea).pipe(
      tap((nuevaLinea) => {
        this.lineaSeleccionada.set(nuevaLinea);
        this.listaLineasSimple.update((lista) => [mapearALineaSimple(nuevaLinea), ...lista]);
      }),
    );
  }
  //Envia los cambios es todas las lineas a la vez, junto con el importe base
guardarLineas(idFactura: number) {
  const pendientes = this.lineaState.lineasPendientes();
  if (pendientes.length === 0) return of(null);

  const payload = mapearAFacturaLineasUpdateDto(
    idFactura,
    this.lineaState.importeBase(),
    pendientes
  );

  return this.httpClient.put(ENDPOINTS.FACTURA_LINEAS(idFactura), payload).pipe(
    tap(() => this.lineaState.confirmarGuardado())
  );
}

  actualizarLineaSeleccionada(cambios: Partial<LineaFactura>) {
    this.lineaSeleccionada.update((l) => ({
      ...l,
      ...cambios,
    }));
  }

  eliminarLinea(idLinea: string) {
    const lineasPrevias = [...this.listaLineasSimple()];
    this.listaLineasSimple.update((lista) =>
      lista.filter((l) => String(l.idLineaFactura) !== String(idLinea))
    );

    return this.httpClient.delete(ENDPOINTS.LINEA_POR_ID(idLinea)).pipe(
      catchError((err) => {
        this.listaLineasSimple.set(lineasPrevias);
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
}
