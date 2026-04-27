export type ConfirmDialogType = 'danger' | 'warning' | 'success' | 'info';

export interface ConfirmDialogModel {
  title: string;
  message: string;
  type?: ConfirmDialogType;      // nuevo
  icon?: string;                 // sigue siendo sobreescribible
  cancelText?: string;
  confirmText?: string;
  // elimina 'color' — ya no hace falta
}
