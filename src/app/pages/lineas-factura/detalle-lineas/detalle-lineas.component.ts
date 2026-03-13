import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { MaterialService } from '../../../core/services/materials.service';
import { mapearALineaFacturaCreate } from '../../../core/mappers/linea-factura.mapper';
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";

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
  readonly data = inject<DetalleLineaDialogData>(MAT_DIALOG_DATA);

  materials = this.materialService.materials;
  linea = this.lineasService.currentLinea;

  estaGuardando = signal(false);
  formEnviado = signal(false);

  materialValido = computed(() => {
    const id = this.linea().idMaterial;
    return id !== null && id !== 0;
  });

  cantidadValida = computed(() => this.linea().cantidad > 0);
  importeValido = computed(() => this.linea().importe > 0);

  formularioEsValido = computed(() =>
    this.materialValido() && this.cantidadValida() && this.importeValido()
  );

  mostrarErrorMaterial = computed(() =>
    !this.materialValido() && this.formEnviado()
  );

  ngOnInit(): void {
    this.materialService.cargarMateriales();
    this.lineasService.cargarLineaId(
      this.data.idLinea ? String(this.data.idLinea) : 'nueva'
    );
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
    const lineaCreate = {
      ...mapearALineaFacturaCreate(this.linea()),
      idFactura: this.data.idFactura,
    };

    this.lineasService.guardarLinea(lineaCreate).subscribe({
      next: () => {
        this.estaGuardando.set(false);
        this.dialogRef.close(true); // true = recargar lista
      },
      error: () => this.estaGuardando.set(false),
    });
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
