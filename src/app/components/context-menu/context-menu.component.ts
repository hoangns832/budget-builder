import { Component, ElementRef, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  @Input() options: { label: string; action: () => void }[] = [];
  visible = false;
  x = 0;
  y = 0;

  constructor(private elementRef: ElementRef) {}

  open(event: MouseEvent) {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY;
    this.visible = true;
  }

  close() {
    this.visible = false;
  }

  selectOption(action: () => void) {
    action();
    this.close();
  }

  @HostListener('document:click', ['$event'])
  onClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
