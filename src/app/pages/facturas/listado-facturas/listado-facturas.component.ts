import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FacturasService } from '../../../core/services/facturas.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropio } from "../../../../shared/boton-propio/boton-propio";
import { DetalleFacturaComponent } from '../detalle-factura/detalle-factura.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-listado-facturas',
  imports: [CurrencyPipe, BotonPropio,MatIconModule],
  templateUrl: './listado-facturas.component.html',
  styleUrl: './listado-facturas.component.css',
  standalone: true,
})
export class ListadoFacturasComponent {
facturasService = inject(FacturasService);
private readonly router = inject(Router);
facturas = this.facturasService.facturasSimple;
error = signal('');
private destroyRef = inject(DestroyRef); // Inyectamos la referencia de destrucción


  ngOnInit() {
    this.facturasService
      .cargarFacturasSimple()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {console.log('¡Datos llegados al componente!', datos);},
        error: () => {
          this.error.set('Error al cargar las imagenes');
        },
        complete: () => {
        },
      });
  }

editarFactura(id?: string){
  if (id) {
    console.log(`Redirigiendo a edición de factura: ${id}`);
    this.router.navigate(['/facturas', id]);
  } else {
    console.log("Redirigiendo a creación de nueva factura");
    this.router.navigate(['/facturas', 'nueva']);
  }
  /*this.dialog.open(DetalleFacturaComponent, {
    width: '90%',
    disableClose: true,
    data: { facturaId: id } // Aquí enviamos el ID al modal
  });

  /*dialogRef.afterClosed().subscribe(facturaActualizada => {
      if (facturaActualizada) {
        this.actualizarLista(facturaActualizada);
      }
    });*/


} //Pendiente de implementar
borrarfactura(){} //Pendiente de implementar
}
