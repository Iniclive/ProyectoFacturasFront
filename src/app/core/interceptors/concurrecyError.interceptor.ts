import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { MatDialog } from '@angular/material/dialog';
import { ConcurrencyDialogComponent } from '../../shared/concurrency-dialog.component/concurrency-dialog.component';



const API_URL = environment.apiUrl;

export const concurrencyErrorInterceptor: HttpInterceptorFn = (req, next) => {
const dialog = inject(MatDialog);

  if (!req.url.startsWith(API_URL)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
        if (error.status === 415) {
          // Autenticado pero sin permiso (tu Forbid())
          dialog.open(ConcurrencyDialogComponent, {
          width: '400px',
        });
      }
      return throwError(() => error);
    })
  );
};
