import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { ImagesComponent } from "../../components/images/images.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { ComandCopyComponent } from "../../components/comand-copy/comand-copy.component";
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-despliegue-frontend-aws-4',
  standalone: true,
  imports: [TecnologiasComponent, ImagesComponent, CardTecnologyComponent, ComandCopyComponent],
  templateUrl: './despliegue-frontend-aws-4.component.html',
  styleUrl: './despliegue-frontend-aws-4.component.css'
})
export class DespliegueFrontendAws4Component {
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
    this.router.navigate(['']);
  }

  sendToDeployAWS2(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2/id=5']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2/id=3']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
