import { Component, Input } from '@angular/core';

@Component({
  selector: 'svg-NPM',
  standalone: true,
  template: `
    <svg viewBox="0 0 2500 2500" [attr.width]="size.width" [attr.height]="size.height"><path fill="#c00" d="M0 0h2500v2500H0z"/><path fill="#fff" d="M1241.5 268.5h-973v1962.9h972.9V763.5h495v1467.9h495V268.5z"/></svg>
  `,
})
export class NPMComponent {
  @Input({ required: true }) size!: { width: number; height: number };
}
