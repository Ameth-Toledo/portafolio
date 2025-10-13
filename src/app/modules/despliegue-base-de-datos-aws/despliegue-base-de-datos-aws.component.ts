import { Component } from '@angular/core';
import { AnimationService } from '../../services/animation/animation.service';
import { ViewportScroller } from '@angular/common';
import { Router } from '@angular/router';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { ImagesComponent } from "../../components/images/images.component";
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";

@Component({
  selector: 'app-despliegue-base-de-datos-aws',
  standalone: true,
  imports: [CardTecnologyComponent, ImagesComponent, TecnologiasComponent],
  templateUrl: './despliegue-base-de-datos-aws.component.html',
  styleUrl: './despliegue-base-de-datos-aws.component.css'
})
export class DespliegueBaseDeDatosAwsComponent {
  constructor(
    private router: Router,
    private animationService: AnimationService,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit() {
    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  ngOnDestroy(): void { }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  sendToDeployAWS2(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/bd/aws/ec2/id=2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/bd/aws/ec2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
