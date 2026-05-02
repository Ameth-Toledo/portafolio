import { Component } from '@angular/core';
import { NPMComponent } from '../svg-npm/svg-npm.component';
import { Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-work-section',
  standalone: true,
  imports: [NPMComponent],
  templateUrl: './work-section.component.html',
  styleUrl: './work-section.component.css'
})
export class WorkSectionComponent {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {}

  sendToAtoCoreInitRepo(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/ato-core-init.git', '_blank')
  }

  sendToFreeGarden(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/FreeGardenFront.git', '_blank')
  }

  sendToLittlePaws(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/Proyecto-LittlePaws.git', '_blank')
  }
 
  sendToLittlePawsWeb(event: Event) {
    event.preventDefault();
    window.open('https://ameth-toledo.github.io/prueba', '_blank')
  }

  sendToFermESTRepo(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/fermest.git', '_blank')
  }

  sendToFermESTWeb(event: Event) {
    event.preventDefault();
    window.open('https://fermest-three.vercel.app/', '_blank')
  }

  sendToEstSoftware(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/Software-EST.git', '_blank')
  }

  sendToEstSoftwareWeb(event: Event) {
    event.preventDefault();
    window.open('https://est-software-eta.vercel.app', '_blank')
  }

  sendToNichKaRepo(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/fermest_web.git', '_blank')
  }

  sendToNichKaWeb(event: Event) {
    event.preventDefault();
    window.open('https://www.nich-ka.space/', '_blank')
  }

  sendToNpmPackage(event: Event) {
    event.preventDefault();
    window.open('https://www.npmjs.com/package/ato-core-init', '_blank')
  }

  sendToNpmPackageAtoCoreInit(event: Event) {
    event.preventDefault();
    this.router.navigate(['ato/detail']).then(() => {
      this.viewportScroller.scrollToPosition([0, 0]);
    });
  }
}
