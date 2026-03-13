import { Component, input, computed, output } from '@angular/core';

// Definimos los colores por defecto para cada propósito
const COLORES_POR_DEFECTO: Record<string, string> = {
  submit: '#27ae60', // Verde
  button: '#3498db', // Azul
  delete: '#e74c3c',  // Rojo
  cancelar: '#95a5a6' // Gris
};

@Component({
  selector: 'app-boton-propio',
  standalone: true,
  templateUrl: './boton-propio.component.html',
  styleUrls: ['./boton-propio.component.css']
})
export class BotonPropioComponent {
  texto = input.required<string>();
  tipoBoton = input<'button' | 'submit' | 'delete'>('button');
  disabled = input<boolean>(false);

  // Hacemos el color opcional. Si no se provee, será undefined
  colorPersonalizado = input<string | undefined>(undefined, { alias: 'color' });

  // Creamos un Signal computado para decidir qué color usar
  colorFinal = computed(() => {
    // 1. Si el usuario pasó un color específico, mandamos ese (personalización concreta)
    if (this.colorPersonalizado()) {
      return this.colorPersonalizado();
    }
    return COLORES_POR_DEFECTO[this.tipoBoton()] || COLORES_POR_DEFECTO['button'];
  });

  pulsado = output<Event>();

  manejarClick(event: Event) {
    if (!this.disabled()) this.pulsado.emit(event);
  }
}
