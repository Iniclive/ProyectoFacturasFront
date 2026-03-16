import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MaterialService } from '../../../core/services/materials.service';
import { LineaStateService } from '../../../core/services/lineas-state.service';
import { LineaFacturaLocal } from '../../../core/models/linea-factura.model';
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";
import { LINEA_INICIAL } from '../../../core/constants/linea-factura.constants';

export interface DetalleLineaDialogData {
  tempId: string | null; // null = nueva línea
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
  private readonly lineaState = inject(LineaStateService);
  private readonly materialService = inject(MaterialService);
  private readonly dialogRef = inject(MatDialogRef<DetalleLineaComponent>);
  readonly data = inject<DetalleLineaDialogData>(MAT_DIALOG_DATA);

  materials = this.materialService.materials;

  // Estado local del formulario — copia de la línea o vacío si es nueva
  linea = signal<LineaFacturaLocal>({ ...LINEA_INICIAL, _tempId: '' });
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
  mostrarErrorMaterial = computed(() => !this.materialValido() && this.formEnviado());
  importeTotal = computed(() => this.linea().cantidad * this.linea().importe);
  ngOnInit(): void {
    this.materialService.cargarMateriales();

    if (this.data.tempId) {
      // Edición — cargamos la línea existente del estado
      const lineaExistente = this.lineaState.lineas()
        .find(l => l._tempId === this.data.tempId);

      if (lineaExistente) this.linea.set({ ...lineaExistente });
    } else {
      // Nueva — inicializamos con idFactura
      this.linea.set({
        ...LINEA_INICIAL,
        _tempId: '',
        idFactura: this.data.idFactura,
      });
    }
  }

  actualizarCampo(cambios: Partial<LineaFacturaLocal>) {
    this.linea.update(l => ({ ...l, ...cambios }));
  }

  guardar() {
  this.formEnviado.set(true);
  if (!this.formularioEsValido()) return;

  const linea = this.linea();

  if (this.data.tempId) {
    this.lineaState.modificarLinea(this.data.tempId, {
      ...linea,
      nombreMaterial: this.materialService.getNombre(linea.idMaterial),
      importeTotal: this.importeTotal(),
    });
  } else {
    this.lineaState.agregarLinea({
      ...linea,
      idFactura: this.data.idFactura,
      nombreMaterial: this.materialService.getNombre(linea.idMaterial),
      importeTotal: this.importeTotal(),
    });
  }

  this.dialogRef.close(true);
}

  cancelar() {
    this.dialogRef.close(false);
  }
}
