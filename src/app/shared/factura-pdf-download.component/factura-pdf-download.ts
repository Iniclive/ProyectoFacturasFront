import { Component, computed, inject, input, output, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Factura } from '../../core/models/factura.model';
import { LineaFactura } from '../../core/models/linea-factura.model';
import { Client } from '../../core/models/client.models';
import { FacturaPdfService } from '../../core/services/factura-pdf.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-factura-pdf-download',
  imports: [MatIcon],
  templateUrl: './factura-pdf-download.component.html',
  styleUrl: './factura-pdf-download.component.css',
})
export class FacturaPdfDownload {
// ── Inputs ──────────────────────────────────────────────────────────────────

  /** Datos de cabecera de la factura (obligatorio) */
  factura = input.required<Factura>();

  /** Líneas de la factura (obligatorio) */
  lineas = input.required<LineaFactura[]>();

  /** Datos completos del cliente (opcional, enriquece email/teléfono/dirección) */
  client = input.required<Client>();

  /** Configuración del emisor. Si no se pasa, usa valores por defecto del servicio */
  //emisor = input<EmisorConfig | undefined>(undefined);

  /** Texto personalizable del botón */
  label = input<string>('Descargar PDF');

  /** Deshabilitar el botón externamente */
  disabled = input<boolean>(false);

  // ── Outputs ─────────────────────────────────────────────────────────────────

  /** Emite cuando la descarga se inicia con éxito */
  onDescargaIniciada = output<void>();

  /** Emite si ocurre un error durante la generación */
  onError = output<Error>();

  // ── Servicios ────────────────────────────────────────────────────────────────

  private readonly pdfService   = inject(FacturaPdfService);
  private readonly toastService = inject(ToastService);

  // ── Estado interno ────────────────────────────────────────────────────────────

  isGenerating = signal(false);

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

