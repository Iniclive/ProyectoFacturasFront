import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { DetalleLineaComponent, DetalleLineaDialogData } from '../detalle-lineas/detalle-lineas.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-listado-lineas',
  imports: [CurrencyPipe, BotonPropioComponent, MatIconModule, MatDialogModule, ConfirmDirective],
  templateUrl: './listado-lineas.component.html',
  styleUrl: './listado-lineas.component.css',
  standalone: true,
})
export class ListadoLineasComponent {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  idFactura = input.required<number>();
  isEditable = input<boolean>(true);

  lineas = this.lineasService.lineas;
  error = signal('');

  ngOnInit() {
    this.cargarLineas();
  }

  private cargarLineas() {
    this.lineasService
      .cargarLineas(String(this.idFactura()))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => console.log('¡Líneas cargadas!', datos),
        error: () => this.error.set('Error al cargar las líneas'),
      });
  }

  abrirDialogLinea(id?: number) {
    const dialogRef = this.dialog.open(DetalleLineaComponent, {
    width: '520px',
    data: {
      idLinea: id ?? null,
      idFactura: this.idFactura()
    } as DetalleLineaDialogData
  });

  dialogRef.afterClosed().subscribe(resultado => {
    if (resultado) this.cargarLineas();
  });
    console.log(id ? `Editando línea: ${id}` : 'Nueva línea');
  }

  borrarLinea(id?: number) {
    console.log('Intentando borrar la línea con id ' + id);
    this.lineasService.eliminarLinea(id).subscribe({
      next: () => this.toastService.mostrar({
            texto: 'Se ha eliminado la linea correctamente',
            tipoToast: 'submit',
          }),
      error: (err) => console.error(err),
    });
  }
}
