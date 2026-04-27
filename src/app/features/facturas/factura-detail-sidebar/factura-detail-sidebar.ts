import { Component, computed, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FACTURA_INICIAL, INVOICE_STATUS } from '../../../core/constants/factura.constants';
import { FacturaPdfDownload } from "../factura-pdf-download.component/factura-pdf-download";
import { StatusBadgeComponent } from "../../../shared/status-badge/status-badge.component";
import { BotonPropioComponent } from "../../../shared/boton-propio/boton-propio.component";
import { FacturasService } from '../facturas.service';

@Component({
  selector: 'app-factura-detail-sidebar',
  imports: [MatIcon, CurrencyPipe, DatePipe, FacturaPdfDownload, StatusBadgeComponent, BotonPropioComponent],
  templateUrl: './factura-detail-sidebar.component.html',
  styleUrl: './factura-detail-sidebar.component.css',
})
export class FacturaDetailSidebarComponent {


  facturaId = input<string | null>(null);
  onClose = output<void>();

  private readonly facturasService = inject(FacturasService);
  private readonly router = inject(Router);

  factura = computed(() =>
    this.facturasService.facturasCompleto().find(
      f => f.idFactura.toString() === this.facturaId()
    ) || FACTURA_INICIAL
  );

  isAprovedState = computed (() =>
      this.factura()?.status ===
      INVOICE_STATUS.find((s) => s.statusName === 'AprobadaCerrada')?.value,
  );

  isEditable = computed(() => this.factura()?.status !== INVOICE_STATUS.find(s => s.statusName === 'AprobadaCerrada')?.value);

  irAEdicion() {
    this.router.navigate(['/facturas', this.facturaId()]);
    this.onClose.emit();
  }

  cerrar() {
    this.onClose.emit();
  }

  onPdfDescargado() {
    throw new Error('Method not implemented.');
  }
}
