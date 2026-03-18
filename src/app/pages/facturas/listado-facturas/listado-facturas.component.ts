import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FacturasService } from '../../../core/services/facturas.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-listado-facturas',
  imports: [CurrencyPipe, BotonPropioComponent, MatIconModule,ConfirmDirective],
  templateUrl: './listado-facturas.component.html',
  styleUrl: './listado-facturas.component.css',
  standalone: true,
})
export class ListadoFacturasComponent {
  facturasService = inject(FacturasService);
  private readonly router = inject(Router);
  facturas = this.facturasService.facturasSimple;
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  ngOnInit() {
    this.facturasService
      .cargarFacturasSimple()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          console.log('¡Datos llegados al componente!', datos);
        },
        error: () => {
          this.error.set('Error al cargar las imagenes');
        },
        complete: () => {},
      });
  }

  editarFactura(id?: string) {
    if (id) {
      console.log(`Redirigiendo a edición de factura: ${id}`);
      this.router.navigate(['/facturas', id]);
    } else {
      console.log('Redirigiendo a creación de nueva factura');
      this.router.navigate(['/facturas', 'nueva']);
    }

  }
  borrarfactura(id: string) {
      console.log("Intentando borrar la factura con id " + id)
      this.facturasService.eliminarFactura(id).subscribe({
    next: () => {
      this.toastService.mostrar({texto: 'Se ha eliminado la factura correctamente', tipoToast: 'submit'})
    },
    error: () => {
      this.toastService.mostrar({texto: 'Error al eliminar la factura', tipoToast: 'delete'});
    }
  });
    }

}
