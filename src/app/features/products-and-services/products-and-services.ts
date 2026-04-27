import { MatIcon } from "@angular/material/icon";
import { ConfirmDirective } from "../../core/directives/app-confirm.directive";
import { BotonPropioComponent } from "../../shared/boton-propio/boton-propio.component";
import { DataTableComponent } from "../../shared/data-table/data-table.component";
import { Component } from "@angular/core";
import {inject, signal } from "@angular/core";
import { ToastService } from "../../core/services/toast.service";
import { ColumnDef, FilterDef } from "../../shared/data-table/data-table.types";
import {Product } from "./product.models";
import { ProductServiceDetails } from "./product-service-details/product-service-details";
import { CurrencyPipe } from "@angular/common";
import { ProductsService } from "./products.service";


@Component({
  selector: 'app-products-and-services',
  imports: [MatIcon,
  BotonPropioComponent,
   ConfirmDirective,
  DataTableComponent,
  ProductServiceDetails,],
  providers: [CurrencyPipe],
  templateUrl: './products-and-services.html',
  styleUrl: './products-and-services.css',
})
export class ProductsAndServices {
private readonly productsService = inject(ProductsService);
private readonly toastService = inject(ToastService);
private currencyPipe = inject(CurrencyPipe);

readonly products = this.productsService.products;
readonly error = signal('');

selectedProductId = signal<string | null>(null);

  readonly sidebarOpen = signal(false);

  readonly columns: ColumnDef<Product>[] = [
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'description', label: 'Descripcion', sortable: false },
    { key: 'defaultPrice', label: 'Precio', sortable: true, format: (row) => this.currencyPipe.transform(row.defaultPrice, 'EUR', 'symbol', '1.2-2') ?? ''},
  ];

  readonly filters: FilterDef[] = [
    { kind: 'text', key: 'name', label: 'Nombre', icon: 'person', placeholder: 'Nombre poducto...' },
    { kind: 'range', key: 'defaultPrice', label: 'Precio', icon: 'attach_money', placeholder: 'Precio producto...' },
  ];

  ngOnInit() {
    this.productsService.loadProducts();
  }

  showProductDetails(product: Product) {
    this.selectedProductId.set(product.productId.toString());
    this.sidebarOpen.set(true);
  }

  createProduct() {
    this.selectedProductId.set(null);
    this.sidebarOpen.set(true);
  }

  closeSidebar() {
    this.sidebarOpen.set(false);
    this.selectedProductId.set(null);
  }

  deleteProduct(id: string) {
    this.productsService.deleteProduct(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado el producto correctamente',
          tipoToast: 'submit',
        }),
      error: () =>
        this.toastService.mostrar({
          texto: 'Error al eliminar el producto',
          tipoToast: 'delete',
        }),
    });
  }

}
