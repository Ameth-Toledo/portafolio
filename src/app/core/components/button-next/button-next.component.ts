import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-button-next',
  standalone: true,
  imports: [],
  templateUrl: './button-next.component.html',
  styleUrl: './button-next.component.css'
})
export class ButtonNextComponent {
  constructor (private router: Router, private viewportScroller: ViewportScroller) {}

  sendToViewMore(event: Event) {
    event.preventDefault();
    this.router.navigate(['blog']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
