import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { ButtonNextComponent } from "../button-next/button-next.component";

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ButtonNextComponent],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor (
    private router : Router,
    private viewportScroller: ViewportScroller) {}

  sendToGoodPracticesFront(event: Event) {
    event.preventDefault();
    this.router.navigate(['buenas/practicas/de/front']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToWhenToUseFramewors(event: Event) {
    event.preventDefault();
    this.router.navigate(['cuando/usar/react/y/cuando/angular']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToGoodPracticesUiUx(event: Event) {
    event.preventDefault();
    this.router.navigate(['buenas/practicas/ui/ux']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToArquitectureHexagonal(event: Event) {
    event.preventDefault();
    this.router.navigate(['arquitectura/hexagonal']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToBD(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/bd/aws/ec2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
