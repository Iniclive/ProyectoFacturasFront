import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of, switchMap, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Factura, FacturaCreate, FacturaSimple, FacturaUpdate } from '../models/factura.model';
import { FACTURA_INICIAL } from '../constants/factura.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapearAFacturaSimple } from '../mappers/factura.mapper';
import { FacturaStateService } from './facturas-state.service';
//import { ErrorService } from '../compartido/compartido/error.service';
@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private httpClient = inject(HttpClient);
  //private errorService = inject(ErrorService)
  private listaFacturasSimple = signal<FacturaSimple[]>([]);
  private listaFacturasCompleta = signal<Factura[]>([]);
  facturasSimple = this.listaFacturasSimple.asReadonly();
  facturasCompleto = this.listaFacturasCompleta.asReadonly();
  private estadoFactura = inject(FacturaStateService);
  private destroyRef = inject(DestroyRef);

  //private destroyRef = inject(DestroyRef);

  cargarFacturasSimple() {
    return this.httpClient.get<FacturaSimple[]>(ENDPOINTS.FACTURAS_SIMPLE).pipe(
      tap((facturas) => {
        this.listaFacturasSimple.set(facturas);
      }),
      catchError((err) => {
        console.error(err);
        //this.errorService.mostrarerror('Error al cargar lugares disponibles');
        return throwError(() => new Error('Error en API'));
      }),
    );
  }

  cargarFacturaId(id: string) {
    if (id === 'nueva') {
      this.estadoFactura.resetFactura();
      return of({ ...FACTURA_INICIAL });
    }

    return this.httpClient.get<Factura>(ENDPOINTS.FACTURA_POR_ID(id)).pipe(
      tap((datos) => this.estadoFactura.setFactura(datos)),
      catchError((err) => {
        this.estadoFactura.setError('Error al cargar factura');
        return throwError(() => err);
      }),
    );
  }

  guardarFactura(factura: FacturaCreate) {
    return this.httpClient.post<Factura>(ENDPOINTS.FACTURAS, factura).pipe(
      tap((nuevaFactura) => {
        this.estadoFactura.setFactura(nuevaFactura);
        this.listaFacturasSimple.update((lista) => [mapearAFacturaSimple(nuevaFactura), ...lista]);
      }),
    );
  }

  actualizarFactura(factura: FacturaUpdate) {
    return this.httpClient.put<Factura>(ENDPOINTS.FACTURAS, factura).pipe(
      tap((nuevaFactura) => {
        this.estadoFactura.setFactura(nuevaFactura);
        //this.listaFacturasSimple.update((lista) => [mapearAFacturaSimple(nuevaFactura), ...lista]);
      }),
    );
  }

  eliminarFactura(idFac: string) {
    const facturasPrevias = [...this.listaFacturasSimple()];
    this.listaFacturasSimple.update((lista) => lista.filter((f) => String(f.idFactura) !== String(idFac)));

    return this.httpClient
      .delete(ENDPOINTS.FACTURA_POR_ID(idFac))
      .pipe(
        catchError((err) => {
          this.listaFacturasSimple.set(facturasPrevias);
          console.log(err);
          return throwError(() => err);
        }),
      );

  }
}

