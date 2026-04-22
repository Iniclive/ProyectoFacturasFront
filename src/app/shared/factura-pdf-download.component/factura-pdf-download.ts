import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { forkJoin } from 'rxjs';
import { Factura } from '../../core/models/factura.model';
import { FacturaPdfService } from '../../core/services/factura-pdf.service';
import { ToastService } from '../../core/services/toast.service';
import { LineasFacturaService } from '../../core/services/lineas-factura.service';
import { ClientsService } from '../../core/services/clients.service';

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
  factura = input.required<Factura>();
  label = input<string>('Descargar PDF');
  disabled = input<boolean>(false);

  // ── Estado interno ──────────────────────────────────────────────────────────
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

  // ── Acción ────────────────────────────────────────────────────────────────────

  descargar(): void {
    if (this.isDisabled()) return;

    this.isGenerating.set(true);
    const f = this.factura();

    forkJoin({
      client: this.clientsService.getClientDetails(f.clientId.toString()),
      lineas: this.lineasFacturaservice.cargarLineas(f.idFactura),
    }).subscribe({
      next: ({ client, lineas }) => {
        // setTimeout(0) libera el hilo para que Angular renderice "Generando..."
        // antes de que jsPDF bloquee el hilo con la generación del PDF.
        setTimeout(() => {
          try {
            this.pdfService.generate(f, lineas, client);
            this.onDescargaIniciada.emit();
            this.toastService.mostrar({
              texto: `Factura ${f.numeroFactura ?? f.idFactura} descargada`,
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
      },
      error: (err) => {
        this.isGenerating.set(false);
        this.onError.emit(err);
        this.toastService.mostrar({ texto: 'Error al cargar datos de la factura', tipoToast: 'delete' });
      },
    });
  }
}

