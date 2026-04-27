import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { StatusBadgeComponent } from '../../../shared/status-badge/status-badge.component';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    MatIconModule,
    RouterLink,
    BotonPropioComponent,
    StatusBadgeComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly summary = this.dashboardService.summary;
  readonly facturasRecientes = computed(() => this.summary()?.facturasRecientes ?? []);

  readonly saludo = computed(() => {
    const hora = new Date().getHours();
    if (hora < 6) return 'Buenas noches';
    if (hora < 13) return 'Buenos días';
    if (hora < 21) return 'Buenas tardes';
    return 'Buenas noches';
  });

  ngOnInit(): void {
    this.dashboardService
      .cargarResumen()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: () => {} });
  }

  nuevaFactura(): void {
    this.router.navigate(['/facturas', 'nueva']);
  }

  abrirFactura(id: string): void {
    this.router.navigate(['/facturas', id]);
  }
}
