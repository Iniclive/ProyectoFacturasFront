import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Factura, FacturaCreate, FacturaSimple } from '../models/factura.model';
import { FACTURA_INICIAL } from '../constants/factura.constants';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { mapearAFacturaSimple } from '../mappers/factura.mapper';
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
  private facturaSeleccionada = signal<Factura>({ ...FACTURA_INICIAL });
  currentFactura = this.facturaSeleccionada.asReadonly();
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
      takeUntilDestroyed(this.destroyRef),
    );
  }

  cargarFacturaId(id: string) {
    if (id === 'nueva') {
      this.facturaSeleccionada.set({ ...FACTURA_INICIAL });
      return;
    }
    return this.httpClient
      .get<Factura>(ENDPOINTS.FACTURA_POR_ID(id))
      .pipe(
        catchError((err) => {
          console.error(err);
          //this.errorService.mostrarerror('Error al cargar lugares de usuario');
          return throwError(() => new Error('Error en API'));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (datos) => {
          console.log('¡Datos de factura cargados!', datos);
          this.facturaSeleccionada.set(datos);
        },
      });
  }

  guardarFactura(factura: FacturaCreate) {
    return this.httpClient.post<Factura>(ENDPOINTS.FACTURAS, factura).pipe(
      tap((nuevaFactura) => {
        this.facturaSeleccionada.set(nuevaFactura);
        this.listaFacturasSimple.update((lista) => [mapearAFacturaSimple(nuevaFactura), ...lista]);

      }),
    );
  }
  actualizarFacturaSeleccionada(cambios: Partial<Factura>) {
    this.facturaSeleccionada.update((f) => ({
      ...f,
      ...cambios,
    }));
  }
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
