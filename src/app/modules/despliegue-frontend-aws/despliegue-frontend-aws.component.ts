import { Component } from '@angular/core';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { AnimationService } from '../../services/animation/animation.service';
import { Router } from '@angular/router';
import { ImagesComponent } from "../../components/images/images.component";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-despliegue-frontend-aws',
  standalone: true,
  imports: [TecnologiasComponent, CardTecnologyComponent, ImagesComponent],
  templateUrl: './despliegue-frontend-aws.component.html',
  styleUrl: './despliegue-frontend-aws.component.css'
})
export class DespliegueFrontendAwsComponent {
  constructor (
    private router : Router,
    private animationService: AnimationService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  ngOnDestroy(): void {}

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/frontend/aws']);
  }

  sendToDeployAWS2(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2/id=2']).then(() => {
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
