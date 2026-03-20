import { Component, computed, inject, signal } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { FormErrorComponent } from "../../../shared/form-error.component/form-error.component";
import { BotonPropioComponent } from "../../../shared/boton-propio/boton-propio.component";
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [MatIcon, FormErrorComponent, BotonPropioComponent,FormsModule,RouterLink],
})
export class LoginComponent {
authService = inject(AuthService);
userMail = signal('');
userPassword = signal('');
formEnviado = signal(false);
isLoginIn = signal(false);


validUser = computed(() => {
    return this.userMail().trim().length > 0;
  });
validPassword = computed(() => {
    return this.userPassword().trim().length > 0;
  });
showPasswordError= computed(() => {
    return !this.validPassword() && (this.formEnviado());
  });
showUserError = computed(() => {
    return !this.validUser() && (this.formEnviado());
  });

validForm = computed(() => this.validUser() && this.validPassword());

ngOnInit() {
  const lastEmail = localStorage.getItem('lastRegisteredEmail');
  if (lastEmail) {
    this.userMail.set(lastEmail); 
  }
}

loginSubmit() {
/*this.formEnviado.set(true);
    if (this.validForm()) {
        this.isLoginIn.set(true);
        this.authService.login(mapearAFacturaCreate(this.factura())).subscribe({
          next: () => {
            this.estaGuardando.set(false);
            this.router.navigate(['/facturas', this.factura().idFactura], { replaceUrl: true });
            this.toastService.mostrar({texto: 'Se ha creado la factura correctamente', tipoToast: 'submit'})
            console.log('Cabecera guardada, ya puedes añadir líneas.');
          },
          error: () => {
            this.estaGuardando.set(false);
           this.toastService.mostrar({texto: 'Error al crear la factura', tipoToast: 'delete'});
          },
        });
      } else {
        this.estaGuardando.set(true);
        this.facturasService.actualizarFactura(mapearAFacturaUpdate(this.factura())).subscribe({
          next: () => {
            this.estaGuardando.set(false);
            //this.toastService.showSuccess('Se ha actualizado la factura correctamente');
            console.log('Se ha actualizado la factura');
            this.toastService.mostrar({texto: 'Se ha actualizado la factura correctamente', tipoToast: 'submit'})
          },
          error: () => {
          this.estaGuardando.set(false);
           this.toastService.mostrar({texto: 'Error al actualizar la factura', tipoToast: 'delete'});
          },
        });
      }
    } else {
      console.error('Formulario inválido');
    }*/
}


}
