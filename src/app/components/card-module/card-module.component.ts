import { Component } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-card-module',
  standalone: true,
  imports: [],
  templateUrl: './card-module.component.html',
  styleUrl: './card-module.component.css'
})
export class CardModuleComponent {
  @Input() title: string = '';
  @Input() imageSrc: string = '';
  @Input() route: string = '';

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  sendToModule(event: Event) {
    event.preventDefault();
    if (this.route) {
      this.router.navigate([this.route]).then(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
    }
  }
}