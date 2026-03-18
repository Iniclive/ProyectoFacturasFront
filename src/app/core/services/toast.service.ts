import { Injectable, inject } from '@angular/core';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ToastComponent } from '../../shared/toast.component/toast.component';
import { ToastConfig } from '../models/toast.config.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
private _snackBar = inject(MatSnackBar);
  mostrar(config: ToastConfig) {
    this._snackBar.openFromComponent(ToastComponent, {
      // Pasamos los datos al componente visual
      data: {
        texto: config.texto,
        tipoToast: config.tipoToast || 'basic'
      },
      // Configuramos el comportamiento de Material
      duration: config.duration || 3000,
      horizontalPosition: config.posicionX || 'right',
      verticalPosition: config.posicionY || 'top',
      // Esto es clave para que Material quite su fondo negro por defecto
      panelClass: ['custom-toast-panel']
    });
  }
  }



