import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { ViewportScroller } from '@angular/common';
import { CardModuleComponent } from "../../components/card-module/card-module.component";

@Component({
  selector: 'app-despliegue-frontend',
  standalone: true,
  imports: [CardTecnologyComponent, CardModuleComponent],
  templateUrl: './despliegue-frontend.component.html',
  styleUrl: './despliegue-frontend.component.css'
})
export class DespliegueFrontendComponent {
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
}
