import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FacturasService } from '../../../core/services/facturas.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { Factura } from '../../../core/models/factura.model';
import { INVOICE_STATUS } from '../../../core/constants/factura.constants';
import { FacturaDetailSidebarComponent } from '../factura-detail-sidebar/factura-detail-sidebar';

@Component({
  selector: 'app-listado-facturas',
  imports: [
    CurrencyPipe,
    BotonPropioComponent,
    MatIconModule,
    ConfirmDirective,
    FacturaDetailSidebarComponent,
  ],
  templateUrl: './listado-facturas.component.html',
  styleUrl: './listado-facturas.component.css',
  standalone: true,
})
export class ListadoFacturasComponent {
  private facturasService = inject(FacturasService);
  private readonly router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  facturas = this.facturasService.facturasCompleto;

  mostrarFiltros = signal(false);
  searchNumero = signal('');
  searchAseguradora = signal('');
  searchClient = signal('');
  searchStatus = signal('');
  importeOperador = signal<'mayor' | 'menor' | ''>('');
  importeValor = signal<number | null>(null);
  statusOptions = signal(INVOICE_STATUS);
  sidebarOpen = signal(false);
  selectedFacturaId = signal<string | null>(null);

  isEditable(factura: Factura) {
    return factura.status != 3; // Solo se pueden editar las facturas que no están aprobadas
  }

  facturasFiltradas = computed(() => {
    let resultado = this.facturas();

    const numero = this.searchNumero().toLowerCase().trim();
    if (numero) {
      resultado = resultado.filter((f) =>
        f.numeroFactura?.toString().toLowerCase().includes(numero),
      );
    }

    const aseguradora = this.searchAseguradora().toLowerCase().trim();
    if (aseguradora) {
      resultado = resultado.filter((f) => f.insuranceName?.toLowerCase().includes(aseguradora));
    }

    const client = this.searchClient().toLowerCase().trim();
    if (client) {
      resultado = resultado.filter((f) => f.clientLegalName?.toLowerCase().includes(client));
    }

    const status = this.searchStatus().toLowerCase().trim();
    if (status) {
      resultado = resultado.filter((f) => f.status?.toString().toLowerCase().includes(status));
    }

    const operador = this.importeOperador();
    const valor = this.importeValor();
    if (operador && valor !== null) {
      resultado = resultado.filter((f) =>
        operador === 'mayor'
          ? f.importeTotal !== null && f.importeTotal > valor
          : f.importeTotal !== null && f.importeTotal < valor,
      );
    }

    return resultado;
  });
  hayFiltrosActivos = computed(
    () =>
      !!this.searchNumero() ||
      !!this.searchClient() ||
      !!this.searchAseguradora() ||
      !!this.searchStatus() ||
      (!!this.importeOperador() && this.importeValor() !== null),
  );

  ngOnInit() {
    this.facturasService
      .cargarFacturas()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          console.log('¡Datos llegados al componente!', datos);
        },
        error: () => {
          console.log('Error al cargar las facturas');
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
  borrarfactura(id: string, entityRowVersion: string) {
    console.log('Intentando borrar la factura con id ' + id);
    this.facturasService.eliminarFactura(id,entityRowVersion).subscribe({
      next: () => {
        this.toastService.mostrar({
          texto: 'Se ha eliminado la factura correctamente',
          tipoToast: 'submit',
        });
      },
      error: () => {
        this.toastService.mostrar({ texto: 'Error al eliminar la factura', tipoToast: 'delete' });
      },
    });
  }

  // Computed con todos los filtros combinados

  limpiarFiltros() {
    this.searchNumero.set('');
    this.searchAseguradora.set('');
    this.searchClient.set('');
    this.searchStatus.set('');
    this.importeOperador.set('');
    this.importeValor.set(null);
  }
  abrirDetalle(id: string) {
    this.selectedFacturaId.set(id);
    this.sidebarOpen.set(true);
  }

  cerrarSidebar() {
    this.sidebarOpen.set(false);
    this.selectedFacturaId.set(null);
  }
}
