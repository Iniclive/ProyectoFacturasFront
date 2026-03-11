import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-encabezado',
  imports: [MatIconModule, RouterModule],
  templateUrl: './encabezado.html',
  standalone: true,
  styleUrl: './encabezado.css',
})
export class Encabezado {

}

