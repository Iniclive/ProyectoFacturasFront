import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { DashboardSummary } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private httpClient = inject(HttpClient);

  private _summary = signal<DashboardSummary | null>(null);
  summary = this._summary.asReadonly();

  cargarResumen() {
    return this.httpClient.get<DashboardSummary>(ENDPOINTS.DASHBOARD).pipe(
      tap((data) => this._summary.set(data)),
      catchError((err) => {
        this._summary.set(null);
        return throwError(() => err);
      }),
    );
  }
}
