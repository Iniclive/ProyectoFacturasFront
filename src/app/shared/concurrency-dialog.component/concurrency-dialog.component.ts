import { Component } from '@angular/core';
import { MatDialogContent, MatDialogActions } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { BotonPropioComponent } from "../boton-propio/boton-propio.component";

@Component({
  selector: 'app-concurrency-dialog.component',
  imports: [MatDialogContent, MatDialogActions, MatIcon, BotonPropioComponent],
  templateUrl: './concurrency-dialog.component.html',
  styleUrl: './concurrency-dialog.component.css',
})
export class ConcurrencyDialogComponent {
  recargarPagina() {
  console.log("Intentado recargar")
  window.location.reload();
}
}
