import { Directive, HostListener, inject, input, output } from '@angular/core';
import { ConfirmService } from '../services/confirm.service';

export type ConfirmAction = 'delete' | 'save' | 'logout' | 'custom';

@Directive({
  selector: '[appConfirm]',
  standalone: true,
})
export class ConfirmDirective {
  private confirmService = inject(ConfirmService);
  action = input<ConfirmAction>('delete');
  message = input<string>();
  title = input<string>();
  enabled = input<boolean>(true);
  confirmed = output<void>();

  @HostListener('click')
  async onClick() {
    // Si está deshabilitado, emite directamente sin mostrar modal
    if (!this.enabled()) {
      this.confirmed.emit();
      return;
    }

    let ok = false;

    switch (this.action()) {
      case 'delete':
        ok = await this.confirmService.delete(this.message());
        break;
      case 'save':
        ok = await this.confirmService.save(this.message());
        break;
      case 'logout':
        ok = await this.confirmService.logout();
        break;
      case 'custom':
        ok = await this.confirmService.confirm({
          title: this.title() ?? 'Confirmar acción',
          message: this.message() ?? '¿Deseas continuar?',
          type: 'info',
        });
        break;
    }

    if (ok) this.confirmed.emit();
  }
}
