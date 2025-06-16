import { Injectable, OnDestroy } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class AnimationService implements OnDestroy {
  private animations: gsap.core.Tween[] = [];
  private scrollTriggers: ScrollTrigger[] = [];

  constructor() { 
    gsap.registerPlugin(ScrollTrigger);
  }

  ngOnDestroy() {
    this.animations.forEach(anim => anim.kill());
    this.scrollTriggers.forEach(st => st.kill());
  }

  initAnimations() {
    this.animateWelcomeSection();
    this.animateTechCards();
    this.animateCodeExamples();
    this.setupButtonAnimation();
  }

  private animateWelcomeSection() {
    const titleAnim = gsap.from('.title-front', {
      duration: 1.5,
      y: 50,
      opacity: 0,
      ease: 'power3.out',
      delay: 0.3
    });

    const descAnim = gsap.from('.frontend-description', {
      duration: 1.2,
      y: 30,
      opacity: 0,
      ease: 'power2.out',
      delay: 0.6
    });

    const buttonAnim = gsap.from('.button', {
      duration: 1,
      rotation: -90,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: 0.1
    });

    this.animations.push(titleAnim, descAnim, buttonAnim);
  }

  private animateTechCards() {
    const cardsAnim = gsap.from('.tech-cards-container app-card-tecnology', {
      duration: 1,
      y: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'elastic.out(1, 0.5)',
      delay: 1.2,
      onComplete: () => this.setupCardHoverEffects()
    });

    this.animations.push(cardsAnim);
  }

  private animateCodeExamples() {
    const tipTrigger = ScrollTrigger.create({
      trigger: '.code-examples-container',
      start: 'top 80%',
      animation: gsap.from('.tip', {
        duration: 0.8,
        x: -50,
        opacity: 0,
        ease: 'power2.out'
      })
    });

    const subtitleTrigger = ScrollTrigger.create({
      trigger: '.subtitle-buenas-practicas-frontend',
      start: 'top 75%',
      animation: gsap.from('.subtitle-buenas-practicas-frontend', {
        duration: 1,
        y: 30,
        opacity: 0,
        ease: 'power2.out'
      })
    });

    const cardsTrigger = ScrollTrigger.create({
      trigger: '.card-row',
      start: 'top 70%',
      animation: gsap.from('.card-row app-card-editor-code', {
        duration: 1,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'back.out(1.7)'
      })
    });

    this.scrollTriggers.push(tipTrigger, subtitleTrigger, cardsTrigger);
  }

  private setupButtonAnimation() {
    const button = document.querySelector('.button');
    
    // Animación de hover
    button?.addEventListener('mouseenter', () => {
      gsap.to(button, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    button?.addEventListener('mouseleave', () => {
      gsap.to(button, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    // Animación de clic
    button?.addEventListener('click', () => {
      gsap.to(button, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      });
    });
  }

  private setupCardHoverEffects() {
    const cards = document.querySelectorAll('.tech-cards-container app-card-tecnology');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
  }
}