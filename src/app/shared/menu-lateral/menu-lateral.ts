import { Component, computed, inject, output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmDirective } from '../../core/directives/app-confirm.directive';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [MatIconModule, RouterLink, RouterLinkActive, ConfirmDirective],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Se emite cuando el cierre de sesión ha terminado. */
  readonly loggedOut = output<void>();

  readonly currentUser = this.authService.currentUser;
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.loggedOut.emit();
      this.router.navigate(['/login']);
    });
  }
}
