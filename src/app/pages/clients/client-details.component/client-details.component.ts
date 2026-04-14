import { Component, computed, inject, input, output, signal } from '@angular/core';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { ClientsService } from '../../../core/services/clients.service';
import { Client } from '../../../core/models/client.models';
import { CIF_REGEX, EMAIL_REGEX } from '../../../core/constants/validation.constants';
import { mapToClientCreate, mapToClientUpdate } from '../../../core/mappers/client.mapper';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';

@Component({
  selector: 'app-client-details',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, ConfirmDirective],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  // Inputs / Outputs (reemplaza MatDialog)
  clientId = input<string | null>(null);
  onClose = output<void>();

  private readonly clientsService = inject(ClientsService);
  private readonly toastService = inject(ToastService);

  currentClient = this.clientsService.selectedClient;
  isSaving = signal(false);
  formSent = signal(false);

  readonly isEditing = computed(() => this.clientId() !== null);

  private cif = computed(() => this.currentClient()?.cif?.trim());
  private legalName = computed(() => this.currentClient()?.legalName?.trim());
  private email = computed(() => this.currentClient()?.email?.trim());

  legalNameError = computed((): string => (!this.legalName() ? 'El nombre legal es obligatorio' : ''));
  emailError = computed((): string => {
    if (!this.email()) return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(this.email() ?? '')) return 'Introduce un email válido';
    return '';
  });
  cifError = computed((): string => {
    if (!this.cif()) return 'El CIF es obligatorio';
    if (!CIF_REGEX.test(this.cif() ?? '')) return 'Introduce un CIF válido';
    return '';
  });

  showLegalNameError = computed(() => !!this.legalNameError() && this.formSent());
  showEmailError = computed(() => !!this.emailError() && this.formSent());
  showCifError = computed(() => !!this.cifError() && this.formSent());

  validatedForm = computed(() => !this.emailError() && !this.legalNameError() && !this.cifError());

  ngOnInit(): void {
    this.clientsService.loadCurrentClientInfoById(this.clientId());
  }

  updateField(changes: Partial<Client>) {
    this.clientsService.updateCurrentClient(changes);
  }

  saveClient() {
    this.formSent.set(true);
    if (!this.validatedForm()) return;
    this.isSaving.set(true);

    if (this.isEditing()) {
      const updatedClient = mapToClientUpdate(this.currentClient() as Client);
      this.clientsService.updateClient(updatedClient).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Cliente actualizado correctamente', tipoToast: 'submit' });
          this.onClose.emit();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar el cliente', tipoToast: 'delete' });
        },
      });
    } else {
      const newClient = mapToClientCreate(this.currentClient() as Client);
      this.clientsService.createClient(newClient).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Cliente creado correctamente', tipoToast: 'submit' });
          this.onClose.emit();
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al crear el cliente', tipoToast: 'delete' });
        },
      });
    }
  }

  cancelar() {
    this.onClose.emit();
  }
}
