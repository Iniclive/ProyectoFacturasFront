import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../shared/boton-propio/boton-propio.component';
import { AuthService } from '../../core/services/auth.service';
import { UsersService } from '../../core/services/users.service';
import { ToastService } from '../../core/services/toast.service';
import { UserInfoUpdate } from '../../core/models/auth.model';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 6;

type EditableCard = 'name' | 'email' | 'password';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, MatIconModule, BotonPropioComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly usersService = inject(UsersService);
  private readonly toastService = inject(ToastService);

  readonly currentUser = this.authService.currentUser;

  readonly editingCard = signal<EditableCard | null>(null);
  readonly saving = signal(false);
  readonly formSent = signal(false);

  readonly nameDraft = signal('');
  readonly emailDraft = signal('');
  readonly currentPwd = signal('');
  readonly newPwd = signal('');
  readonly confirmPwd = signal('');

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

  readonly currentPwdError = computed((): string => {
    if (!this.currentPwd()) return 'Introduce la contraseña actual';
    return '';
  });

  readonly newPwdError = computed((): string => {
    const v = this.newPwd();
    if (!v) return 'La nueva contraseña es obligatoria';
    if (v.length < PASSWORD_MIN_LENGTH) return `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`;
    return '';
  });

  readonly confirmPwdError = computed((): string => {
    if (!this.confirmPwd()) return 'Confirma la nueva contraseña';
    if (this.confirmPwd() !== this.newPwd()) return 'Las contraseñas no coinciden';
    return '';
  });

  readonly showNameError = computed(() => !!this.nameError() && this.formSent());
  readonly showEmailError = computed(() => !!this.emailError() && this.formSent());
  readonly showCurrentPwdError = computed(() => !!this.currentPwdError() && this.formSent());
  readonly showNewPwdError = computed(() => !!this.newPwdError() && this.formSent());
  readonly showConfirmPwdError = computed(() => !!this.confirmPwdError() && this.formSent());

  readonly nameValid = computed(() => !this.nameError());
  readonly emailValid = computed(() => !this.emailError());
  readonly passwordValid = computed(
    () => !this.currentPwdError() && !this.newPwdError() && !this.confirmPwdError(),
  );

  startEdit(card: EditableCard) {
    const user = this.currentUser();
    this.formSent.set(false);
    this.nameDraft.set(user?.name ?? '');
    this.emailDraft.set(user?.email ?? '');
    this.currentPwd.set('');
    this.newPwd.set('');
    this.confirmPwd.set('');
    this.editingCard.set(card);
  }

  cancelEdit() {
    this.editingCard.set(null);
    this.formSent.set(false);
    this.currentPwd.set('');
    this.newPwd.set('');
    this.confirmPwd.set('');
  }

  saveName() {
    this.formSent.set(true);
    if (!this.nameValid() || this.saving()) return;

    const user = this.currentUser();
    if (!user) return;

    const newName = this.nameDraft().trim();
    const payload: UserInfoUpdate = {
      idUser: user.id,
      name: newName,
      email: user.email,
    };

    this.saving.set(true);
    this.usersService.updateUser(payload).subscribe({
      next: () => {
        this.authService.currentUser.update((u) => (u ? { ...u, name: newName } : u));
        this.toastService.mostrar({ texto: 'Nombre actualizado', tipoToast: 'submit' });
        this.saving.set(false);
        this.cancelEdit();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.mostrar({
          texto: 'Error al actualizar el nombre',
          tipoToast: 'delete',
        });
      },
    });
  }

  saveEmail() {
    this.formSent.set(true);
    if (!this.emailValid() || this.saving()) return;

    const user = this.currentUser();
    if (!user) return;

    const newEmail = this.emailDraft().trim();
    const payload: UserInfoUpdate = {
      idUser: user.id,
      name: user.name,
      email: newEmail,
    };

    this.saving.set(true);
    this.usersService.updateUser(payload).subscribe({
      next: () => {
        this.authService.currentUser.update((u) => (u ? { ...u, email: newEmail } : u));
        this.toastService.mostrar({ texto: 'Email actualizado', tipoToast: 'submit' });
        this.saving.set(false);
        this.cancelEdit();
      },
      error: () => {
        this.saving.set(false);
        this.toastService.mostrar({
          texto: 'Error al actualizar el email',
          tipoToast: 'delete',
        });
      },
    });
  }

  savePassword() {
    this.formSent.set(true);
    if (!this.passwordValid() || this.saving()) return;

    this.saving.set(true);
    this.usersService
      .changePassword({
        currentPassword: this.currentPwd(),
        newPassword: this.newPwd(),
      })
      .subscribe({
        next: () => {
          this.toastService.mostrar({
            texto: 'Contraseña actualizada',
            tipoToast: 'submit',
          });
          this.saving.set(false);
          this.cancelEdit();
        },
        error: (err) => {
          this.saving.set(false);
          const texto =
            err?.status === 400
              ? 'La contraseña actual no es correcta'
              : 'Error al actualizar la contraseña';
          this.toastService.mostrar({ texto, tipoToast: 'delete' });
        },
      });
  }
}
