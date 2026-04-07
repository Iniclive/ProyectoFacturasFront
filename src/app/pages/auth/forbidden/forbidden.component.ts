import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BotonPropioComponent } from "../../../shared/boton-propio/boton-propio.component";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-forbidden.component',
  imports: [RouterLink, BotonPropioComponent, MatIcon],
  templateUrl: './forbidden.component.html',
  styleUrl: './forbidden.component.css',
})
export class ForbiddenComponent {


}
