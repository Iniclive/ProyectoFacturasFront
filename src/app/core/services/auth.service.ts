import { Injectable, inject, signal } from '@angular/core';
import { UserInfoCreate, UserInfor, UserRegistered } from '../models/auth.model';
import { ENDPOINTS } from '../constants/endpoints';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
private httpClient = inject(HttpClient);
isAuthenticated = signal(false)
currentUser = signal<UserInfor | null>(null)


register(userCreate : UserInfoCreate){
  {
      return this.httpClient.post<UserRegistered>(ENDPOINTS.AUTH_REGISTRO, userCreate).pipe(
    catchError((err) => {
      // Puedes pasar el error al componente
      return throwError(() => err);
    })
  );
    }
}

}
