import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Product } from './product.models';
import { ENDPOINTS } from '../../core/constants/endpoints';



@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private httpClient = inject(HttpClient);
  private productsList = signal<Product[]>([]);
  products = this.productsList.asReadonly();
  private filteredProducts = signal<Product[]>([]);
  filteredProductsList = this.filteredProducts.asReadonly();
  private destroyRef = inject(DestroyRef);

  loadProducts() {
    return this.httpClient.get<Product[]>(ENDPOINTS.PRODUCTS).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (datos) => {
        console.log('¡Se han cargado los datos de los Materiales!', datos);
        this.productsList.set(datos);
      },
      error: () => {},
      complete: () => {},
    });
  }

  loadFilteredProducts(searchString: string) {
      return this.httpClient.get<Product[]>(ENDPOINTS.PRODUCTS, {params: { q: searchString }}).pipe(
        tap((products) => {
                this.filteredProducts.set(products);
                console.log("Cargando materiales fitrados")
                products.forEach(element => {
                    console.log(element);
                });
                }),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error en API'));
        }),
      );
    }

    deleteProduct(id: string) {
    const previusProducts = [...this.products()];
    this.productsList.update((lista) => lista.filter((m) => String(m.productId) !== String(id)));
    return this.httpClient
      .delete(ENDPOINTS.PRODUCTS_ID(id))
      .pipe(
        catchError((err) => {
          this.productsList.set(previusProducts);
          console.log(err);
          return throwError(() => err);
        }),
      );
  }
  updateProduct(updatedProduct: Product) {
      return this.httpClient.put<Product>(ENDPOINTS.PRODUCTS,updatedProduct).pipe(
        tap((updatedProduct) => {
          this.productsList.update((lista) => lista.map((m) => (String(m.productId) === String(updatedProduct.productId) ? updatedProduct : m)));
        }),
        catchError((err) => {
          console.error(err);
          return throwError(() => new Error('Error al actualizar producto'));
        }),
      );
    }

  createProduct(newProduct: Product) {
        return this.httpClient.post<Product>(ENDPOINTS.PRODUCTS, newProduct).pipe(
          tap((creatednewProduct) => {
            this.productsList.update((lista) => [...lista, creatednewProduct]);
          }),
          catchError((err) => {
            console.error(err);
            return throwError(() => new Error('Error al crear material'));
          }),
        );
      }
}
