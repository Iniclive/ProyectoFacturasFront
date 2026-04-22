import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { BotonPropioComponent } from '../boton-propio/boton-propio.component';

@Component({
  selector: 'app-action-menu',
  standalone: true,
  imports: [BotonPropioComponent],
  templateUrl: './action-menu.component.html',
  styleUrl: './action-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionMenuComponent {
  icono = input<string>('more_vert');
  ariaLabel = input<string>('Más opciones');
  tooltip = input<string>('Más opciones');

  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private trigger = viewChild.required('trigger', { read: ElementRef });

  isOpen = signal(false);
  position = signal({ top: 0, right: 0 });

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    const el = this.trigger().nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    this.position.set({
      top: Math.round(rect.bottom + 4),
      right: Math.max(8, Math.round(window.innerWidth - rect.right)),
    });
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return;
    const target = event.target as Node | null;
    if (!target) return;
    const host = this.host.nativeElement;
    if (!host.contains(target)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isOpen()) this.close();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    if (this.isOpen()) this.close();
  }
}
