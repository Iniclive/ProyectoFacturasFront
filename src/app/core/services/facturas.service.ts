import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Factura, FacturaCreate, FacturaSimple, FacturaUpdate } from '../models/factura.model';
import { FACTURA_INICIAL } from '../constants/factura.constants';
import { FacturaStateService } from './facturas-state.service';
//import { ErrorService } from '../compartido/compartido/error.service';
@Injectable({
  providedIn: 'root',
})
export class FacturasService {
  private httpClient = inject(HttpClient);
  //private errorService = inject(ErrorService)
  private listaFacturasCompleta = signal<Factura[]>([]);
  facturasCompleto = this.listaFacturasCompleta.asReadonly();
  private estadoFactura = inject(FacturaStateService);
  private destroyRef = inject(DestroyRef);

  //private destroyRef = inject(DestroyRef);

  cargarFacturas() {
    return this.httpClient.get<Factura[]>(ENDPOINTS.FACTURAS).pipe(
      tap((facturas) => {
        this.listaFacturasCompleta.set(facturas);
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
        this.listaFacturasCompleta.update((lista) => [nuevaFactura, ...lista]);
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

  eliminarFactura(idFac: string,rowVersion: string) {
    const facturasPrevias = [...this.listaFacturasCompleta()];
    this.listaFacturasCompleta.update((lista) =>
      lista.filter((f) => String(f.idFactura) !== String(idFac)),
    );
    return this.httpClient.delete(ENDPOINTS.FACTURA_POR_ID(idFac), {
    headers: { 'If-Match': rowVersion} // Convertimos a string para la cabecera
  }).pipe(
      catchError((err) => {
        this.listaFacturasCompleta.set(facturasPrevias);
        console.log(err);
        return throwError(() => err);
      }),
    );
  }

  sendToValidate(idFac: string,rowVersion: string) {
    return this.httpClient.put<Factura>(ENDPOINTS.FACTURA_SEND_TO_VALIDATE(idFac),{
    headers: { 'If-Match': rowVersion}}).pipe(
      tap((updatedInvoice) => {
        this.estadoFactura.setFactura(updatedInvoice);
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
  sendToCancelValidate(idFac: string,rowVersion: string) {
    return this.httpClient.put<Factura>(ENDPOINTS.FACTURA_SEND_TO_CANCEL_VALIDATE(idFac), {}, {
      headers: { 'If-Match': rowVersion }
    }).pipe(
      tap((updatedInvoice) => {
        this.estadoFactura.setFactura(updatedInvoice);
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
  sendToApprove(idFac: string,rowVersion: string) {
    return this.httpClient.put<Factura>(ENDPOINTS.FACTURA_SEND_TO_APPROVE(idFac), {}, {
      headers: { 'If-Match': rowVersion }
    }).pipe(
      tap((updatedInvoice) => {
        this.estadoFactura.setFactura(updatedInvoice);
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => err);
      }),
    );
  }
}
