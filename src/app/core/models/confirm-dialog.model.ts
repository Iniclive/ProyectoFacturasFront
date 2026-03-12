export interface ConfirmDialogModel {
  title: string;
  message: string;
  confirmText?: string; // Por defecto "Eliminar"
  cancelText?: string;  // Por defecto "Cancelar"
  icon?: string;        // Por defecto "warning"
  color?: 'primary' | 'warn' | 'accent'; // Color del botón principal
}
