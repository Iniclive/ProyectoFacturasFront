import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
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

export interface DetalleLineaDialogData {
  idLinea: number | null;
  idFactura: number;
}

@Component({
  selector: 'app-detalle-linea',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatIconModule, FormErrorComponent, BotonPropioComponent],
  templateUrl: './detalle-lineas.component.html',
  styleUrl: './detalle-lineas.component.css',
})
export class DetalleLineaComponent implements OnInit {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly materialService = inject(MaterialService);
  private readonly dialogRef = inject(MatDialogRef<DetalleLineaComponent>);
  private toastService = inject(ToastService);
  readonly data = inject<DetalleLineaDialogData>(MAT_DIALOG_DATA);

  materials = this.materialService.materials;
  linea = this.lineasService.lineaSeleccionada;

  estaGuardando = signal(false);
  formEnviado = signal(false);

  materialValido = computed(() => {
    const id = this.linea().idMaterial;
    return id !== null && id !== 0;
  });

  cantidadValida = computed(() => this.linea().cantidad > 0);
  importeValido = computed(() => this.linea().importe > 0);
  importeTotalCalculado = computed(() => this.linea().cantidad * this.linea().importe);

  formularioEsValido = computed(
    () => this.materialValido() && this.cantidadValida() && this.importeValido(),
  );

  mostrarErrorMaterial = computed(() => !this.materialValido() && this.formEnviado());
  mostrarErrorImporte = computed(() => !this.importeValido() && this.formEnviado());
  mostrarErrorCantidad = computed(() => !this.cantidadValida() && this.formEnviado());

  ngOnInit(): void {
    this.materialService.cargarMateriales();
    this.lineasService.cargarLineaId(this.data.idLinea ? String(this.data.idLinea) : 'nueva');
  }

  actualizarMaterial(id: number) {
    this.lineasService.actualizarLineaSeleccionada({ idMaterial: id });
  }

  actualizarCantidad(cantidad: number) {
    this.lineasService.actualizarLineaSeleccionada({ cantidad });
  }

  actualizarImporte(importe: number) {
    this.lineasService.actualizarLineaSeleccionada({ importe });
  }

  guardar() {
    this.formEnviado.set(true);
    if (!this.formularioEsValido()) return;

    this.estaGuardando.set(true);
    const esEdicion = !!this.data.idLinea;

    if (esEdicion) {
      const lineaUpdate = mapearALineaFacturaUpdate(this.linea());
      this.lineasService.actualizarLinea(lineaUpdate).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Se ha actualizado la linea correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar la linea', tipoToast: 'delete' });
        },
      });
    } else {
      const lineaCreate = {
        ...mapearALineaFacturaCreate(this.linea()),
        idFactura: this.data.idFactura,
      };
      this.lineasService.guardarLinea(lineaCreate).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Se ha agregado la linea correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.estaGuardando.set(false);
          this.toastService.mostrar({ texto: 'Error al agregar la linea', tipoToast: 'delete' });
        },
      });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
