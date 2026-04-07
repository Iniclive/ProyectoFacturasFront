import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BotonPropioComponent } from "../boton-propio/boton-propio.component";
import { ConfirmDirective } from '../../core/directives/app-confirm.directive';

@Component({
  selector: 'app-encabezado',
  imports: [MatIconModule, RouterModule, BotonPropioComponent,ConfirmDirective],
  templateUrl: './encabezado.html',
  standalone: true,
  styleUrl: './encabezado.css',
})
export class Encabezado {
authservice = inject(AuthService);
isAutenticated = this.authservice.isAuthenticated;
private readonly router = inject(Router);

logout() {
  this.authservice.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
