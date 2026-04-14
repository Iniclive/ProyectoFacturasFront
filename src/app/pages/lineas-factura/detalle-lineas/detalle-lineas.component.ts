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
import { MaterialService } from '../../../core/services/materials.service';
import {
  mapearALineaFacturaCreate,
  mapearALineaFacturaUpdate,
} from '../../../core/mappers/linea-factura.mapper';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { ToastService } from '../../../core/services/toast.service';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { Material } from '../../../core/models/material.models';


@Component({
  selector: 'app-detalle-linea',
  standalone: true,
  imports: [MatIconModule, FormErrorComponent, BotonPropioComponent],
  templateUrl: './detalle-lineas.component.html',
  styleUrl: './detalle-lineas.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetalleLineaComponent implements OnInit {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly materialService = inject(MaterialService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly idLinea = input<number | null>(null);
  readonly idFactura = input.required<number>();
  readonly onClose = output<void>();
  readonly onSaved = output<void>();

  readonly filteredMaterials = this.materialService.filteredMaterialsList;
  readonly materials = this.materialService.materials;
  readonly linea = this.lineasService.lineaSeleccionada;

  readonly searchMaterialQuery = signal('');
  readonly estaGuardando = signal(false);
  readonly formEnviado = signal(false);
  readonly isOpenMaterialCombobox = signal(false);
  readonly selectedMaterial = signal<Material | null>(null);

  private isSelectionMaterial = false;

  readonly isEditing = computed(() => this.idLinea() !== null);

  readonly materialValido = computed(() => this.searchMaterialQuery().length >= 3);
  readonly cantidadValida = computed(() => this.linea().cantidad > 0);
  readonly importeValido = computed(() => this.linea().importe > 0);
  readonly importeTotalCalculado = computed(() => this.linea().cantidad * this.linea().importe);

  readonly formularioEsValido = computed(
    () => this.materialValido() && this.cantidadValida() && this.importeValido(),
  );

  readonly mostrarErrorMaterial = computed(() => !this.materialValido() && this.formEnviado());
  readonly mostrarErrorImporte = computed(() => !this.importeValido() && this.formEnviado());
  readonly mostrarErrorCantidad = computed(() => !this.cantidadValida() && this.formEnviado());

  ngOnInit(): void {
    this.materialService.cargarMateriales();
    this.lineasService.cargarLineaId(this.idLinea() ? String(this.idLinea()) : 'nueva');
  }

  onCantidadInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? 0 : Number(raw);
    this.lineasService.actualizarLineaSeleccionada({ cantidad: isNaN(value) ? 0 : value });
  }

  onImporteInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    const value = raw === '' ? 0 : Number(raw);
    this.lineasService.actualizarLineaSeleccionada({ importe: isNaN(value) ? 0 : value });
  }

  guardar(): void {
    this.formEnviado.set(true);
    if (!this.formularioEsValido()) return;

    this.estaGuardando.set(true);

    if (this.isEditing()) {
      const lineaUpdate = mapearALineaFacturaUpdate(this.linea());
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
        ...mapearALineaFacturaCreate(this.linea()),
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

  readonly materialSearch = toObservable(this.searchMaterialQuery).pipe(
    filter((query) => {
      if (this.isSelectionMaterial) {
        this.isSelectionMaterial = false;
        return false;
      }
      return query.length >= 3;
    }),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => this.isOpenMaterialCombobox.set(true)),
    switchMap((query) => this.materialService.loadFilteredMaterials(query)),
    takeUntilDestroyed(this.destroyRef),
  );

  cancelar(): void {
    this.onClose.emit();
  }

  onSearchInputMaterial(event: Event): void {
    const valor = (event.target as HTMLInputElement).value;
    this.searchMaterialQuery.set(valor);
    this.isOpenMaterialCombobox.set(valor.length >= 3);
  }

  onSelectedMaterial(material: Material | null): void {
    this.isSelectionMaterial = true;
    this.selectedMaterial.set(material);
    this.searchMaterialQuery.set(material?.name || '');
    this.lineasService.actualizarLineaSeleccionada({ idMaterial: material?.idMaterial || 0 });
    this.isOpenMaterialCombobox.set(false);
  }
}
