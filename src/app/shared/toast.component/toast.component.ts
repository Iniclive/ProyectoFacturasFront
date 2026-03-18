import { Component, inject, input } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/input";
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarRef
} from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-toast.component',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  imports: [MatIcon],
})
export class ToastComponent {

// Inyectamos la referencia para poder cerrarlo manualmente si queremos
  snackBarRef = inject(MatSnackBarRef);
  // Inyectamos los datos que le pasaremos al abrirlo
  data = inject(MAT_SNACK_BAR_DATA);

  // Mapeo de estilos e iconos
  private readonly MAPEO_ESTILOS: Record<string, { color: string, icon: string }> = {
    submit:   { color: '#27ae60', icon: 'check_circle' },
    delete:   { color: '#e74c3c', icon: 'delete_forever' },
    basic:    { color: '#3498db', icon: 'info' },
    cancelar: { color: '#95a5a6', icon: 'block' }
  };

  get config() {
    return this.MAPEO_ESTILOS[this.data.tipoToast] || this.MAPEO_ESTILOS['basic'];
  }

  cerrar() {
    this.snackBarRef.dismiss();
  }
}
