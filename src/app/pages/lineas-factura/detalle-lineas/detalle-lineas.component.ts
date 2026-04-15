import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { ProductsService } from '../../../core/services/products.service';
import {
  mapearALineaFacturaCreate,
  mapearALineaFacturaUpdate,
} from '../../../core/mappers/linea-factura.mapper';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { Product } from '../../../core/models/product.models';
import { LineaFactura } from '../../../core/models/linea-factura.model';
import { LINEA_INICIAL } from '../../../core/constants/linea-factura.constants';

@Component({
  selector: 'app-detalle-linea',
  standalone: true,
  imports: [MatIconModule, FormErrorComponent, BotonPropioComponent],
  templateUrl: './detalle-lineas.component.html',
  styleUrl: './detalle-lineas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleLineaComponent implements OnInit {
  readonly onCreateProduct = output<void>();
  readonly newProduct = input<Product | null>(null);
  readonly idLinea = input<number | null>(null);
  readonly idFactura = input.required<number>();

  private readonly lineasService = inject(LineasFacturaService);
  private readonly productService = inject(ProductsService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  currentLine = signal<LineaFactura>(LINEA_INICIAL);
  readonly originalLine = computed(() =>
    this.isEditing()
      ? (this.lineasService
          .lineas()
          .find((m) => String(m.idLineaFactura) === String(this.idLinea())) ?? LINEA_INICIAL)
      : LINEA_INICIAL,
  );

  readonly onClose = output<void>();
  readonly onSaved = output<void>();
  readonly filteredProducts = this.productService.filteredProductsList;
  readonly products = this.productService.products;
  readonly searchProductQuery = signal('');
  readonly estaGuardando = signal(false);
  readonly formEnviado = signal(false);
  readonly isOpenProductCombobox = signal(false);
  readonly selectedProduct = signal<Product | null>(null);

  private isSelectionProduct = false;

  readonly isEditing = computed(() => this.idLinea() !== null);

  readonly materialValido = computed(() => this.searchProductQuery().length >= 3);
  readonly cantidadValida = computed(() => this.currentLine().cantidad > 0);
  readonly importeValido = computed(() => this.currentLine().importe > 0);
  readonly importeTotalCalculado = computed(
    () => this.currentLine().cantidad * this.currentLine().importe,
  );

  readonly formularioEsValido = computed(
    () => this.materialValido() && this.cantidadValida() && this.importeValido(),
  );

  readonly mostrarErrorMaterial = computed(() => !this.materialValido() && this.formEnviado());
  readonly mostrarErrorImporte = computed(() => !this.importeValido() && this.formEnviado());
  readonly mostrarErrorCantidad = computed(() => !this.cantidadValida() && this.formEnviado());

  ngOnInit(): void {
    this.currentLine.set(this.originalLine());

    if (this.newProduct()) {
      this.isSelectionProduct = false;
      this.onSelectedProduct(this.newProduct());
      return;
    }

    if (this.isEditing()) {
      const product = this.products().find((p) => p.productId === this.currentLine().productId);
      if (product) {
        this.isSelectionProduct = true;
        this.selectedProduct.set(product);
        this.searchProductQuery.set(product.name);
      }
    }
  }
  constructor() {
    this.productSearch.subscribe();
  }

  updateField(changes: Partial<LineaFactura>) {
    this.currentLine.update((c) => ({ ...c, ...changes }) as LineaFactura);
  }

  guardar(): void {
    this.formEnviado.set(true);
    if (!this.formularioEsValido()) return;

    this.estaGuardando.set(true);

    if (this.isEditing()) {
      const lineaUpdate = mapearALineaFacturaUpdate(this.currentLine());
      this.lineasService.actualizarLinea(lineaUpdate).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({
            texto: 'Se ha actualizado la linea correctamente',
            tipoToast: 'submit',
          });
          this.onSaved.emit();
        },
        error: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar la linea', tipoToast: 'delete' });
        },
      });
    } else {
      const lineaCreate = {
        ...mapearALineaFacturaCreate(this.currentLine()),
        idFactura: this.idFactura(),
      };
      this.lineasService.guardarLinea(lineaCreate).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({
            texto: 'Se ha agregado la linea correctamente',
            tipoToast: 'submit',
          });
          this.onSaved.emit();
        },
        error: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({ texto: 'Error al agregar la linea', tipoToast: 'delete' });
        },
      });
    }
  }

  readonly productSearch = toObservable(this.searchProductQuery).pipe(
    filter((query) => {
      if (this.isSelectionProduct) {
        this.isSelectionProduct = false;
        return false;
      }
      return query.length >= 3;
    }),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.isOpenProductCombobox.set(true)),
    switchMap((query) => this.productService.loadFilteredProducts(query)),
    takeUntilDestroyed(this.destroyRef),
  );

  cancelar(): void {
    this.onClose.emit();
  }

  onSearchInputMaterial(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.searchProductQuery.set(valor);
    this.isOpenProductCombobox.set(valor.length >= 3);
  }

  onSelectedProduct(product: Product | null): void {
    this.isSelectionProduct = true;
    this.selectedProduct.set(product);
    this.searchProductQuery.set(product?.name || '');
    this.updateField({ importe: product?.defaultPrice || 0 });
    this.updateField({ productId: product?.productId || 0 });
    this.isOpenProductCombobox.set(false);
  }

  createNewProduct(): void {
    this.onCreateProduct.emit();
  }
}
