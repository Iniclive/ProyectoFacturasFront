import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { LineasFacturaService } from '../lineas-factura.service';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { DetalleLineaComponent } from '../detalle-lineas/detalle-lineas.component';
import { Product } from '../../products-and-services/product.models';
import { ProductServiceDetails } from "../../products-and-services/product-service-details/product-service-details";

import { LINEAS_INICIALES } from '../../../core/constants/linea-factura.constants';
import { LineaFactura } from '../linea-factura.model';
import { ProductsService } from '../../products-and-services/products.service';

@Component({
  selector: 'app-listado-lineas',
  imports: [
    CurrencyPipe,
    BotonPropioComponent,
    MatIconModule,
    ConfirmDirective,
    DetalleLineaComponent,
    ProductServiceDetails
],
  templateUrl: './listado-lineas.component.html',
  styleUrl: './listado-lineas.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoLineasComponent {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly productService = inject(ProductsService);
  readonly idFactura = input.required<number>();
  readonly isEditable =  input<boolean>(true);

  readonly newlyCreatedProduct = signal<Product | null>(null);
  readonly sidebarProductOpen = signal(false);
  readonly pendingLineaId = signal<number | null>(null);
  readonly lineas = signal<LineaFactura[]>(LINEAS_INICIALES);
  readonly error = signal('');

  readonly sidebarOpen = signal(false);
  readonly selectedLineaId = signal<number | null>(null);

  ngOnInit() {
    this.cargarLineas();
    this.productService.loadProducts();
  }

  private cargarLineas() {
    this.lineasService
      .cargarLineas(String(this.idFactura()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => this.lineas.set(datos),
        error: () => this.error.set('Error al cargar las líneas'),
      });
  }

  openSidebarLinea(id?: number) {
    this.newlyCreatedProduct.set(null);
    this.selectedLineaId.set(id ?? null);
    this.sidebarOpen.set(true);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
    this.selectedLineaId.set(null);
  }

  onLineaSaved() {
    this.closeSidebar();
    this.cargarLineas();
  }

  borrarLinea(id?: number) {
    this.lineasService.eliminarLinea(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado la linea correctamente',
          tipoToast: 'submit',
        }),
      error: (err) => console.error(err),
    });
  }

  openSidebarProduct(): void {
  this.pendingLineaId.set(this.selectedLineaId());
  this.sidebarOpen.set(false);
  this.sidebarProductOpen.set(true);
}

closeSidebarProduct(): void {
  this.sidebarProductOpen.set(false);
}

onProductSaved(product: Product | null): void {
this.newlyCreatedProduct.set(product)
this.closeSidebarProduct();
this.selectedLineaId.set(this.pendingLineaId());
this.sidebarOpen.set(true);
this.pendingLineaId.set(null);
}
}
