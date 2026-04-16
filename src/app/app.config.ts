import {

  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';
import { authErrorInterceptor } from './interceptors/authErrorInterceptor ';
import { concurrencyErrorInterceptor } from './interceptors/concurrecyError.interceptor';
registerLocaleData(localeEs);
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding(),
    ), //provideClientHydration(withEventReplay()),
    provideHttpClient(
      withFetch(),
      withInterceptors([credentialsInterceptor, authErrorInterceptor, concurrencyErrorInterceptor]),
    ),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      await firstValueFrom(authService.loadUserInfo(), { defaultValue: null });
    }),
    { provide: LOCALE_ID, useValue: 'es-ES' }
  ],
};
