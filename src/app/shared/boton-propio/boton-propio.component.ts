import { Component, input, computed, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

// Definimos los colores por defecto para cada propósito
const COLORES_POR_VARIANTE: Record<string, string> = {
  primary: '#3498db',
  success: '#27ae60',
  danger: '#e74c3c',
  neutral: '#95a5a6'
};

@Component({
  selector: 'app-boton-propio',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './boton-propio.component.html',
  styleUrls: ['./boton-propio.component.css'],
  host: {
    // Propaga disabled al elemento host para que la directiva lo detecte
    '[attr.disabled]': 'disabled() || null',
    '[attr.aria-disabled]': 'disabled()',
  }
})
export class BotonPropioComponent {
  texto = input<string>('');
  icono = input<string | undefined>(undefined);
  ariaLabel = input<string | undefined>(undefined);
  tipo = input<'button' | 'submit' | 'reset'>('button');
  variante = input<'primary' | 'success' | 'danger' | 'neutral'>('primary');
  disabled = input<boolean>(false);

  // Hacemos el color opcional. Si no se provee, será undefined
  colorPersonalizado = input<string | undefined>(undefined, { alias: 'color' });

  // Creamos un Signal computado para decidir qué color usar
  colorFinal = computed(() => {
    // 1. Si el usuario pasó un color específico, mandamos ese (personalización concreta)
    if (this.colorPersonalizado()) {
      return this.colorPersonalizado();
    }
    return COLORES_POR_VARIANTE[this.variante()] || COLORES_POR_VARIANTE['primary'];
  });

  pulsado = output<Event>();

  manejarClick(event: Event) {
    if (!this.disabled()) this.pulsado.emit(event);
  }
}
