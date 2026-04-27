import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component/confirm-dialog.component';
import { ConfirmDialogModel } from '../../shared/confirm-dialog.component/confirm-dialog.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {

  private dialog = inject(MatDialog);

  async confirm(config: ConfirmDialogModel): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: config,
    autoFocus: false,
    restoreFocus: true,
    panelClass: 'confirm-dialog-panel',
    });

    const result = await firstValueFrom(dialogRef.afterClosed());

    return !!result;
  }

  // helpers comunes
  async delete(message = '¿Estás seguro de eliminar este registro?') {
  return this.confirm({ title: 'Confirmar eliminación', message, type: 'danger' });
}

async save(message = '¿Deseas guardar los cambios?') {
  return this.confirm({ title: 'Guardar cambios', message, type: 'success' });
}

async logout() {
  return this.confirm({ title: 'Cerrar sesión', message: '¿Deseas cerrar tu sesión?', type: 'warning' });
}
}
