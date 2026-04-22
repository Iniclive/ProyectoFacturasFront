import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { Encabezado } from './shared/encabezado/encabezado';
import { MenuLateral } from './shared/menu-lateral/menu-lateral';
import { LoadingComponent } from './shared/loading-component/loading-component';
import { FooterComponent } from './shared/footer/footer.component';
import { LoadingService } from './core/services/loading.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, MenuLateral, LoadingComponent, FooterComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
  host: {
    '[class.with-side-nav]': 'isAuthenticated()',
  },
})
export class App {
  private router = inject(Router);
  private loading = inject(LoadingService);
  private authService = inject(AuthService);

  readonly isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        this.loading.show();
      } else if (
        evt instanceof NavigationEnd ||
        evt instanceof NavigationCancel ||
        evt instanceof NavigationError
      ) {
        this.loading.hide();
      }
    });
  }
}
