import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Factura } from '../../core/models/factura.model';
import { LineaFactura } from '../../core/models/linea-factura.model';
import { Client } from '../../core/models/client.models';
import { FacturaPdfService } from '../../core/services/factura-pdf.service';
import { ToastService } from '../../core/services/toast.service';
import { LineasFacturaService } from '../../core/services/lineas-factura.service';
import { ClientsService } from '../../core/services/clients.service';
import { DEFAULT_CLIENT } from '../../core/constants/client.constants';
import { LINEA_INICIAL, LINEAS_INICIALES } from '../../core/constants/linea-factura.constants';

@Component({
  selector: 'app-factura-pdf-download',
  imports: [MatIcon],
  templateUrl: './factura-pdf-download.component.html',
  styleUrl: './factura-pdf-download.component.css',
})
export class FacturaPdfDownload {
lineasFacturaservice = inject(LineasFacturaService);
  clientsService = inject(ClientsService);
  private readonly pdfService = inject(FacturaPdfService);
  private readonly toastService = inject(ToastService);

  // ── Inputs ──────────────────────────────────────────────────────────────────
  factura = input.required<Factura>(); // Asumo que tienes este input porque lo usas abajo
  label = input<string>('Descargar PDF');
  disabled = input<boolean>(false);

  // ── Estado interno (Convertido a Signals) ───────────────────────────────────
  // Es mejor usar signals para los datos asíncronos para que la vista se actualice correctamente
  client = signal<Client>(DEFAULT_CLIENT);
  lineas = signal<LineaFactura[]>(LINEAS_INICIALES);
  isGenerating = signal(false);

  // ── Outputs ─────────────────────────────────────────────────────────────────
  onDescargaIniciada = output<void>();
  onError = output<Error>();

  // ── Computeds ─────────────────────────────────────────────────────────────────
  readonly isDisabled = computed(() => this.disabled() || this.isGenerating());
  readonly labelTexto = computed(() => this.label());

  readonly tooltipText = computed(() => {
    const f = this.factura();
    return `Descargar factura ${f.numeroFactura ?? f.idFactura}`;
  });

  ngOnInit(): void {
    // 1. Llamada para obtener el cliente
    this.clientsService.getClientDetails(this.factura().clientId.toString()).subscribe({
      next: (clientData) => {
        this.client.set(clientData);
      },
      error: (err) => {
        this.onError.emit(err);
      }
    });

    this.lineasFacturaservice.cargarLineas(this.factura().idFactura).subscribe({
      next: (lineasData) => {
        this.lineas.set(lineasData);
      },
      error: (err) => console.error(err)
    });
  }

  // ── Acción ────────────────────────────────────────────────────────────────────

  descargar(): void {
    if (this.isDisabled()) return;

    this.isGenerating.set(true);

    // setTimeout(0) libera el hilo para que Angular renderice el estado "Generando..."
    // antes de que jsPDF bloquee el hilo con la generación del PDF.
    setTimeout(() => {
      try {
        this.pdfService.generate(
          this.factura(),
          this.lineas(),
          this.client(),
          //this.emisor(),
        );
        this.onDescargaIniciada.emit();
        this.toastService.mostrar({
          texto: `Factura ${this.factura().numeroFactura ?? this.factura().idFactura} descargada`,
          tipoToast: 'submit',
        });
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error al generar el PDF');
        this.onError.emit(error);
        this.toastService.mostrar({ texto: 'Error al generar el PDF', tipoToast: 'delete' });
      } finally {
        this.isGenerating.set(false);
      }
    }, 0);
  }
}

