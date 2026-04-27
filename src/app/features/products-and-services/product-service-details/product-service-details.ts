import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { MatIcon } from "@angular/material/icon";
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";
import { BotonPropioComponent } from "../../../shared/boton-propio/boton-propio.component";
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';

import { Product } from '../product.models';
import { DEFAULT_PRODUCT } from '../../../core/constants/product.constants';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-product-service-details',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, ConfirmDirective],
  templateUrl: './product-service-details.html',
  styleUrl: './product-service-details.css',
})
export class ProductServiceDetails {
productId = input<string | null>(null);
onClose = output<Product|null>();

  private readonly productsService = inject(ProductsService);
  private readonly toastService = inject(ToastService);

  isSaving = signal(false);
  formSent = signal(false);

  readonly isEditing = computed(() => this.productId() !== null);
  currentProduct = signal<Product |undefined>(undefined);
  readonly originalProduct = computed(() => this.isEditing() ? this.productsService.products().find(m => String(m.productId) === String(this.productId()))
   : DEFAULT_PRODUCT);

  nameError = computed((): string => {
    const trimmedName = this.currentProduct()?.name.trim();
    if (!trimmedName) return 'El nombre es obligatorio';
    if(!trimmedName.length || trimmedName.length < 3 ) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  });

 defaultPriceError = computed((): string => {
    const price = this.currentProduct()?.defaultPrice;
    if (price === null || price === undefined) {
    return 'El precio es obligatorio';
  }
  if (price < 0) {
    return 'El precio no puede ser negativo';
  }
    return '';
 });

  showNameError = computed(() => !!this.nameError() && this.formSent());
  showDefaultPriceError = computed(() => !!this.defaultPriceError() && this.formSent());

  validatedForm = computed(() => !this.nameError() && !this.defaultPriceError());

  ngOnInit(): void {
    this.currentProduct.set(this.originalProduct());
  }

  updateField(changes: Partial<Product>) {
    this.currentProduct.update((c) => ({ ...c, ...changes } as Product));
  }

  saveProduct() {
    this.formSent.set(true);
    if (!this.validatedForm()) return;
    this.isSaving.set(true);

    if (this.isEditing()) {
      this.productsService.updateProduct(this.currentProduct() as Product).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Producto actualizado correctamente', tipoToast: 'submit' });
          this.onClose.emit(null);
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar el producto', tipoToast: 'delete' });
        },
      });
    } else {
      this.productsService.createProduct(this.currentProduct() as Product).subscribe({
        next: (createdProduct) => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Producto creado correctamente', tipoToast: 'submit' });
          this.onClose.emit(createdProduct);
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al crear el producto', tipoToast: 'delete' });
        },
      });
    }
  }

  cancelar() {
    this.onClose.emit(null);
  }
}
