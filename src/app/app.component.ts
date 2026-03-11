import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Encabezado } from "../shared/encabezado/encabezado";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {

}
