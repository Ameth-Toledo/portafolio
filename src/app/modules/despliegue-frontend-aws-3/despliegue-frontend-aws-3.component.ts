import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { ImagesComponent } from "../../components/images/images.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";

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
    private animationService: AnimationService
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
    this.router.navigate(['despliegue/front/aws/ec2/id=4'])
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/front/aws/ec2/id=2'])
  }
}
