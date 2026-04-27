import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { BotonPropioComponent } from '../../../shared/boton-propio/boton-propio.component';
import { ConfirmDirective } from '../../../core/directives/app-confirm.directive';
import { UsersService } from '../users.service';
import { ToastService } from '../../../core/services/toast.service';
import { UserDetailsComponent } from '../user-details.component/user-details.component';
import { User } from '../user.models';
import { DataTableComponent } from '../../../shared/data-table/data-table.component';
import { ColumnDef, FilterDef } from '../../../shared/data-table/data-table.types';
import { UserDetailSidebarComponent } from '../user-detail-sidebar/user-detail-sidebar';

@Component({
  selector: 'app-users.component',
  imports: [
    MatIcon,
    BotonPropioComponent,
    ConfirmDirective,
    DataTableComponent,
    UserDetailSidebarComponent,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly users = this.usersService.users;
  readonly error = signal('');

  readonly sidebarOpen = signal(false);
  readonly selectedUserId = signal<string | null>(null);

  readonly columns: ColumnDef<User>[] = [
    { key: 'idUser', label: 'ID Usuario', sortable: true, cssClass: 'bold' },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Rol', sortable: true },
  ];

  readonly filters: FilterDef[] = [
    { kind: 'text', key: 'idUser', label: 'ID Usuario', icon: 'tag', placeholder: 'Ej: 1234' },
    { kind: 'text', key: 'name', label: 'Nombre', icon: 'person', placeholder: 'Nombre usuario...' },
    { kind: 'text', key: 'email', label: 'Email', icon: 'email', placeholder: 'Email usuario...' },
    {
      kind: 'text',
      key: 'role',
      label: 'Rol',
      icon: 'admin_panel_settings',
      placeholder: 'Rol usuario...',
    },
  ];

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.usersService.loadUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({});
  }

  showUserDetails(id?: string) {
    this.dialog.open(UserDetailsComponent, {
      width: '520px',
      data: {
        id: id ?? null,
        name: id ? this.users().find((u) => u.idUser === id)?.name : '',
        email: id ? this.users().find((u) => u.idUser === id)?.email : '',
        role: id ? this.users().find((u) => u.idUser === id)?.role : 'user',
      } as unknown as User,
    });
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

  abrirDetalle(user: User): void {
    this.selectedUserId.set(user.idUser);
    this.sidebarOpen.set(true);
  }

  cerrarSidebar(): void {
    this.sidebarOpen.set(false);
  }

  editarDesdeSidebar(id: string): void {
    this.sidebarOpen.set(false);
    this.showUserDetails(id);
  }
}
