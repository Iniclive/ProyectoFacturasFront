import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-action-menu-item',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './action-menu-item.component.html',
  styleUrl: './action-menu-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuItemComponent {
  icono = input<string | undefined>(undefined);
  texto = input.required<string>();
  variante = input<'default' | 'danger'>('default');
  disabled = input<boolean>(false);

  pulsado = output<Event>();

  onClick(event: Event): void {
    if (this.disabled()) return;
    this.pulsado.emit(event);
  }
}
