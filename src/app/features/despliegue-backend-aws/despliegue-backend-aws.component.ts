import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { AnimationService } from '../../core/services/animation/animation.service';
import { ImagesComponent } from '../../core/components/images/images.component';
import { TecnologiasComponent } from '../../core/components/tecnologias/tecnologias.component';
import { CardTecnologyComponent } from '../../core/components/card-tecnology/card-tecnology.component';

@Component({
  selector: 'app-despliegue-backend-aws',
  standalone: true,
  imports: [ImagesComponent, TecnologiasComponent, CardTecnologyComponent],
  templateUrl: './despliegue-backend-aws.component.html',
  styleUrl: './despliegue-backend-aws.component.css'
})
export class DespliegueBackendAwsComponent {
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
    this.router.navigate(['despliegue/backend/aws/ec2/id=2']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
