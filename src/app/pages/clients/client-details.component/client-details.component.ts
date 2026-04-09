import { Component, computed, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { MatIcon } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientsService } from '../../../core/services/clients.service';
import { Client, ClientCreate, ClientUpdate } from '../../../core/models/client.models';
import { CIF_REGEX, EMAIL_REGEX } from '../../../core/constants/validation.constants';
import { mapToClientCreate, mapToClientUpdate } from '../../../core/mappers/client.mapper';
import { map } from 'rxjs';
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";


export interface ClientDialogData {
  clientId: string | null;
}

@Component({
  selector: 'app-client-details.component',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, ConfirmDirective],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css',
})
export class ClientDetailsComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly dialogRef = inject(MatDialogRef<ClientDetailsComponent>);
  private readonly toastService = inject(ToastService);
  readonly data = inject<ClientDialogData>(MAT_DIALOG_DATA);
  currentClient = this.clientsService.selectedClient;
  showPassword = signal(false);
  isSaving = signal(false);
  formSent = signal(false);
  readonly isEditing = computed(() => this.data.clientId !== null);

  private cif = computed(() => this.currentClient()?.cif?.trim());
  private legalName = computed(() => this.currentClient()?.legalName?.trim());
  private commercialName = computed(() => this.currentClient()?.commercialName?.trim());
  private email = computed(() => this.currentClient()?.email?.trim());
  private phone = computed(() => this.currentClient()?.phone?.trim());
  private address = computed(() => this.currentClient()?.address?.trim());

  legalNameError = computed((): string => {
    if (!this.legalName()) return 'El nombre legal es obligatorio';
    return '';
  });

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


  validatedForm = computed(
    () =>
      !this.emailError() &&
      !this.showLegalNameError() &&
      !this.showCifError(),
  );

  ngOnInit(): void {
  this.clientsService.loadCurrentClientInfoById(this.data.clientId);
}

  updateField(changes: Partial<Client>) {
    this.clientsService.updateCurrentClient(changes);
  }

  saveClient() {
    console.log('Guardando cliente:', this.currentClient());
    this.formSent.set(true);
    if (!this.validatedForm()) return;
    console.log('Formulario validado', this.currentClient());
    this.isSaving.set(true);
    if (this.isEditing()) {

      const updatedClient = mapToClientUpdate(
        this.currentClient() as Client
       );
      console.log('Cliente actualizado a enviar:', updatedClient);
      this.clientsService.updateClient(updatedClient).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Cliente actualizado correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({
            texto: 'Error al actualizar el cliente',
            tipoToast: 'delete',
          });
        },
      });
    } else {

      const newClient = mapToClientCreate(
        this.currentClient() as Client
       );
      this.clientsService.createClient(newClient).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Cliente creado correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al crear el cliente', tipoToast: 'delete' });
        },
      });
    }
  }
  cancelar() {
    this.dialogRef.close(false);
  }
}
