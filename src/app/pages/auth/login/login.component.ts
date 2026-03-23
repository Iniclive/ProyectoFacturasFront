import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { FormErrorComponent } from '../../../shared/form-error.component/form-error.component';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LoginRequest } from '../../../core/models/auth.model';
import { ToastService } from '../../../core/services/toast.service';
import { StorageService } from '../../../core/services/storage.service';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent, FormsModule, RouterLink],
})
export class LoginComponent {
  authService = inject(AuthService);
  private toastService = inject(ToastService);
  private storageService = inject(StorageService);
  private router = inject(Router);

  formData = signal<LoginRequest>({ email: '', password: '' });
  private email = computed(() => this.formData().email.trim());
  private password = computed(() => this.formData().password);
  formEnviado = signal(false);
  isLoginIn = signal(false);
  showPassword = signal(false);

  emailError = computed((): string => {
    if (!this.email()) return 'El email es obligatorio';
    if (!EMAIL_REGEX.test(this.email())) return 'Introduce un email válido';
    return '';
  });

  passwordError = computed((): string => {
    if (!this.password()) return 'La contraseña es obligatoria';
    return '';
  });

  showMailError = computed(() => !!this.emailError() && this.formEnviado());
  showPasswordError = computed(() => !!this.passwordError() && this.formEnviado());
  validForm = computed(() => !this.emailError() && !this.passwordError());

  updateField(field: keyof LoginRequest, value: string) {
    this.formData.update((data) => ({ ...data, [field]: value }));
  }

  ngOnInit() {
   const lastEmail = this.storageService.getItem('lastRegisteredEmail')
    if (lastEmail) {
      this.updateField('email', lastEmail);
    }
  }

  loginSubmit() {
    this.formEnviado.set(true);
    if (this.validForm()) {
      this.isLoginIn.set(true);
      this.authService.login(this.formData()).subscribe({
        next: () => {
          this.isLoginIn.set(false);
          this.storageService.setItem('lastRegisteredEmail', this.formData().email);
          this.router.navigate(['/facturas'], { replaceUrl: true });
          this.toastService.mostrar({
            texto: 'Usuario logeado correctamente',
            tipoToast: 'submit',
          });
          console.log('Login exitoso');
        },
        error: () => {
          this.isLoginIn.set(false);
          this.toastService.mostrar({ texto: 'Error al iniciar sesión', tipoToast: 'delete' });
        },
      });
    } else {
      this.toastService.mostrar({ texto: 'Formulario no valido', tipoToast: 'delete' });
    }
  }
}
