import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { ToastService } from '../../../core/services/toast.service';
import { UsersService } from '../users.service';
import { User } from '../user.models';
import { UserInfoCreate, UserInfoUpdate } from '../../../core/models/auth.model';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

export interface UserDialogData {
  id: string | null;
  name: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatIconModule, FormErrorComponent, BotonPropioComponent, ConfirmDirective],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.css',
})
export class UserDetailsComponent implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly dialogRef = inject(MatDialogRef<UserDetailsComponent>);
  private readonly toastService = inject(ToastService);
  readonly data = inject<UserDialogData>(MAT_DIALOG_DATA);

  showPassword = signal(false);
  isSaving = signal(false);
  formSent = signal(false);

  formData = signal({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  private name = computed(() => this.formData().name.trim());
  private email = computed(() => this.formData().email.trim());
  private password = computed(() => this.formData().password);
  readonly isEditing = computed(() => !!this.data.id);

  nameError = computed((): string => {
    if (!this.name()) return 'El nombre es obligatorio';
    return '';
  });

  emailError = computed((): string => {
    if (!this.email()) return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(this.email())) return 'Introduce un email válido';
    return '';
  });

  passwordError = computed((): string => {
    if (this.isEditing() && !this.password()) return '';
    if (!this.password()) return 'La contraseña es obligatoria';
    if (this.password().length < PASSWORD_MIN_LENGTH)
      return `Mínimo ${PASSWORD_MIN_LENGTH} caracteres`;
    return '';
  });

  confirmPasswordError = computed((): string => {
  const pass = this.password();
  const confirm = this.formData().confirmPassword;

  if (this.isEditing() && !pass) return '';
  if (!confirm) return 'Confirma la contraseña';
  if (confirm !== pass) return 'Las contraseñas no coinciden';
  return '';
});

  showNameError = computed(() => !!this.nameError() && this.formSent());
  showEmailError = computed(() => !!this.emailError() && this.formSent());
  showPasswordError = computed(() => !!this.passwordError() && this.formSent());
  showConfirmPasswordError = computed(() => !!this.confirmPasswordError() && this.formSent());

  formularioValido = computed(
    () => !this.nameError() && !this.emailError() && !this.passwordError() && !this.confirmPasswordError(),
  );

  ngOnInit(): void {
    this.formData.set({
      name: this.data.name ?? '',
      email: this.data.email ?? '',
      password: '',
      confirmPassword: '',
    });
  }

  updateField(field: 'name' | 'email' | 'password' | 'confirmPassword', value: string) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  saveUser() {
    this.formSent.set(true);
    if (!this.formularioValido()) return;

    this.isSaving.set(true);

    const payload: Partial<User> & { password?: string } = {
      name: this.name(),
      email: this.email(),
      ...(this.password() ? { password: this.password() } : {}),
    };

    if (this.isEditing()) {
      const updatedUser: UserInfoUpdate ={
        idUser: this.data.id,
        name: this.name(),
        email: this.email(),
        password: this.password(),
      }

      this.usersService.updateUser(updatedUser).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Usuario actualizado correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al actualizar el usuario', tipoToast: 'delete' });
        },
      });
    } else {

       const newUser: UserInfoCreate ={
        name: this.name(),
        email: this.email(),
        password: this.password(),
      }

      this.usersService.createUser(newUser).subscribe({
        next: () => {
          this.isSaving.set(false);
          this.dialogRef.close(true);
          this.toastService.mostrar({
            texto: 'Usuario creado correctamente',
            tipoToast: 'submit',
          });
        },
        error: () => {
          this.isSaving.set(false);
          this.toastService.mostrar({ texto: 'Error al crear el usuario', tipoToast: 'delete' });
        },
      });
    }
  }

  cancelar() {
    this.dialogRef.close(false);
  }
}
