import { Injectable, computed, inject, signal } from '@angular/core';
import {
  AuthResponse,
  LoginRequest,
  UserInfoCreate,
  UserInfor,
  UserRegistered,
} from '../models/auth.model';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpClient } from '@angular/common/http';
import { catchError, defaultIfEmpty, EMPTY, map, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  currentUser = signal<UserInfor | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  register(userCreate: UserInfoCreate) {
    {
      return this.httpClient.post<UserRegistered>(ENDPOINTS.AUTH_REGISTRO, userCreate).pipe(
        catchError((err) => {
          return throwError(() => err);
        }),
      );
    }
  }

  login(userLogin: LoginRequest) {
    {
      return this.httpClient.post<UserInfor>(ENDPOINTS.AUTH_LOGIN, userLogin).pipe(
         tap(userInfo => this.currentUser.set(userInfo)),
        catchError((err) => {
          return throwError(() => err);
        }),
      );
    }
  }

  logout() {
    return this.httpClient.post(ENDPOINTS.AUTH_LOGOUT, {}).pipe(
      tap(() => this.currentUser.set(null))
    );
  }
  
  loadUserInfo() {
  console.log('🔄 loadUserInfo llamado');
  return this.httpClient.get<UserInfor>(ENDPOINTS.AUTH_ME).pipe(
    tap(userInfo => {
      this.currentUser.set(userInfo);
    }),
    catchError((err) => {
      this.currentUser.set(null);
      return EMPTY;
    })
  );
}

verifySession(): Observable<boolean> {
  if (this.isAuthenticated()) return of(true);
  return this.loadUserInfo().pipe(
    map(() => true),
    defaultIfEmpty(false)
  );
}



}
