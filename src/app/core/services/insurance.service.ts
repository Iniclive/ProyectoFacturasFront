import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Insurance } from '../models/catalogos.model';
//import { ErrorService } from '../compartido/compartido/error.service';
@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  private httpClient = inject(HttpClient);
  //private errorService = inject(ErrorService)
  private listaAseguradoras = signal<Insurance[]>([]);
  insurances = this.listaAseguradoras.asReadonly();
  //private destroyRef = inject(DestroyRef);

  cargarInsurances() {
    return this.httpClient.get<Insurance[]>(ENDPOINTS.INSURANCES).pipe(
      tap((insurances) => {
        this.listaAseguradoras.set(insurances);
      }),
      catchError((err) => {
        console.error(err);
        //this.errorService.mostrarerror('Error al cargar lugares disponibles');
        return throwError(() => new Error('Error en API'));
      }),
    );
  }

}
