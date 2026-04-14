import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Material } from '../models/material.models';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private httpClient = inject(HttpClient);
  private listaMateriales = signal<Material[]>([]);
  materials = this.listaMateriales.asReadonly();
  private filteredMaterials = signal<Material[]>([]);
  filteredMaterialsList = this.filteredMaterials.asReadonly();
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

  loadFilteredMaterials(searchString: string) {
      return this.httpClient.get<Material[]>(ENDPOINTS.MATERIALS_FILTERED(searchString)).pipe(
        tap((materials) => {
                this.filteredMaterials.set(materials);
                }),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error en API'));
        }),
      );
    }

    deleteMaterial(id: string) {
    const previusMaterials = [...this.materials()];
    this.listaMateriales.update((lista) => lista.filter((m) => String(m.idMaterial) !== String(id)));
    return this.httpClient
      .delete(ENDPOINTS.MATERIALS_ID(id))
      .pipe(
        catchError((err) => {
          this.listaMateriales.set(previusMaterials);
          console.log(err);
          return throwError(() => err);
        }),
      );
  }
  updateMaterial(updatedMaterial: Material) {
      return this.httpClient.put<Material>(ENDPOINTS.MATERIALS,updatedMaterial).pipe(
        tap((updatedMaterial) => {
          this.listaMateriales.update((lista) => lista.map((m) => (String(m.idMaterial) === String(updatedMaterial.idMaterial) ? updatedMaterial : m)));
        }),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error al actualizar material'));
        }),
      );
    }

    createMaterial(newMaterial: Material) {
        return this.httpClient.post<Material>(ENDPOINTS.MATERIALS, newMaterial).pipe(
          tap((createdMaterial) => {
            this.listaMateriales.update((lista) => [...lista, createdMaterial]);
          }),
          catchError((err) => {
            console.error(err);
            return throwError(() => new Error('Error al crear material'));
          }),
        );
      }
}
