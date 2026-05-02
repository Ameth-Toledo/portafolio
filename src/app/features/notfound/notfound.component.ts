import { Component } from '@angular/core';
import gsap from 'gsap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  standalone: true,
  imports: [],
  templateUrl: './notfound.component.html',
  styleUrl: './notfound.component.css'
})
export class NotfoundComponent {
  constructor(private router: Router) {}

  burgerState: string = 'closed';
  navState: string = 'closed';

  ngOnInit(): void {
    this.initAnimations();
  }

  toggleMenu(): void {
    this.burgerState = this.burgerState === 'closed' ? 'open' : 'closed';
    this.navState = this.navState === 'closed' ? 'open' : 'closed';
  }

  private initAnimations(): void {
    // Mostrar SVG
    gsap.set("svg", { visibility: "visible" });
    
    // Animación de la franja de la cabeza
    gsap.to("#headStripe", {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      duration: 1
    });
    
    // Animación del astronauta
    gsap.to("#spaceman", {
      y: 0.5,
      rotation: 1,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      duration: 1
    });
    
    // Animación de cráteres pequeños
    gsap.to("#craterSmall", {
      x: -3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut"
    });
    
    // Animación de cráteres grandes
    gsap.to("#craterBig", {
      x: 3,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut"
    });
    
    // Animación del planeta
    gsap.to("#planet", {
      rotation: -2,
      yoyo: true,
      repeat: -1,
      duration: 1,
      ease: "sine.inOut",
      transformOrigin: "50% 50%"
    });

    // Animación de estrellas grandes
    gsap.to("#starsBig g", {
      rotation: "random(-30,30)",
      transformOrigin: "50% 50%",
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
    
    // Animación de estrellas pequeñas
    gsap.fromTo(
      "#starsSmall g",
      { scale: 0, transformOrigin: "50% 50%" },
      { scale: 1, transformOrigin: "50% 50%", yoyo: true, repeat: -1, stagger: 0.1 }
    );
    
    // Animación de círculos pequeños
    gsap.to("#circlesSmall circle", {
      y: -4,
      yoyo: true,
      duration: 1,
      ease: "sine.inOut",
      repeat: -1
    });
    
    // Animación de círculos grandes
    gsap.to("#circlesBig circle", {
      y: -2,
      yoyo: true,
      duration: 1,
      ease: "sine.inOut",
      repeat: -1
    });

    // Configuración inicial del brillo del vidrio
    gsap.set("#glassShine", { x: -68 });

    // Animación del brillo del vidrio
    gsap.to("#glassShine", {
      x: 80,
      duration: 2,
      rotation: -30,
      ease: "expo.inOut",
      transformOrigin: "50% 50%",
      repeat: -1,
      repeatDelay: 8,
      delay: 2
    });
  }

  sendToHome(event: Event) {
    event.preventDefault
    this.router.navigate([''])
  }
}
