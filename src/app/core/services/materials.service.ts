import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Material } from '../models/catalogos.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private httpClient = inject(HttpClient);
  private listaMateriales = signal<Material[]>([]);
  materials = this.listaMateriales.asReadonly();
  private destroyRef = inject(DestroyRef);

  cargarMateriales() {
    return this.httpClient.get<Material[]>(ENDPOINTS.MATERIALS).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (datos) => {
        console.log('¡Se han cargado los datos de los Materiales!', datos);
        this.listaMateriales.set(datos);
      },
      error: () => {},
      complete: () => {},
    });
  }
}
