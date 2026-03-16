// services/lineas-factura.service.ts
import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { FacturaUpdateDto, LineaFactura } from '../models/linea-factura.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LineaStateService } from './lineas-state.service';
import { FacturaStateService } from './facturas-state.service';
import { FacturaUpdateResponseDto } from '../models/factura.model';

@Injectable({ providedIn: 'root' })
export class LineasFacturaService {
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private lineaState = inject(LineaStateService);
  private facturaState = inject(FacturaStateService);

  cargarLineas(idFactura: number) {
    return this.httpClient
      .get<LineaFactura[]>(ENDPOINTS.LINEAS_POR_FACTURA(idFactura))
      .pipe(
        tap((lineas) => this.lineaState.setLineas(lineas)),
        catchError((err) => {
          this.lineaState.setError('Error al cargar líneas');
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
      );
  }

  guardarLineas(idFactura: number) {
    const payload: FacturaUpdateDto = {
      idFactura,
      lineas: this.lineaState.lineas().map(({ idLineaFactura, idMaterial, importe, cantidad }) => ({
        idLineaFactura,
        idMaterial,
        importe,
        cantidad,
      })),
    };

    return this.httpClient
      .put<FacturaUpdateResponseDto>(ENDPOINTS.LINEAS_POR_FACTURA(idFactura), payload)
      .pipe(
        tap((res) => {
          this.lineaState.setLineas(res.lineas);
          this.facturaState.setFactura(res.factura);
        }),
        catchError((err) => {
          this.lineaState.setError('Error al guardar líneas');
          return throwError(() => err);
        }),
      );
  }

}
