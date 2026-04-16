import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterOutlet,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Encabezado } from './shared/encabezado/encabezado';
import { LoadingComponent } from './shared/loading-component/loading-component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Encabezado, LoadingComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private loading = inject(LoadingService);

  private routerUrl = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map((e) => (e as NavigationEnd).urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

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
