import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { LineaFactura, LineaFacturaCreate, LineaSimple } from '../models/linea-factura.model';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LINEA_INICIAL } from '../constants/linea-factura.constants';
import { mapearALineaSimple } from '../mappers/linea-factura.mapper';


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

  private lineaSeleccionada = signal<LineaFactura>({ ...LINEA_INICIAL });
  currentLinea = this.lineaSeleccionada.asReadonly();

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
