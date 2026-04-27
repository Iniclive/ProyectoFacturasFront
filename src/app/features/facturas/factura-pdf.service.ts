import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Client } from '../../features/clients/client.models';
import { Factura } from './factura.model';
import { LineaFactura } from '../lineas-factura/linea-factura.model';


const COLOR_PRIMARY: [number, number, number] = [15, 76, 129];
const COLOR_ACCENT: [number, number, number]  = [0, 150, 136];
const COLOR_LIGHT: [number, number, number]   = [245, 248, 252];
const COLOR_GRAY: [number, number, number]    = [100, 110, 120];
const COLOR_WHITE: [number, number, number]   = [255, 255, 255];
const COLOR_BLACK: [number, number, number]   = [30, 30, 30];

export interface EmisorConfig {
  nombre: string;
  nif: string;
  direccion: string;
}

@Injectable({ providedIn: 'root' })
export class FacturaPdfService {

generate(
    factura: Factura,
    lineas: LineaFactura[],
    client?: Client,
    emisor: EmisorConfig = {
      nombre: 'Mi Empresa S.L.',
      nif: 'B12345678',
      direccion: 'Calle Ejemplo 1, 28001 Madrid',
    },
  ): void {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 14;

    // ── Cabecera ──────────────────────────────────────────────────────────────
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, 0, W, 32, 'F');

    // Cabecera: altura 34mm, todo centrado verticalmente

    const numFactura = factura.numeroFactura ?? `ID-${factura.idFactura}`;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...COLOR_WHITE);
    doc.setFontSize(18);
    doc.text(`FACTURA Nº ${numFactura}`, M, 19);

    // Info derecha alineada verticalmente igual que la izquierda
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Fecha:  ${this.formatDate(factura.fechaFactura)}`, W - M, 13, { align: 'right' });
    doc.text(`Gestor:  ${factura.userName ?? '—'}`, W - M, 22, { align: 'right' });

    // ── Emisor / Cliente ──────────────────────────────────────────────────────
    let y = 42;
    const colMid = W / 2 + 3;

    doc.setFillColor(...COLOR_LIGHT);
    doc.roundedRect(M, y - 3, W - M * 2, 36, 2, 2, 'F');

    // Emisor
    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('EMISOR', M + 4, y + 2);
    doc.setTextColor(...COLOR_BLACK);
    doc.setFontSize(9.5);
    doc.text(emisor.nombre, M + 4, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`NIF: ${emisor.nif}`, M + 4, y + 14);
    doc.text(doc.splitTextToSize(emisor.direccion, 82), M + 4, y + 20);

    // Separador
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.setLineWidth(0.3);
    doc.line(colMid - 4, y, colMid - 4, y + 32);

    // Cliente
    const clientName  = client?.legalName  ?? factura.clientLegalName ?? '—';
    const clientCif   = client?.cif        ?? factura.clientCif        ?? '—';
    const clientEmail = client?.email      ?? '';
    const clientPhone = client?.phone      ?? '';
    const clientAddr  = client?.address    ?? '';

    doc.setTextColor(...COLOR_PRIMARY);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('CLIENTE', colMid, y + 2);
    doc.setTextColor(...COLOR_BLACK);
    doc.setFontSize(9.5);
    doc.text(clientName, colMid, y + 8);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.text(`CIF: ${clientCif}`, colMid, y + 14);

    let clientFieldY = y + 20;
    if (clientEmail) {
      this.drawLabelValue(doc, 'Email:', clientEmail, colMid, clientFieldY);
      clientFieldY += 6;
    }
    if (clientPhone) {
      this.drawLabelValue(doc, 'Tel:', clientPhone, colMid, clientFieldY);
      clientFieldY += 6;
    }
    if (clientAddr) {
      this.drawLabelValue(doc, 'Dir:', clientAddr, colMid, clientFieldY);
    }

    // ── Líneas ────────────────────────────────────────────────────────────────
    y += 42;

    autoTable(doc, {
      startY: y,
      margin: { left: M, right: M },
      head: [['Producto', 'Cant.', 'Precio unit.', 'Total línea']],
      body: lineas.map(l => [
        l.productName,
        l.cantidad.toString(),
        this.formatCurrency(l.importe),
        this.formatCurrency(l.importeTotal),
      ]),
      headStyles: { fillColor: COLOR_PRIMARY, textColor: COLOR_WHITE, fontStyle: 'bold', fontSize: 8.5, cellPadding: 3 },
      bodyStyles:          { fontSize: 8.5, textColor: COLOR_BLACK, cellPadding: 2.8 },
      alternateRowStyles:  { fillColor: COLOR_LIGHT },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { halign: 'center', cellWidth: 18 },
        2: { halign: 'right',  cellWidth: 32 },
        3: { halign: 'right',  cellWidth: 32 },
      },
      // Alinear cabeceras igual que los valores de cada columna
      didParseCell: (data) => {
        if (data.section === 'head') {
          if (data.column.index === 1) data.cell.styles.halign = 'center';
          if (data.column.index === 2) data.cell.styles.halign = 'right';
          if (data.column.index === 3) data.cell.styles.halign = 'right';
        }
      },
      tableLineColor: [220, 225, 235],
      tableLineWidth: 0.2,
    });

    // ── Totales ───────────────────────────────────────────────────────────────
    const tableEndY: number = (doc as any).lastAutoTable.finalY;
    const totW = 75;
    const totX = W - M - totW;
    let ty = tableEndY + 6;

    doc.setFillColor(...COLOR_LIGHT);
    doc.roundedRect(totX - 2, ty - 2, totW + 4, 30, 2, 2, 'F');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_GRAY);
    doc.text('Base imponible', totX, ty + 4);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(this.formatCurrency(factura.importe ?? 0), W - M, ty + 4, { align: 'right' });

    ty += 8;
    doc.setTextColor(...COLOR_GRAY);
    doc.text(factura.tipoIva != null ? `IVA (${factura.tipoIva}%)` : 'IVA', totX, ty + 4);
    doc.setTextColor(...COLOR_BLACK);
    doc.text(this.formatCurrency(factura.importeIva ?? 0), W - M, ty + 4, { align: 'right' });

    ty += 8;
    doc.setDrawColor(...COLOR_PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(totX, ty + 2, W - M, ty + 2);

    ty += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...COLOR_PRIMARY);
    doc.text('TOTAL', totX, ty + 4);
    doc.text(this.formatCurrency(factura.importeTotal ?? 0), W - M, ty + 4, { align: 'right' });

    // ── Pie ───────────────────────────────────────────────────────────────────
    doc.setFillColor(...COLOR_PRIMARY);
    doc.rect(0, H - 14, W, 14, 'F');
    doc.setTextColor(...COLOR_WHITE);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text(
      `Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}  ·  ${emisor.nombre}  ·  ${emisor.nif}`,
      W / 2, H - 6, { align: 'center' },
    );

    doc.save(`factura-${factura.numeroFactura ?? factura.idFactura}.pdf`);
  }

  /** Dibuja una etiqueta en negrita seguida de su valor en normal en la misma línea */
  private drawLabelValue(doc: jsPDF, label: string, value: string, x: number, y: number): void {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...COLOR_GRAY);
    doc.text(label, x, y);
    const labelWidth = doc.getTextWidth(label) + 1.5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...COLOR_BLACK);
    doc.text(value, x + labelWidth, y);
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(amount);
  }

  private formatDate(iso: string | null): string {
    if (!iso) return '—';
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return iso;
    }
  }
}
