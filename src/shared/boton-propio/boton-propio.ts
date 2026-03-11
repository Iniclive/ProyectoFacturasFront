import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-boton-propio',
  imports: [],
  templateUrl: './boton-propio.html',
  styleUrl: './boton-propio.css',
  standalone: true,
})
export class BotonPropio {
  texto = input.required();
  color = input.required();
  id = input<string|undefined>();
  pulsado = output<string|undefined>();
  // Evento de salida
  notificarClick() {
    this.pulsado.emit(this.id());
  }

}
