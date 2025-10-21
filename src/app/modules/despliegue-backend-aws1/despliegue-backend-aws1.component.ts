import { Component } from '@angular/core';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { ImagesComponent } from "../../components/images/images.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { ViewportScroller } from '@angular/common';
import { ComandCopyComponent } from "../../components/comand-copy/comand-copy.component";

@Component({
  selector: 'app-despliegue-backend-aws1',
  standalone: true,
  imports: [TecnologiasComponent, ImagesComponent, CardTecnologyComponent, ComandCopyComponent],
  templateUrl: './despliegue-backend-aws1.component.html',
  styleUrl: './despliegue-backend-aws1.component.css'
})
export class DespliegueBackendAws1Component {
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
    this.router.navigate(['despliegue/backend/aws/ec2/id=3']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/backend/aws/ec2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
