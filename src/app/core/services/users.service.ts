import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of,  tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { UpdateEmailRequest, UpdateNameRequest, UpdatePasswordRequest, User } from '../models/user.models';
import { UserInfoCreate, UserInfoUpdate } from '../models/auth.model';
//import { ErrorService } from '../compartido/compartido/error.service';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);
  //private errorService = inject(ErrorService)
  private usersList = signal<User[]>([]);
  selectedUser = signal<User | null>(null);
  users = this.usersList.asReadonly();
  private destroyRef = inject(DestroyRef);

  //private destroyRef = inject(DestroyRef);

  loadUsers() {
    return this.httpClient.get<User[]>(ENDPOINTS.USERS).pipe(
      tap((users) => {
        this.usersList.set(users);
        this.usersList().forEach(element => {
          console.log(element);
        });
      }),
      catchError((err) => {
        console.error(err);
        //this.errorService.mostrarerror('Error al cargar lugares disponibles');
        return throwError(() => new Error('Error en API'));
      }),
    );
  }

  deleteUser(id: string) {
    const previusUsers = [...this.usersList()];
    this.usersList.update((lista) => lista.filter((u) => String(u.idUser) !== String(id)));
    return this.httpClient
      .delete(ENDPOINTS.USERS_ID(id))
      .pipe(
        catchError((err) => {
          this.usersList.set(previusUsers);
          console.log(err);
          return throwError(() => err);
        }),
      );
  }

  createUser(newUserInfo: UserInfoCreate) {
    return this.httpClient.post<User>(ENDPOINTS.USERS, newUserInfo).pipe(
      tap((newUser) => {
        this.usersList.update((lista) => [...lista, newUser]);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al crear usuario'));
      }),
    );
  }

  updateUser(userUpdated: UserInfoUpdate) {
    return this.httpClient.put<User>(ENDPOINTS.USERS,userUpdated).pipe(
      tap((updatedUser) => {
        this.usersList.update((lista) => lista.map((u) => (String(u.idUser) === String(userUpdated.idUser) ? updatedUser : u)));
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al actualizar usuario'));
      }),
    );
  }


  changePassword( request: UpdatePasswordRequest) {
    return this.httpClient.put<void>(ENDPOINTS.USERS_CHANGE_PASSWORD, request).pipe(
      catchError((err) => throwError(() => err)),
    );
  }

  changeName( request: UpdateNameRequest) {
    return this.httpClient.patch<void>(ENDPOINTS.USERS_CHANGE_NAME, request).pipe(
      catchError((err) => throwError(() => err)),
    );
  }

  changeEmail( request: UpdateEmailRequest) {
    return this.httpClient.patch<void>(ENDPOINTS.USERS_CHANGE_EMAIL, request).pipe(
      catchError((err) => throwError(() => err)),
    );
  }
}
