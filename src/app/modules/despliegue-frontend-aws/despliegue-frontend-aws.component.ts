import { Component } from '@angular/core';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { AnimationService } from '../../services/animation/animation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-despliegue-frontend-aws',
  standalone: true,
  imports: [TecnologiasComponent, CardTecnologyComponent],
  templateUrl: './despliegue-frontend-aws.component.html',
  styleUrl: './despliegue-frontend-aws.component.css'
})
export class DespliegueFrontendAwsComponent {
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
    this.router.navigate(['despliegue/front/aws/ec2/id=2'])
  }
}
