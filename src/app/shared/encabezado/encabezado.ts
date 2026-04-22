import { Component, HostListener, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BotonPropioComponent } from "../boton-propio/boton-propio.component";
import { ConfirmDirective } from '../../core/directives/app-confirm.directive';

@Component({
  selector: 'app-encabezado',
  imports: [MatIconModule, RouterModule, BotonPropioComponent,ConfirmDirective,RouterLink],
  templateUrl: './encabezado.html',
  standalone: true,
  styleUrl: './encabezado.css',
})
export class Encabezado {
authservice = inject(AuthService);
isAutenticated = this.authservice.isAuthenticated;
currentUser = this.authservice.currentUser;
private readonly router = inject(Router);

mobileMenuOpen = signal(false);

toggleMobileMenu() {
  this.mobileMenuOpen.update(open => !open);
}

closeMobileMenu() {
  this.mobileMenuOpen.set(false);
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  if (!this.mobileMenuOpen()) return;
  const target = event.target as HTMLElement | null;
  if (!target?.closest('.mobile-menu-root')) {
    this.mobileMenuOpen.set(false);
  }
}

@HostListener('document:keydown.escape')
onEscape() {
  this.mobileMenuOpen.set(false);
}

logout() {
  this.authservice.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
