import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../core/services/animation/animation.service';
import { ViewportScroller } from '@angular/common';
import { CardTecnologyComponent } from '../../core/components/card-tecnology/card-tecnology.component';
import { ImagesComponent } from '../../core/components/images/images.component';
import { TecnologiasComponent } from '../../core/components/tecnologias/tecnologias.component';
import { ComandCopyComponent } from '../../core/components/comand-copy/comand-copy.component';

@Component({
  selector: 'app-despliegue-backend-aws7',
  standalone: true,
  imports: [CardTecnologyComponent, ImagesComponent, TecnologiasComponent, ComandCopyComponent],
  templateUrl: './despliegue-backend-aws7.component.html',
  styleUrl: './despliegue-backend-aws7.component.css'
})
export class DespliegueBackendAws7Component {
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
    this.router.navigate(['depliegue/backend/aws']);
  }

  sendToDeployAWS2(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/backend/aws/ec2/id=9']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/backend/aws/ec2/id=7']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
