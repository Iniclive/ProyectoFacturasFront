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
import { BotonPropio } from '../../../../shared/boton-propio/boton-propio';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { InsuranceService } from '../../../core/services/insurance.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { mapearAFacturaCreate } from '../../../core/mappers/factura.mapper';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { map } from 'rxjs';
import { ListadoLineasComponent } from '../../lineas-factura/listado-lineas/listado-lineas.component';

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
    ConfirmDirective,
    ListadoLineasComponent,
  ],
  templateUrl: './detalle-factura.component.html',
  styleUrl: './detalle-factura.component.css',
})
export class DetalleFacturaComponent implements OnInit {
  private readonly facturasService = inject(FacturasService);
  private readonly insuranceService = inject(InsuranceService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  // Señales de UI
  tiposIva = signal(TIPOS_IVA_DEFAULT);
  insurances = this.insuranceService.insurances;
  factura = this.facturasService.currentFactura;
  estaGuardando = signal(false);
  formEnviado = signal(false);
  aseguradoraTocada = signal(false);

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
    // Cada vez que cambie idRuta, se carga la factura correspondiente
    effect(() => {
      const id = this.idRuta();
      this.facturasService.cargarFacturaId(id === 'nueva' ? 'nueva' : id);
    });
  }

  ngOnInit(): void {
    // Cargar aseguradoras
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
        fechaFactura: fechaSeleccionada.toISOString(),
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
