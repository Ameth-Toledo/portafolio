import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor (private router : Router) {}

  sendToGoodPracticesFront(event: Event) {
    event.preventDefault();
    this.router.navigate(['buenas/practicas/de/front'])
  }

  sendToWhenToUseFramewors(event: Event) {
    event.preventDefault();
    this.router.navigate(['cuando/usar/react/y/cuando/angular'])
  }

  sendToGoodPracticesUiUx(event: Event) {
    event.preventDefault();
    this.router.navigate(['buenas/practicas/ui/ux'])
  }

  sendToArquitectureHexagonal(event: Event) {
    event.preventDefault();
    this.router.navigate(['arquitectura/hexagonal'])
  }

  sendToPoo(event: Event) {
    event.preventDefault();
    this.router.navigate(['programacion/orientada/a/objetos'])
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2'])
  }
}
