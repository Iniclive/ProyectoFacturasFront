import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { UsersService } from '../../../core/services/users.service';

@Component({
  selector: 'app-user-detail-sidebar',
  imports: [MatIcon],
  templateUrl: './user-detail-sidebar.component.html',
  styleUrl: './user-detail-sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailSidebarComponent {
  readonly userId = input<string | null>(null);
  readonly onClose = output<void>();
  readonly onEdit = output<string>();

  private readonly usersService = inject(UsersService);

  readonly user = computed(() =>
    this.usersService.users().find((u) => u.idUser === this.userId()),
  );

  cerrar(): void {
    this.onClose.emit();
  }

  editar(): void {
    const id = this.userId();
    if (id) {
      this.onEdit.emit(id);
    }
  }
}
