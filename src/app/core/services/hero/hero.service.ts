import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  constructor() {
    gsap.registerPlugin(ScrollTrigger);
  }

  initAnimations(): void {
    this.animateTitle();
    this.animateHeroContent();
    this.animateProfileImage();
    this.animateBadges();
    this.animateStats();
    this.animateSocialSidebar();
    this.animateButtons();
    this.setupScrollAnimations();
  }

  private animateTitle(): void {
    const title: HTMLElement | null = document.querySelector('.main-section__name');
    if (title) {
        // Guardamos el contenido original
        const originalContent = title.innerHTML;
        
        // Limpiamos el título
        title.textContent = '';
        
        // Creamos contenedores para cada línea
        const lines = originalContent.split('<br>');
        
        lines.forEach((line, lineIndex) => {
            const lineContainer = document.createElement('div');
            lineContainer.style.display = 'block';
            
            // Animamos cada línea completa en lugar de cada letra
            gsap.from(lineContainer, {
                duration: 0.8,
                y: -30,
                opacity: 0,
                rotation: -5,
                ease: 'back.out(1.7)',
                delay: 0.3 * lineIndex
            });
            
            lineContainer.innerHTML = line;
            title.appendChild(lineContainer);
      });
    }
  }

  private animateHeroContent(): void {
    gsap.from('.main-section__description, .main-section__contact-info', {
      duration: 1,
      y: 50,
      opacity: 0,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.8
    });
  }

  private animateProfileImage(): void {
    gsap.from('.profile-container__image', {
      duration: 1.2,
      scale: 0.8,
      opacity: 0,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    // Efecto de flotación
    gsap.to('.profile-container__image', {
      duration: 3,
      y: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  private animateBadges(): void {
    gsap.from('.profile-container__circular-badge', {
      duration: 0.8,
      x: 50,
      y: -50,
      opacity: 0,
      ease: 'elastic.out(1, 0.5)',
      delay: 1.2
    });

    gsap.from('.profile-container__certification-badge', {
      duration: 0.8,
      y: 50,
      opacity: 0,
      ease: 'bounce.out',
      delay: 1.5
    });
  }

  private animateStats(): void {
    gsap.from('.profile-container__stat-item', {
      duration: 1,
      x: -30,
      opacity: 0,
      stagger: 0.3,
      ease: 'power3.out',
      delay: 1
    });
  }

  private animateSocialSidebar(): void {
    const sidebar: HTMLElement | null = document.querySelector('.social-sidebar');
    if (sidebar) {
      gsap.set(sidebar, { visibility: 'visible', opacity: 1 });

      gsap.from('.social-sidebar__link', {
        duration: 1,
        x: 100,
        opacity: 0,
        stagger: 0.15,
        ease: 'back.out(1.7)',
        delay: 1.8
      });

      const socialLinks: NodeListOf<HTMLElement> = document.querySelectorAll('.social-sidebar__link');
      socialLinks.forEach((link: HTMLElement) => {
        link.addEventListener('mouseenter', () => {
          gsap.to(link, {
            duration: 0.3,
            x: -8,
            color: '#00d4aa',
            ease: 'power2.out'
          });
        });
        
        link.addEventListener('mouseleave', () => {
          gsap.to(link, {
            duration: 0.3,
            x: 0,
            color: '#666',
            ease: 'power2.out'
          });
        });
      });
    }
  }

  private animateButtons(): void {
    gsap.set('.main-section__buttons a', { visibility: 'visible', opacity: 1 });

    gsap.from('.main-section__btn-primary, .main-section__btn-secondary', {
      duration: 0.8,
      y: 20,
      opacity: 0,
      stagger: 0.2,
      ease: 'elastic.out(1, 0.5)',
      delay: 1.5
    });

    this.setupButtonHoverEffects();
  }

  private setupButtonHoverEffects(): void {
    const primaryBtn: HTMLElement | null = document.querySelector('.main-section__btn-primary');
    if (primaryBtn) {
      primaryBtn.addEventListener('mouseenter', () => {
        gsap.to(primaryBtn, {
          duration: 0.3,
          y: -2,
          boxShadow: '0 10px 20px rgba(0, 212, 170, 0.3)',
          ease: 'power2.out'
        });
      });
      
      primaryBtn.addEventListener('mouseleave', () => {
        gsap.to(primaryBtn, {
          duration: 0.3,
          y: 0,
          boxShadow: 'none',
          ease: 'power2.out'
        });
      });
    }

    const secondaryBtn: HTMLElement | null = document.querySelector('.main-section__btn-secondary');
    if (secondaryBtn) {
      secondaryBtn.addEventListener('mouseenter', () => {
        gsap.to(secondaryBtn, {
          duration: 0.3,
          y: -2,
          borderColor: '#1a1a1a',
          color: '#1a1a1a',
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
          ease: 'power2.out'
        });
      });
      
      secondaryBtn.addEventListener('mouseleave', () => {
        gsap.to(secondaryBtn, {
          duration: 0.3,
          y: 0,
          borderColor: '#666',
          color: '#666',
          boxShadow: 'none',
          ease: 'power2.out'
        });
      });
    }
  }

  private setupScrollAnimations(): void {
    const sections: NodeListOf<HTMLElement> = document.querySelectorAll('section');
    sections.forEach((section: HTMLElement) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }
}