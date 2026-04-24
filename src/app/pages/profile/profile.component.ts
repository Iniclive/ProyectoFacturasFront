import {
  ChangeDetectionStrategy, Component, computed,
  inject, signal
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../shared/boton-propio/boton-propio.component';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { UpdateEmailRequest, UpdateNameRequest } from '../../core/models/user.models';
import { EMAIL_REGEX, NAME_MIN_LENGTH, PASSWORD_MIN_LENGTH } from '../../core/constants/validation.constants';
import { FormErrorComponent } from "../../shared/form-error.component/form-error.component";


type EditableCard = 'name' | 'email' | 'password';

interface PasswordDraft {
  current: string;
  next: string;
  confirm: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatIconModule, BotonPropioComponent, FormErrorComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly authService  = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  readonly currentUser  = this.authService.currentUser;
  readonly editingCard  = signal<EditableCard | null>(null);
  readonly saving       = signal(false);
  readonly formSent     = signal(false);
  readonly showCurrentPwd = signal(false);
  readonly showNewPwd     = signal(false);
  readonly showConfirmPwd = signal(false);


  readonly nameDraft    = signal('');
  readonly emailDraft   = signal('');
  readonly pwdDraft     = signal<PasswordDraft>({ current: '', next: '', confirm: '' });

  updatePwdField(changes: Partial<PasswordDraft>) {
    this.pwdDraft.update((d) => ({ ...d, ...changes }));
  }


  readonly nameError = computed((): string => {
    const v = this.nameDraft().trim();
    if (!v) return 'El nombre es obligatorio';
    if (v.length < NAME_MIN_LENGTH) return `Mínimo ${NAME_MIN_LENGTH} caracteres`;
    return '';
  });

  readonly emailError = computed((): string => {
    const v = this.emailDraft().trim();
    if (!v) return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(v)) return 'Introduce un email válido';
    return '';
  });

  readonly currentPwdError = computed((): string =>
    !this.pwdDraft().current ? 'Introduce la contraseña actual' : ''
  );

  readonly newPwdError = computed((): string => {
    const v = this.pwdDraft().next;
    if (!v) return 'La nueva contraseña es obligatoria';
    if (v.length < PASSWORD_MIN_LENGTH) return `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`;
    return '';
  });

  readonly confirmPwdError = computed((): string => {
    if (!this.pwdDraft().confirm) return 'Confirma la nueva contraseña';
    if (this.pwdDraft().confirm !== this.pwdDraft().next) return 'Las contraseñas no coinciden';
    return '';
  });

  readonly showNameError       = computed(() => !!this.nameError()       && this.formSent());
  readonly showEmailError      = computed(() => !!this.emailError()      && this.formSent());
  readonly showCurrentPwdError = computed(() => !!this.currentPwdError() && this.formSent());
  readonly showNewPwdError     = computed(() => !!this.newPwdError()     && this.formSent());
  readonly showConfirmPwdError = computed(() => !!this.confirmPwdError() && this.formSent());

  readonly nameValid     = computed(() => !this.nameError());
  readonly emailValid    = computed(() => !this.emailError());
  readonly passwordValid = computed(() =>
    !this.currentPwdError() && !this.newPwdError() && !this.confirmPwdError()
  );


  startEdit(card: EditableCard) {
    const user = this.currentUser();
    this.formSent.set(false);
    this.nameDraft.set(user?.name ?? '');
    this.emailDraft.set(user?.email ?? '');
    this.pwdDraft.set({ current: '', next: '', confirm: '' });
    this.editingCard.set(card);
  }

  cancelEdit() {
    this.editingCard.set(null);
    this.formSent.set(false);
    this.pwdDraft.set({ current: '', next: '', confirm: '' });
    this.showCurrentPwd.set(false);
    this.showNewPwd.set(false);
    this.showConfirmPwd.set(false);
  }

  // --- Guardado ---
  saveName() {
    this.formSent.set(true);
    if (!this.nameValid() || this.saving()) return;
    const request: UpdateNameRequest = { name: this.nameDraft().trim() };
    this.saving.set(true);
    this.usersService.changeName(request).subscribe({
      next: () => {
        this.authService.currentUser.update((u) => (u ? { ...u, name: request.name } : u));
        this.toastService.mostrar({ texto: 'Nombre actualizado', tipoToast: 'submit' });
        this.saving.set(false);
        this.cancelEdit();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.mostrar({ texto: 'Error al actualizar el nombre', tipoToast: 'delete' });
      },
    });
  }

  saveEmail() {
    this.formSent.set(true);
    if (!this.emailValid() || this.saving()) return;
    const request: UpdateEmailRequest = { email: this.emailDraft().trim() };
    this.saving.set(true);
    this.usersService.changeEmail(request).subscribe({
      next: () => {
        this.authService.currentUser.update((u) => (u ? { ...u, email: request.email } : u));
        this.toastService.mostrar({ texto: 'Email actualizado', tipoToast: 'submit' });
        this.saving.set(false);
        this.cancelEdit();
      },
      error: (err) => {
        this.saving.set(false);
        const texto = err?.status === 409
          ? 'El email ya está en uso'
          : 'Error al actualizar el email';
        this.toastService.mostrar({ texto, tipoToast: 'delete' });
      },
    });
  }

  savePassword() {
    this.formSent.set(true);
    if (!this.passwordValid() || this.saving()) return;
    this.saving.set(true);
    this.usersService.changePassword({
      currentPassword: this.pwdDraft().current,
      newPassword: this.pwdDraft().next,
    }).subscribe({
      next: () => {
        this.toastService.mostrar({ texto: 'Contraseña actualizada', tipoToast: 'submit' });
        this.saving.set(false);
        this.cancelEdit();
      },
      error: (err) => {
        this.saving.set(false);
        const texto = err?.status === 400
          ? 'La contraseña actual no es correcta'
          : 'Error al actualizar la contraseña';
        this.toastService.mostrar({ texto, tipoToast: 'delete' });
      },
    });
  }
}
