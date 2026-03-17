import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  DestroyRef,
  input,
  effect,
} from '@angular/core';
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
import { map, switchMap } from 'rxjs';
import { ListadoLineasComponent } from '../../lineas-factura/listado-lineas/listado-lineas.component';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { Factura } from '../../../core/models/factura.model';
import { FacturaStateService } from '../../../core/services/facturas-state.service';

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
  estaGuardando = signal(false);
  formEnviado = signal(false);
  aseguradoraTocada = signal(false);
  textoBoton = computed(() =>
    this.estaGuardando() ? 'Guardando...' : this.isSaved() ? 'Actualizar Factura' : 'Crear Factura',
  );


  // ID de la ruta como signal, actualizable automáticamente
  idRuta = toSignal(
    this.route.paramMap.pipe(map((params: ParamMap) => params.get('id') ?? 'nueva')),
    { initialValue: 'nueva' as string },
  );

  // Computeds derivados
  isSaved = computed(() => this.idRuta() !== 'nueva');

  aseguradoraValida = computed(() => {
    const id = this.factura().aseguradora;
    return id !== null && id !== 0;
  });

  mostrarErrorAseguradora = computed(() => {
    return !this.aseguradoraValida() && (this.formEnviado() || this.aseguradoraTocada());
  });

  formularioEsValido = computed(() => this.aseguradoraValida());

  constructor() {
    toObservable(this.idRuta)
      .pipe(
        switchMap((id) => this.facturasService.cargarFacturaId(id)),
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
      if(!this.isSaved()){
        this.estaGuardando.set(true);
        this.facturasService.guardarFactura(mapearAFacturaCreate(this.factura())).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          this.router.navigate(['/facturas', this.factura().idFactura], { replaceUrl: true });
          console.log('Cabecera guardada, ya puedes añadir líneas.');
        },
        error: () => this.estaGuardando.set(false),
      });
      }
      else{
        this.estaGuardando.set(true);
        this.facturasService.actualizarFactura(mapearAFacturaUpdate(this.factura())).subscribe({
        next: () => {
          this.estaGuardando.set(false);
          console.log('Se ha actualizado la factura');
        },
        error: () => this.estaGuardando.set(false),
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
    if (fecha) this.actualizarFactura({ fechaFactura: fecha.toISOString() });
  }

  actualizarFactura(cambios: Partial<Factura>) {
    this.facturaState.actualizarFactura(cambios);
  }

  actualizarFacturaIva(cambios: Partial<Factura>) {
    this.facturaState.actualizarFacturaIva(cambios);
  }
}
