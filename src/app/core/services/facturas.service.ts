import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Factura, FacturaSimple } from '../models/factura.model';
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
    return this.httpClient
      .get<Factura>(ENDPOINTS.FACTURA_POR_ID(id))
      .pipe(
        catchError((err) => {
          console.error(err);
          //this.errorService.mostrarerror('Error al cargar lugares de usuario');
          return throwError(() => new Error('Error en API'));
        }),
      );
  }

  guardarFactura(factura: Factura){
     return this.httpClient
      .put(ENDPOINTS.FACTURAS, {
        lugarId: factura,
      })
      .pipe(
        switchMap(() => {
          console.log('PUT exitoso, recargando lista...');
          return this.cargarFacturaId(factura.idFactura); // Devuelve el Observable del GET
        }),
        catchError((err) => {
          //this.errorService.mostrarerror('Error en el proceso de guardado o recarga');
          return throwError(() => err);
        }),
      );


  }
/*
  agregarLugarALugaresUsuario(lugarSeleccionado: Lugar) {
    return this.httpClient
      .put(ENDPOINTS.LUGARES_USUARIO, {
        lugarId: lugarSeleccionado.id,
      })
      .pipe(
        switchMap(() => {
          console.log('PUT exitoso, recargando lista...');
          return this.cargarLugaresUsuario(); // Devuelve el Observable del GET
        }),
        catchError((err) => {
          this.errorService.mostrarerror('Error en el proceso de guardado o recarga');
          return throwError(() => err);
        }),
      );
  }

  eliminarLugarUsuario(lugar: Lugar) {
    const lugaresPrevios = [...this.lugaresDisponibles()];
    this.lugaresDisponibles.update((lugares) =>lugares.filter((l) => l.id !== lugar.id))

    return this.httpClient
      .delete(ENDPOINTS.DETALLE_LUGAR(lugar.id))
      .pipe(
        catchError((err) => {
          this.lugaresDisponibles.set(lugaresPrevios);
          this.errorService.mostrarerror('Error en el proceso de eliminar');
          return throwError(() => err);
        }),
      );

  }*/
}
