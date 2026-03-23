import { APP_INITIALIZER, ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interceptors/credentials.interceptor';
import { AuthService } from './core/services/auth.service';
import { firstValueFrom } from 'rxjs';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,withComponentInputBinding()), //provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(),withInterceptors([credentialsInterceptor])),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      await firstValueFrom(authService.loadUserInfo(), { defaultValue: null });
    })
  ]
};
