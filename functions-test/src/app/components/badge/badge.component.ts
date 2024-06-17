import { Component, Input } from '@angular/core';

type BadgeTypes = 'success' | 'error' | 'warning' | 'info' | undefined;

@Component({
  selector: 'app-badge',
  template: `
    <span class="inline-flex items-center gap-x-2 rounded-md px-3 py-1 text-sm font-medium" [ngClass]="typeClasses()">
      <ng-content></ng-content>
    </span>
  `,
  styles: [
    `
      :host {
        display: inline-block;
      }
    `,
  ],
})
export class BadgeComponent {
  @Input() type: BadgeTypes;

  typeClasses() {
    switch (this.type) {
      case 'success':
        return 'bg-success-500/20 text-success-500';

      case 'error':
        return 'bg-error-500/20 text-error-500';

      case 'warning':
        return 'bg-alert-500/20 text-alert-500';

      case 'info':
        return 'bg-primary-500/20 text-primary-500';

      default:
        return 'bg-slate-200 text-slate-500';
    }
  }
}
