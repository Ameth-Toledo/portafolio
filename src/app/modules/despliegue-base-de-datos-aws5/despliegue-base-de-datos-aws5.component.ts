import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { ViewportScroller } from '@angular/common';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { ComandCopyComponent } from "../../components/comand-copy/comand-copy.component";
import { ImagesComponent } from "../../components/images/images.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { RedesSocialesComponent } from "../../components/redes-sociales/redes-sociales.component";

@Component({
  selector: 'app-despliegue-base-de-datos-aws5',
  standalone: true,
  imports: [TecnologiasComponent, ComandCopyComponent, ImagesComponent, CardTecnologyComponent, RedesSocialesComponent],
  templateUrl: './despliegue-base-de-datos-aws5.component.html',
  styleUrl: './despliegue-base-de-datos-aws5.component.css'
})
export class DespliegueBaseDeDatosAws5Component {
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
    this.router.navigate(['despliegue/base-de-datos/aws']);
  }

  sendToDeployAWS2(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/bd/aws/ec2/id=7']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }

  sendToDeployAWS(event: Event) {
    event.preventDefault();
    this.router.navigate(['despliegue/bd/aws/ec2/id=5']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
