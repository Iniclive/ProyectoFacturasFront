import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export interface ToastConfig {
  texto: string;
  tipoToast?: 'basic' | 'submit' | 'delete' | 'cancelar';
  duration?: number;
  posicionX?: MatSnackBarHorizontalPosition;
  posicionY?: MatSnackBarVerticalPosition;
}
