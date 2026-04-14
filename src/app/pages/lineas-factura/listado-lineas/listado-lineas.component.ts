import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';

import { LineasFacturaService } from '../../../core/services/lineas-factura.service';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { DetalleLineaComponent } from '../detalle-lineas/detalle-lineas.component';

@Component({
  selector: 'app-listado-lineas',
  imports: [
    CurrencyPipe,
    BotonPropioComponent,
    MatIconModule,
    ConfirmDirective,
    DetalleLineaComponent,
  ],
  templateUrl: './listado-lineas.component.html',
  styleUrl: './listado-lineas.component.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListadoLineasComponent {
  private readonly lineasService = inject(LineasFacturaService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly idFactura = input.required<number>();
  readonly isEditable = input<boolean>(true);

  readonly lineas = this.lineasService.lineas;
  readonly error = signal('');

  readonly sidebarOpen = signal(false);
  readonly selectedLineaId = signal<number | null>(null);

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

  abrirSidebarLinea(id?: number) {
    this.selectedLineaId.set(id ?? null);
    this.sidebarOpen.set(true);
  }

  cerrarSidebar() {
    this.sidebarOpen.set(false);
    this.selectedLineaId.set(null);
  }

  onLineaGuardada() {
    this.cerrarSidebar();
    this.cargarLineas();
  }

  borrarLinea(id?: number) {
    this.lineasService.eliminarLinea(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado la linea correctamente',
          tipoToast: 'submit',
        }),
      error: (err) => console.error(err),
    });
  }
}
