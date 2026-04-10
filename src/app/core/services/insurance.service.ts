import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Insurance } from '../models/catalogos.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
//import { ErrorService } from '../compartido/compartido/error.service';
@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private httpClient = inject(HttpClient);
  //private errorService = inject(ErrorService)
  private listaAseguradoras = signal<Insurance[]>([]);
  private filteredInsurances = signal<Insurance[]>([]);
  insurances = this.listaAseguradoras.asReadonly();
  filteredInsurancesList = this.filteredInsurances.asReadonly();
  private destroyRef = inject(DestroyRef);

  cargarInsurances() {
    return this.httpClient
      .get<Insurance[]>(ENDPOINTS.INSURANCES)
      .pipe(
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error en API'));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (datos) => {
          console.log('Se han cargado los datos de las Aseguradoras!', datos);
          this.listaAseguradoras.set(datos);
        },
        error: () => {
          //this.error.set('Error al cargar las imagenes');
        },
        complete: () => {},
      });
  }

  loadFilteredInsurances(searchString: string) {
    return this.httpClient.get<Insurance[]>(ENDPOINTS.INSURANCES_FILTERED(searchString)).pipe(
      tap((insurances) => {
              this.filteredInsurances.set(insurances);
              }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
    );
  }
}
