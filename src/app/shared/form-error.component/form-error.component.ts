import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-error',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './form-error.component.html',
  styleUrls: ['./form-error.component.css'],
})
export class FormErrorComponent {
  /** Texto del mensaje de error */
  readonly mensaje = input<string>('');

  /** Controla la visibilidad del error */
  readonly mostrar = input<boolean>(false);

  /** Icono de Material Icons (por defecto: error_outline) */
  readonly icono = input<string>('error_outline');
}
