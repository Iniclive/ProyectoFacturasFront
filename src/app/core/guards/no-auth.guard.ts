import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { inject } from "@angular/core";
import { map } from "rxjs";

export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ noAuthGuard ejecutado - isAuthenticated:', authService.isAuthenticated());

  return authService.verifySession().pipe(
    map(authenticated => {
      console.log('🛡️ noAuthGuard resultado:', authenticated);
      return authenticated ? router.createUrlTree(['/facturas']) : true;
    })
  );
};
