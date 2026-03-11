import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FacturasService } from '../../../core/services/facturas.service';
import { FACTURA_INICIAL, TIPOS_IVA_DEFAULT } from '../../../core/constants/factura.constants';
import { Factura } from '../../../core/models/factura.model';
import { FormsModule } from '@angular/forms';
import { BotonPropio } from '../../../../shared/boton-propio/boton-propio';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InsuranceService } from '../../../core/services/insurance.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { mapearAFacturaCreate } from '../../../core/mappers/factura.mapper';

@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    FormsModule,
    BotonPropio,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {

  private readonly facturasService = inject(FacturasService);
  private readonly insuranceService = inject(InsuranceService);
  /*private readonly dialogRef = inject(MatDialogRef<DetalleFacturaComponent>);
  public readonly data = inject(MAT_DIALOG_DATA);*/
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  tiposIva = signal(TIPOS_IVA_DEFAULT);
  insurances = this.insuranceService.insurances;
  private destroyRef = inject(DestroyRef);
  factura = this.facturasService.currentFactura;
  estaGuardando = signal(false);
  mostrarNumero = computed(() => this.factura().idFactura !== 'nueva');
  formEnviado = signal(false);
  aseguradoraTocada = signal(false);
  aseguradoraValida = computed(() => {
    const id = this.factura().aseguradora;
    return id !== null && id !== 0;
  });
  mostrarErrorAseguradora = computed(() => {
    return !this.aseguradoraValida() && (this.formEnviado() || this.aseguradoraTocada());
  });
  formularioEsValido = computed(() => this.aseguradoraValida()); //&& this.numeroFacturaValido()

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.facturasService.cargarFacturaId(id ?? 'nueva');
    this.insuranceService.cargarInsurances();
  }


  guardarCabecera() {
    this.formEnviado.set(true);
    if (this.formularioEsValido()) {
      this.estaGuardando.set(true);
      this.facturasService.guardarFactura(mapearAFacturaCreate(this.factura())).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.router.navigate(['/facturas', this.factura().idFactura], { replaceUrl: true });
          console.log('Cabecera guardada, ya puedes añadir líneas.');
        },
        error: () => this.estaGuardando.set(false),
      });
    } else {
      console.error('Formulario inválido');
    }
  }

  cancelar() {
    this.router.navigate(['/facturas']);
  }

  onFechaChange(event: any) {
    const fechaSeleccionada = event.value;
    if (fechaSeleccionada) {
      this.facturasService.actualizarFacturaSeleccionada({
        fechaFactura: fechaSeleccionada.toISOString()
      });
    }
  }

  actualizarAseguradora(id: number) {
    this.facturasService.actualizarFacturaSeleccionada({ aseguradora: id });
  }

  actualizarTipoIva(valor: number | null) {
    this.facturasService.actualizarFacturaSeleccionada({ tipoIva: valor });
  }
}

