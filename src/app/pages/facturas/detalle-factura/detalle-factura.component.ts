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
    MatIconModule
  ],
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {

  abrirModalNuevaLinea() {
    throw new Error('Method not implemented.');
  }
  private readonly facturasService = inject(FacturasService);
  private readonly insuranceService = inject(InsuranceService);
  /*private readonly dialogRef = inject(MatDialogRef<DetalleFacturaComponent>);
  public readonly data = inject(MAT_DIALOG_DATA);*/
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  tiposIva = signal(TIPOS_IVA_DEFAULT);
  insurances = this.insuranceService.insurances;
  private destroyRef = inject(DestroyRef);
  factura = signal<Factura>({ ...FACTURA_INICIAL });
  estaGuardando = signal(false);
  mostrarNumero = computed(() => this.factura().idFactura !== 'nueva');

  ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id');
  if (id && id !== 'nueva') {
    this.cargarDatos(id);
  }
  this.cargarInsurance();
  }

  cargarDatos(id: string) {
    this.facturasService.cargarFacturaId(id).subscribe((datos) => {
      this.factura.set(datos);
    });

  }

  guardarCabecera() {
    this.estaGuardando.set(true);
    this.facturasService.guardarFactura(this.factura()).subscribe({
      next: (facturaGuardada) => {
        this.factura.set(facturaGuardada);
        this.estaGuardando.set(false);
        console.log('Cabecera guardada, ya puedes añadir líneas.');
      },
      error: () => this.estaGuardando.set(false),
    });
  }
  cargarInsurance() {
    this.insuranceService
      .cargarInsurances()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (datos) => {
          console.log('Se han cargado los datos de las Aseguradoras!', datos);
        },
        error: () => {
          //this.error.set('Error al cargar las imagenes');
        },
        complete: () => {},
      });
  }

  cancelar() {
    // Cerramos el modal sin devolver datos
    this.router.navigate(['/facturas']);
  }

  onFechaChange(event: any) {
  const fechaSeleccionada = event.value; // Esto es un objeto Date
  if (fechaSeleccionada) {
    // Convertimos a string ISO y actualizamos el signal
    const fechaIso = fechaSeleccionada.toISOString();
    this.factura.update(f => ({ ...f, fechaFactura: fechaIso }));
    console.log("Nueva fecha guardada:", fechaIso);
  }
}
}
