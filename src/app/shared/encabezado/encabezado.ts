import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmDirective } from '../../core/directives/app-confirm.directive';

@Component({
  selector: 'app-encabezado',
  imports: [MatIconModule, RouterModule,ConfirmDirective,RouterLink],
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
userMenuOpen = signal(false);

userInitial = computed(() => {
  const name = this.currentUser()?.name ?? '';
  return name.charAt(0).toUpperCase() || '?';
});

toggleMobileMenu() {
  this.mobileMenuOpen.update(open => !open);
  if (this.mobileMenuOpen()) this.userMenuOpen.set(false);
}

closeMobileMenu() {
  this.mobileMenuOpen.set(false);
}

toggleUserMenu() {
  this.userMenuOpen.update(open => !open);
  if (this.userMenuOpen()) this.mobileMenuOpen.set(false);
}

closeUserMenu() {
  this.userMenuOpen.set(false);
}

goToProfile() {
  this.closeUserMenu();
  this.router.navigate(['/perfil']);
}

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent) {
  const target = event.target as HTMLElement | null;
  if (this.mobileMenuOpen() && !target?.closest('.mobile-menu-root')) {
    this.mobileMenuOpen.set(false);
  }
  if (this.userMenuOpen() && !target?.closest('.user-menu-root')) {
    this.userMenuOpen.set(false);
  }
}

@HostListener('document:keydown.escape')
onEscape() {
  this.mobileMenuOpen.set(false);
  this.userMenuOpen.set(false);
}

logout() {
  this.closeUserMenu();
  this.authservice.logout().subscribe(() => {
    this.router.navigate(['/login']);
  });
}
}
