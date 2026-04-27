import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';

import { ClientDetailsComponent } from '../client-details.component/client-details.component';
import { ClientsService } from '../clients.service';

@Component({
  selector: 'app-client.component',
  imports: [MatIcon, BotonPropioComponent, ConfirmDirective, ClientDetailsComponent],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {
  clientsService = inject(ClientsService);
  clients = this.clientsService.clients;
  error = signal('');
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);

  // Sidebar
  sidebarOpen = signal(false);
  selectedClientId = signal<string | null>(null);

  // Filtros
  showFilters = signal(false);
  searchCif = signal('');
  searchLegalName = signal('');
  searchCommercialName = signal('');
  searchEmail = signal('');

  ngOnInit() {
    this.loadClients();
  }

  private loadClients() {
    this.clientsService.loadClients().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
  }

  showClientDetails(id: string) {
    this.selectedClientId.set(id);
    this.sidebarOpen.set(true);
  }

  createClient() {
    this.selectedClientId.set(null);
    this.sidebarOpen.set(true);
  }

  cerrarSidebar() {
    this.sidebarOpen.set(false);
    this.selectedClientId.set(null);
  }

  deleteClient(id: string) {
    this.clientsService.deleteClient(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado el cliente correctamente',
          tipoToast: 'submit',
        }),
      error: () =>
        this.toastService.mostrar({
          texto: 'Error al eliminar el cliente',
          tipoToast: 'delete',
        }),
    });
  }

  filteredClients = computed(() => {
    let result = this.clients();
    const cif = this.searchCif().toUpperCase().trim();
    if (cif) result = result.filter((u) => u.cif?.toUpperCase().includes(cif));
    const legalName = this.searchLegalName().toLowerCase().trim();
    if (legalName) result = result.filter((u) => u.legalName?.toLowerCase().includes(legalName));
    const commercialName = this.searchCommercialName().toLowerCase().trim();
    if (commercialName) result = result.filter((u) => u.commercialName?.toLowerCase().includes(commercialName));
    const email = this.searchEmail().toLowerCase().trim();
    if (email) result = result.filter((u) => u.email?.toLowerCase().includes(email));
    return result;
  });

  activeFilters = computed(() => !!this.searchCif() || !!this.searchEmail() || !!this.searchLegalName());

  resetFilters() {
    this.searchCif.set('');
    this.searchEmail.set('');
    this.searchLegalName.set('');
    this.searchCommercialName.set('');
  }
}
