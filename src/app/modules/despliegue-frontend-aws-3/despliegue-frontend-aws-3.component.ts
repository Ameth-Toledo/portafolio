import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { ImagesComponent } from "../../components/images/images.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-despliegue-frontend-aws-3',
  standalone: true,
  imports: [TecnologiasComponent, ImagesComponent, CardTecnologyComponent],
  templateUrl: './despliegue-frontend-aws-3.component.html',
  styleUrl: './despliegue-frontend-aws-3.component.css'
})
export class DespliegueFrontendAws3Component {
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
    this.router.navigate(['despliegue/front/aws/ec2/id=4']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2/id=2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
