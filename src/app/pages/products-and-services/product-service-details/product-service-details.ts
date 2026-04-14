import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MaterialService } from '../../../core/services/materials.service';
import { ToastService } from '../../../core/services/toast.service';
import { Material } from '../../../core/models/material.models';
import { MatIcon } from "@angular/material/icon";
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";
import { BotonPropioComponent } from "../../../shared/boton-propio/boton-propio.component";
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';

@Component({
  selector: 'app-product-service-details',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, ConfirmDirective],
  templateUrl: './product-service-details.html',
  styleUrl: './product-service-details.css',
})
export class ProductServiceDetails {
materialId = input<string | null>(null);
onClose = output<void>();

  private readonly materialsService = inject(MaterialService);
  private readonly toastService = inject(ToastService);

  isSaving = signal(false);
  formSent = signal(false);

  readonly isEditing = computed(() => this.materialId() !== null);

  currentMaterial = signal<Material | undefined>(undefined);

  readonly originalMaterial = computed(() => this.materialsService.materials().find(m => String(m.idMaterial) === String(this.materialId())));

  nameError = computed((): string => {
    const trimmedName = this.currentMaterial()?.name.trim();
    if (!trimmedName) return 'El nombre es obligatorio';
    if(!trimmedName.length || trimmedName.length < 3 ) return 'El nombre debe tener al menos 3 caracteres';
    return '';
  });

 defaultPriceError = computed((): string => {
    const price = this.currentMaterial()?.defaultPrice;
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
    this.currentMaterial.set(this.originalMaterial());
  }

  updateField(changes: Partial<Material>) {
    this.currentMaterial.update((c) => ({ ...c, ...changes } as Material));
  }

  saveMaterial() {
    this.formSent.set(true);
    if (!this.validatedForm()) return;
    this.isSaving.set(true);

    if (this.isEditing()) {
      this.materialsService.updateMaterial(this.currentMaterial() as Material).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Material actualizado correctamente', tipoToast: 'submit' });
          this.onClose.emit();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar el material', tipoToast: 'delete' });
        },
      });
    } else {
      this.materialsService.createMaterial(this.currentMaterial() as Material).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Material creado correctamente', tipoToast: 'submit' });
          this.onClose.emit();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al crear el material', tipoToast: 'delete' });
        },
      });
    }
  }

  cancelar() {
    this.onClose.emit();
  }
}
