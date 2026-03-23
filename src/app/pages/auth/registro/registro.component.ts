import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { UserInfoCreate } from '../../../core/models/auth.model';
import { StorageService } from '../../../core/services/storage.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;
const MIN_USERNAME_LENGTH = 3;

@Component({
  selector: 'app-registro',
  standalone: true,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, RouterLink],
})
export class RegistroComponent {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  // Estado del formulario agrupado
  formData = signal<UserInfoCreate>({ name: '', email: '', password: '' });
  confirmPassword = signal('');
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  formEnviado = signal(false);
  isRegistering = signal(false);

  private name     = computed(() => this.formData().name.trim());
  private email    = computed(() => this.formData().email.trim());
  private password = computed(() => this.formData().password);

  // Mensajes de error por campo (vacío = válido)
  nameError = computed((): string => {
    if (!this.name()) return 'El nombre de usuario es obligatorio';
    if(this.name().length < MIN_USERNAME_LENGTH) return 'El nombre de usuario debe tener al menos 3 caracteres';
    return '';
  });

  emailError = computed((): string => {
    if (!this.email())                        return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(this.email()))      return 'Introduce un email válido';
    return '';
  });

  passwordError = computed((): string => {
    if (!this.password())                                    return 'La contraseña es obligatoria';
    if (this.password().length < MIN_PASSWORD_LENGTH)        return `Mínimo ${MIN_PASSWORD_LENGTH} caracteres`;
    return '';
  });

  confirmPasswordError = computed((): string => {
  if (!this.confirmPassword())                              return 'Confirma tu contraseña';
  if (this.confirmPassword() !== this.formData().password) return 'Las contraseñas no coinciden';
  return '';
});

  // Mostrar error solo si el formulario fue enviado
  showNameError     = computed(() => !!this.nameError()     && this.formEnviado());
  showMailError     = computed(() => !!this.emailError()    && this.formEnviado());
  showPasswordError = computed(() => !!this.passwordError() && this.formEnviado());
  showConfirmPasswordError = computed(() => !!this.confirmPasswordError() && this.formEnviado());

  validForm = computed(() => !this.nameError() && !this.emailError() && !this.passwordError() && !this.confirmPasswordError());

  // Actualizador genérico del formulario
  updateField(field: keyof UserInfoCreate, value: string) {
    this.formData.update(data => ({ ...data, [field]: value }));
  }

  registerSubmit() {
    this.formEnviado.set(true);
    if (!this.validForm()) return;

    this.isRegistering.set(true);
    this.authService.register(this.formData()).subscribe({
      next: (newUser) => {
        this.isRegistering.set(false);
        this.storageService.setItem('lastRegisteredEmail', newUser.email);
        this.router.navigate(['/login']);
        this.toastService.mostrar({
          texto: `Se ha registrado el usuario ${newUser.name} correctamente`,
          tipoToast: 'submit',
        });
      },
      error: (err) => {
        this.isRegistering.set(false);
        this.toastService.mostrar({
          texto: err.status === 400 ? 'Este email ya está en uso.' : 'Error al registrar el usuario',
          tipoToast: 'delete',
        });
      },
    });
  }
}
