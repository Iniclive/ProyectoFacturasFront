import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
  DestroyRef,
  effect,
  inject,
  input,
} from '@angular/core';

@Directive({
  selector: '[disabledTooltip]',
  standalone: true,
})
export class DisabledTooltipDirective implements OnInit {
  readonly disabledTooltip = input.required<string | string[]>();
  readonly tooltipPosition = input<'top' | 'bottom'>('top');

  private tooltipEl: HTMLElement | null = null;
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      const message = this.disabledTooltip();
      const position = this.tooltipPosition();

      if (this.tooltipEl) {
        this.updateTooltipContent(message);
        this.updateTooltipPosition(position);
      }
    });
  }

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => this.hide());
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const host = this.el.nativeElement as HTMLElement;
    const isDisabled =
      host.hasAttribute('disabled') ||
      host.getAttribute('aria-disabled') === 'true';

    if (!isDisabled) return;
    this.show();
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent): void {
    const host = this.el.nativeElement as HTMLElement;
    const relatedTarget = event.relatedTarget as Node | null;

    // Si el cursor se mueve hacia el tooltip (hijo del host), no ocultamos
    if (relatedTarget && host.contains(relatedTarget)) return;

    this.hide();
  }

  private show(): void {
  if (this.tooltipEl) return;

  const tooltip: HTMLElement = this.renderer.createElement('div');
  this.renderer.addClass(tooltip, 'disabled-tooltip');
  this.renderer.addClass(tooltip, `tooltip--${this.tooltipPosition()}`);
  this.renderer.setProperty(tooltip, 'role', 'tooltip');

  this.buildTooltipContent(tooltip);

  this.renderer.appendChild(this.el.nativeElement, tooltip);
  this.tooltipEl = tooltip;
}

private updateTooltipContent(message: string | string[]): void {
  if (!this.tooltipEl) return;
  this.buildTooltipContent(this.tooltipEl);
}

  private hide(): void {
    if (!this.tooltipEl) return;
    this.renderer.removeChild(this.el.nativeElement, this.tooltipEl);
    this.tooltipEl = null;
  }


  private updateTooltipPosition(position: 'top' | 'bottom'): void {
    if (!this.tooltipEl) return;
    this.renderer.removeClass(this.tooltipEl, 'tooltip--top');
    this.renderer.removeClass(this.tooltipEl, 'tooltip--bottom');
    this.renderer.addClass(this.tooltipEl, `tooltip--${position}`);
  }

  private buildTooltipContent(tooltip: HTMLElement): void {
  // Limpiamos el contenido previo
  this.renderer.setProperty(tooltip, 'innerHTML', '');

  const messages = this.disabledTooltip();
  const lines = Array.isArray(messages) ? messages : [messages];

  if (lines.length === 1) {
    this.renderer.appendChild(
      tooltip,
      this.renderer.createText(lines[0])
    );
    return;
  }

  // Varios errores: lista con viñeta simple
  lines.forEach(msg => {
    const line: HTMLElement = this.renderer.createElement('div');
    this.renderer.addClass(line, 'tooltip-line');
    this.renderer.appendChild(line, this.renderer.createText(msg));
    this.renderer.appendChild(tooltip, line);
  });
}
}
