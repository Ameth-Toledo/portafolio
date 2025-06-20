import { Component } from '@angular/core';

@Component({
  selector: 'app-work-section',
  standalone: true,
  imports: [],
  templateUrl: './work-section.component.html',
  styleUrl: './work-section.component.css'
})
export class WorkSectionComponent {
  sendToUnimedProyect(event: Event) {
    event.preventDefault();
    window.open('https://github.com/FabricioPRZ/UNIMED-SUCHIAPA.git', '_blank')
  }

  sendToUnimedWeb(event: Event) {
    event.preventDefault();
    window.open('https://unimed-build.vercel.app/login', '_blank')
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

  sendToApiGo(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/backend-est.git', '_blank')
  }

  sendToEstSoftware(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/Software-EST.git', '_blank')
  }

  sendToEstSoftwareWeb(event: Event) {
    event.preventDefault();
    window.open('https://est-software.vercel.app', '_blank')
  }

  sendToApiPython(event: Event) {
    event.preventDefault();
    window.open('https://github.com/Ameth-Toledo/EST-SOFTWARE-BACK.git', '_blank')
  }
}
