import { Component, computed, inject, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from "../boton-propio/boton-propio.component";
import { ConfirmDialogType, ConfirmDialogModel} from './confirm-dialog.model';

const DIALOG_TYPE_CONFIG: Record<ConfirmDialogType, { icon: string; color: string }> = {
  danger:  { icon: 'delete_forever', color: '#e74c3c' },
  warning: { icon: 'warning',        color: '#e67e22' },
  success: { icon: 'check_circle',   color: '#27ae60' },
  info:    { icon: 'help',           color: '#3498db' },
};

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, BotonPropioComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {
 dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  private dialogData = inject<ConfirmDialogModel>(MAT_DIALOG_DATA);
  data = signal(this.dialogData);

  protected typeConfig = computed(() => {
    const type = this.data().type ?? 'danger';
    return DIALOG_TYPE_CONFIG[type];
  });

  protected resolvedIcon = computed(() =>
    this.data().icon ?? this.typeConfig().icon
  );

  protected resolvedColor = computed(() =>
    this.typeConfig().color
  );

  onConfirm(): void { this.dialogRef.close(true); }
  onCancel(): void  { this.dialogRef.close(false); }
}
