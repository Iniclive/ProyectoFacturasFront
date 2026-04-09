import { CurrencyPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FacturasService } from '../../../core/services/facturas.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { Router } from '@angular/router';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { ToastService } from '../../../core/services/toast.service';
import { UsersService } from '../../../core/services/users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailsComponent } from '../user-details.component/user-details.component';
import { User } from '../../../core/models/user.models';

@Component({
  selector: 'app-users.component',
  imports: [MatIcon, BotonPropioComponent,ConfirmDirective],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {

  usersService = inject(UsersService);
  private readonly router = inject(Router);
  users = this.usersService.users;
  user = this.usersService.selectedUser;
  error = signal('');
  private readonly dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  showFilters = signal(false);
  searchId = signal('');
  searchEmail = signal('');
  searchName = signal('');
  searchRole = signal('');

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.usersService.loadUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
  }

  showUserDetails(id?: string) {
    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '520px',
      data: {
        id: id ?? null,
        name: id ? this.users().find((u) => u.idUser === id)?.name : '',
        email: id ? this.users().find((u) => u.idUser === id)?.email : '',
        role: id ? this.users().find((u) => u.idUser === id)?.role : 'user',
      } as unknown as User,
    });
    dialogRef.afterClosed().subscribe((resultado) => {});
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe({
      next: () =>
        this.toastService.mostrar({
          texto: 'Se ha eliminado el usuario correctamente',
          tipoToast: 'submit',
        }),
      error: () =>
        this.toastService.mostrar({
          texto: 'Error al eliminar el usuario',
          tipoToast: 'delete',
        }),
    });
  }

  filteredUsers = computed(() => {
    let result = this.users();
    const id = this.searchId().toLowerCase().trim();
    if (id) {
      result = result.filter((u) => u.idUser?.toString().toLowerCase().includes(id));
    }
    const mail = this.searchEmail().toLowerCase().trim();
    if (mail) {
      result = result.filter((u) => u.email?.toLowerCase().includes(mail));
    }
    const name = this.searchName().toLowerCase().trim();
    if (name) {
      result = result.filter((u) => u.name?.toLowerCase().includes(name));
    }

    const role = this.searchRole().toLowerCase().trim();
    if (role) {
      result = result.filter((u) => u.role?.toLowerCase().includes(role));
    }

    return result;
  });

  activeFilters = computed(() => !!this.searchName() || !!this.searchEmail() || !!this.searchRole());

  resetFilters() {
    this.searchId.set('');
    this.searchEmail.set('');
    this.searchName.set('');
    this.searchRole.set('');
  }
}
