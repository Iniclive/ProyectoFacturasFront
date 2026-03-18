import { Component, OnInit, inject, signal, computed, DestroyRef } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FacturasService } from '../../../core/services/facturas.service';
import { TIPOS_IVA_DEFAULT } from '../../../core/constants/factura.constants';
import { FormsModule } from '@angular/forms';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InsuranceService } from '../../../core/services/insurance.service';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mapearAFacturaCreate, mapearAFacturaUpdate } from '../../../core/mappers/factura.mapper';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { map, switchMap, tap } from 'rxjs';
import { ListadoLineasComponent } from '../../lineas-factura/listado-lineas/listado-lineas.component';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { Factura } from '../../../core/models/factura.model';
import { FacturaStateService } from '../../../core/services/facturas-state.service';
import { ToastService } from '../../../core/services/toast.service';
import { DisabledTooltipDirective } from '../../../core/directives/disabled-tooltip.directive';

@Component({
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,
    FormsModule,
    DatePipe,
    FormsModule,
    MatDatepickerModule,
    MatInputModule,
    CurrencyPipe,
    MatFormFieldModule,
    MatIconModule,
    ConfirmDirective,
    ListadoLineasComponent,
    FormErrorComponent,
    BotonPropioComponent,
    DisabledTooltipDirective
  ],
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {
  private readonly facturasService = inject(FacturasService);
  private readonly insuranceService = inject(InsuranceService);
  private readonly facturaState = inject(FacturaStateService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Señales de UI
  tiposIva = signal(TIPOS_IVA_DEFAULT);
  insurances = this.insuranceService.insurances;
  factura = this.facturaState.currentFactura;
  private toastService = inject(ToastService);
  estaGuardando = signal(false);
  formEnviado = signal(false);
  facturaActualizada = signal(false);

  //aseguradoraTocada = signal(false);
  textoBoton = computed(() =>
    this.estaGuardando() ? 'Guardando...' : this.isSaved() ? 'Actualizar Factura' : 'Crear Factura',
  );

  // ID de la ruta como signal, actualizable automáticamente
  idRuta = toSignal(
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('id') ?? 'nueva')),
    { initialValue: 'nueva' as string },
  );

  isLoading = signal(this.idRuta() !== 'nueva');

  // Computeds derivados
  isSaved = computed(() => this.idRuta() !== 'nueva');

  aseguradoraValida = computed(() => {
    const id = this.factura().aseguradora;
    return id !== null && id !== 0;
  });

  numeroFacturaValido = computed(() => {
  const num = this.factura().numeroFactura;
  return !!num && num.toString().trim().length > 0;
});

  mostrarErrorAseguradora = computed(() => {
    return !this.aseguradoraValida() && (this.formEnviado());
  });
  mostrarErrorNumeroFactura = computed(() => {
    return !this.numeroFacturaValido() && (this.formEnviado());
  });

  formularioEsValido = computed(() => this.aseguradoraValida() && this.numeroFacturaValido());

  constructor() {
    toObservable(this.idRuta)
      .pipe(
        tap(() => {
        this.isLoading.set(true);
        this.formEnviado.set(false); // reset del estado del form también
      }),
      switchMap((id) => this.facturasService.cargarFacturaId(id)),
      tap(() => this.isLoading.set(false)),
      takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.insuranceService.cargarInsurances();
  }

  guardarCabecera() {
    this.formEnviado.set(true);
    if (this.formularioEsValido()) {
      if (!this.isSaved()) {
        this.estaGuardando.set(true);
        this.facturasService.guardarFactura(mapearAFacturaCreate(this.factura())).subscribe({
          next: () => {
            this.estaGuardando.set(false);
            this.router.navigate(['/facturas', this.factura().idFactura], { replaceUrl: true });
            this.toastService.mostrar({texto: 'Se ha creado la factura correctamente', tipoToast: 'submit'})
            console.log('Cabecera guardada, ya puedes añadir líneas.');
          },
          error: () => {
            this.estaGuardando.set(false);
           this.toastService.mostrar({texto: 'Error al crear la factura', tipoToast: 'delete'});
          },
        });
      } else {
        this.estaGuardando.set(true);
        this.facturasService.actualizarFactura(mapearAFacturaUpdate(this.factura())).subscribe({
          next: () => {
            this.estaGuardando.set(false);
            //this.toastService.showSuccess('Se ha actualizado la factura correctamente');
            console.log('Se ha actualizado la factura');
            this.toastService.mostrar({texto: 'Se ha actualizado la factura correctamente', tipoToast: 'submit'})
          },
          error: () => {
          this.estaGuardando.set(false);
           this.toastService.mostrar({texto: 'Error al actualizar la factura', tipoToast: 'delete'});
          },
        });
      }
    } else {
      console.error('Formulario inválido');
    }
  }

  cancelar() {
    this.router.navigate(['/facturas']);
  }

  onFechaChange(fecha: Date | null) {
    if (fecha){
      this.actualizarFactura({ fechaFactura: fecha.toISOString() });
      this.facturaActualizada.set(true);
    }

  }

  actualizarFactura(cambios: Partial<Factura>) {
    this.facturaState.actualizarFactura(cambios);
    this.facturaActualizada.set(true);
  }

  actualizarFacturaIva(cambios: Partial<Factura>) {
    this.facturaState.actualizarFacturaIva(cambios);
    this.facturaActualizada.set(true);
  }

  tooltipGuardar = computed(() => {
  if (this.estaGuardando()) return ['Guardando, espera un momento...'];

  const errores: string[] = [];
  if (!this.numeroFacturaValido())                    errores.push('Introduce un número de factura');
  if (!this.facturaActualizada() && this.isSaved())   errores.push('No hay cambios que guardar');
  if (!this.aseguradoraValida())                      errores.push('Selecciona una aseguradora');

  return errores;
});
}
