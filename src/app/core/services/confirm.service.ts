import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogModel } from '../models/confirm-dialog.model';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog.component/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  private dialog = inject(MatDialog);

  async confirm(config: ConfirmDialogModel): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    width: '90%',          // Casi todo el ancho en móviles
    maxWidth: '450px',     // No más de esto en desktop
    minWidth: '300px',
    data: config,
    autoFocus: 'button',   // Accesibilidad: enfoca el botón
    panelClass: 'custom-confirm-panel' // Por si quieres añadir sombras globales
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    return !!result;
  }

  // helpers comunes
  async delete(message = '¿Estás seguro de eliminar este registro?') {
    return this.confirm({
      title: 'Confirmar eliminación',
      message,
      icon: 'delete_forever',
      color: 'warn'
    });
  }

  async save(message = '¿Deseas guardar los cambios?') {
    return this.confirm({
      title: 'Guardar cambios',
      message,
      icon: 'save',
      color: 'primary'
    });
  }

  async logout() {
    return this.confirm({
      title: 'Cerrar sesión',
      message: '¿Deseas cerrar tu sesión?',
      icon: 'logout',
      color: 'primary'
    });
  }
}
