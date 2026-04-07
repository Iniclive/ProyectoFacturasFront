import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of,  tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { User } from '../models/user.models';
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

  createUser(userData: Partial<User>) {
    return this.httpClient.post<User>(ENDPOINTS.USERS, userData).pipe(
      tap((newUser) => {
        this.usersList.update((lista) => [...lista, newUser]);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al crear usuario'));
      }),
    );
  }

  updateUser(id: string, userData: Partial<User>) {
    return this.httpClient.put<User>(ENDPOINTS.USERS_ID(id), userData).pipe(
      tap((updatedUser) => {
        this.usersList.update((lista) => lista.map((u) => (String(u.idUser) === String(id) ? updatedUser : u)));
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al actualizar usuario'));
      }),
    );
  }
}
