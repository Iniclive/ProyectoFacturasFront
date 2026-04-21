import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, throwError } from 'rxjs';
import { ENDPOINTS } from '../constants/endpoints';
import { Client, ClientCreate, ClientUpdate } from '../models/client.models';
import { DEFAULT_CLIENT } from '../constants/client.constants';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private httpClient = inject(HttpClient);
  private clientsList = signal<Client[]>([]);
  selectedClient = signal<Client>(DEFAULT_CLIENT);
  clients = this.clientsList.asReadonly();


  loadClients() {
    return this.httpClient.get<Client[]>(ENDPOINTS.CLIENTS).pipe(
      tap((clients) => {
        this.clientsList.set(clients);
        this.clientsList().forEach(element => {
          console.log(element);
        });
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
    );
  }


  createClient(newClient: ClientCreate) {
    return this.httpClient.post<Client>(ENDPOINTS.CLIENTS, newClient).pipe(
      tap((newClient) => {
        this.clientsList.update((lista) => [...lista, newClient]);
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al crear cliente'));
      }),
    );
  }

  updateClient(clientUpdated: ClientUpdate) {
    return this.httpClient.put<Client>(ENDPOINTS.CLIENTS, clientUpdated).pipe(
      tap((updatedClient) => {
        this.clientsList.update((lista) => lista.map((c) => (String(c.clientId) === String(clientUpdated.clientId) ? updatedClient : c)));
      }),
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error al actualizar cliente'));
      }),
    );
  }

  deleteClient(id: string) {
    const previusClients = [...this.clientsList()];
    this.clientsList.update((lista) => lista.filter((u) => String(u.clientId) !== String(id)));
    console.log('Eliminando cliente con id:', id);
    return this.httpClient
      .delete(ENDPOINTS.CLIENTS_ID(id))
      .pipe(
        catchError((err) => {
          this.clientsList.set(previusClients);
          console.log(err);
          return throwError(() => err);
        }),
      );
  }
  loadCurrentClientInfoById(id : string|null){
    if(id && id !== ''){
      this.selectedClient.set(this.clientsList().find((c) => String(c.clientId) === String(id)) || DEFAULT_CLIENT);
    }
    else{
      this.selectedClient.set({ ...DEFAULT_CLIENT });
    }
  }
  getClientDetails(id : string){
    return this.httpClient.get<Client>(ENDPOINTS.CLIENTS_ID(id)).pipe(
      catchError((err) => {
        console.error(err);
        return throwError(() => new Error('Error en API'));
      }),
    )
  }

  updateCurrentClient(cambios: Partial<Client>) {
      this.selectedClient.update((c) => ({ ...c, ...cambios } as Client));
    }

}
