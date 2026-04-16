// auth-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';


const API_URL = environment.apiUrl;

export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // No autenticado — el authGuard ya cubre la mayoría de casos,
          // pero esto captura sesiones que expiran mid-navegación
          //router.navigate(['/login']);
          /*if (!req.url.includes(ENDPOINTS.AUTH_ME)) {
            router.navigate(['/login']);
          }*/
          break;
        case 403:
          // Autenticado pero sin permiso (tu Forbid())
          router.navigate(['/forbidden']);
          break;
      }
      return throwError(() => error);
    })
  );
};
