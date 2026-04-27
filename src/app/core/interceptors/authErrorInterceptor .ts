// auth-error.interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConcurrencyDialogComponent } from '../../shared/concurrency-dialog.component/concurrency-dialog.component';



const API_URL = environment.apiUrl;


export const authErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const dialog = inject(MatDialog);

  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
          case 409:
           dialog.open(ConcurrencyDialogComponent, {
           width: '400px',
                  });
      }
      return throwError(() => error);
    })
  );
};
