import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { DetalleLineaComponent } from '../detalle-lineas/detalle-lineas.component';
import { ProductsService } from '../../../core/services/products.service';
import { Product } from '../../../core/models/product.models';
import { ProductServiceDetails } from "../../products-and-services/product-service-details/product-service-details";

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
  private readonly productsService = inject(ProductsService);
  readonly newlyCreatedProduct = signal<Product | null>(null);

  readonly idFactura = input.required<number>();
  readonly isEditable = input<boolean>(true);
  readonly sidebarProductOpen = signal(false);
  readonly pendingLineaId = signal<number | null>(null);
  readonly lineas = this.lineasService.lineas;
  readonly error = signal('');

  readonly sidebarOpen = signal(false);
  readonly selectedLineaId = signal<number | null>(null);

  ngOnInit() {
    this.cargarLineas();
  }

  private cargarLineas() {
    this.lineasService
      .cargarLineas(String(this.idFactura()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => console.log('¡Líneas cargadas!', datos),
        error: () => this.error.set('Error al cargar las líneas'),
      });
  }

  abrirSidebarLinea(id?: number) {
    this.newlyCreatedProduct.set(null);
    this.selectedLineaId.set(id ?? null);
    this.sidebarOpen.set(true);
  }

  cerrarSidebar() {
    this.sidebarOpen.set(false);
    this.selectedLineaId.set(null);
  }

  onLineaGuardada() {
    this.cerrarSidebar();
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

  abrirSidebarProducto(): void {
  // Guarda el contexto de la línea que estaba abierta
  this.pendingLineaId.set(this.selectedLineaId());
  this.sidebarOpen.set(false);
  this.sidebarProductOpen.set(true);
}

cerrarSidebarProducto(): void {
  this.sidebarProductOpen.set(false);
}

onProductoGuardado(product: Product | null): void {
this.newlyCreatedProduct.set(product)
this.cerrarSidebarProducto();
  this.selectedLineaId.set(this.pendingLineaId());
  this.sidebarOpen.set(true);
  this.pendingLineaId.set(null);
}
}
