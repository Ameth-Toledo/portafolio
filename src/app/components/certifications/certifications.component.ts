import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [],
  templateUrl: './certifications.component.html',
  styleUrl: './certifications.component.css'
})
export class CertificationsComponent implements OnInit, AfterViewInit {

  private certificationPDFs: { [key: string]: string } = {
    'figma': '/pdf/UI-UXCertificado.pdf',
    'os': '/pdf/SistemasOperativos.pdf',
    'aws-architecting': '/pdf/AWS_Academy_Graduate___AWS_Academy_Cloud_Architecting.pdf',
    'aws-developing': '/pdf/AWS_Academy_Graduate___AWS_Academy_Cloud_Developing.pdf',
    'aws-foundations': '/pdf/AWS_Academy_Graduate___AWS_Academy_Cloud_Foundations.pdf',
    'cisco': '/pdf/NetworkingBasics.pdf'
  };

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Configuración inicial de GSAP
  }

  ngAfterViewInit() {
    this.initGSAPAnimations();
  }

  private initGSAPAnimations() {
    const tl = gsap.timeline();

    // Animación del header
    tl.from('.certifications-title', {
      duration: 1.2,
      y: 100,
      opacity: 0,
      ease: 'power3.out'
    })
    .from('.certifications-description', {
      duration: 1,
      y: 50,
      opacity: 0,
      ease: 'power3.out'
    }, '-=0.8');

    // Animación de las cards con ScrollTrigger
    gsap.fromTo('.certification-card', 
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
        rotateX: -15
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotateX: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.certifications-grid',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Animación de hover para las cards
    const cards = this.elementRef.nativeElement.querySelectorAll('.certification-card');
    
    cards.forEach((card: Element) => {
      const image = card.querySelector('.certification-image');
      const content = card.querySelector('.certification-content');

      // Mouse enter
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          duration: 0.4,
          y: -12,
          scale: 1.02,
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          ease: 'power2.out'
        });

        gsap.to(image, {
          duration: 0.4,
          scale: 1.1,
          rotate: 5,
          ease: 'power2.out'
        });

        gsap.to(content, {
          duration: 0.3,
          x: 8,
          ease: 'power2.out'
        });
      });

      // Mouse leave
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.4,
          y: 0,
          scale: 1,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          ease: 'power2.out'
        });

        gsap.to(image, {
          duration: 0.4,
          scale: 1,
          rotate: 0,
          ease: 'power2.out'
        });

        gsap.to(content, {
          duration: 0.3,
          x: 0,
          ease: 'power2.out'
        });
      });

      // Click animation
      card.addEventListener('click', () => {
        gsap.to(card, {
          duration: 0.1,
          scale: 0.98,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut'
        });
      });
    });

    // Animación del background
    gsap.to('.certifications-section::before', {
      duration: 20,
      backgroundPosition: '100% 100%',
      repeat: -1,
      yoyo: true,
      ease: 'none'
    });
  }

  // Método para abrir PDFs
  openCertificationPDF(certificationType: string) {
    const pdfUrl = this.certificationPDFs[certificationType];
    
    if (pdfUrl) {
      // Crear animación de click
      const clickedCard = document.querySelector(`[data-cert="${certificationType}"]`);
      if (clickedCard) {
        gsap.to(clickedCard, {
          duration: 0.15,
          scale: 0.95,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
          onComplete: () => {
            // Abrir PDF en nueva pestaña
            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
          }
        });
      } else {
        // Fallback si no se encuentra el elemento
        window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      }
    } else {
      console.warn(`PDF not found for certification: ${certificationType}`);
      // Mostrar notificación al usuario (opcional)
      this.showNotification('Certificado no disponible');
    }
  }

  private showNotification(message: string) {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(255, 107, 107, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      backdrop-filter: blur(10px);
    `;
    
    document.body.appendChild(notification);

    // Animar entrada
    gsap.fromTo(notification, 
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.3 }
    );

    // Remover después de 3 segundos
    setTimeout(() => {
      gsap.to(notification, {
        opacity: 0,
        x: 100,
        duration: 0.3,
        onComplete: () => {
          document.body.removeChild(notification);
        }
      });
    }, 3000);
  }
}