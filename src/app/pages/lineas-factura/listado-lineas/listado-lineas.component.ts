import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { DetalleLineaComponent, DetalleLineaDialogData } from '../detalle-lineas/detalle-lineas.component';
import { LineaStateService } from '../../../core/services/lineas-state.service';

@Component({
  selector: 'app-listado-lineas',
  imports: [CurrencyPipe, BotonPropioComponent, MatIconModule, MatDialogModule, ConfirmDirective],
  templateUrl: './listado-lineas.component.html',
  styleUrl: './listado-lineas.component.css',
  standalone: true,
})
export class ListadoLineasComponent implements OnInit {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly lineasState = inject(LineaStateService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);

  idFactura = input.required<number>();

  lineas = this.lineasState.lineas;
  importeBase = this.lineasState.importeBase;
  error = this.lineasState.error$; // error viene del state, no local

  ngOnInit() {
    this.cargarLineas();
  }

  private cargarLineas() {
    this.lineasService
      .cargarLineas(this.idFactura())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();  // el tap/catchError ya están en el servicio
  }

  abrirDialogLinea(tempId?: string) {
    const dialogRef = this.dialog.open(DetalleLineaComponent, {
      width: '520px',
      data: {
        tempId: tempId ?? null,
        idFactura: this.idFactura()
      } as DetalleLineaDialogData
    });

    // Ya no recargamos desde API — el estado ya fue mutado en el diálogo
    dialogRef.afterClosed().subscribe(resultado => {
      if (resultado) console.log('Línea guardada en estado local');
    });
  }

  borrarLinea(tempId: string) {
    this.lineasState.eliminarLinea(tempId);
  }
}

