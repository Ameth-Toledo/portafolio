import { Component, OnInit, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { HeroService } from '../../services/hero/hero.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit {
constructor(
    private heroService: HeroService,
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  ngOnInit(): void {
    this.heroService.initAnimations();
  }

  ngAfterViewInit(): void {
    this.initializeSidebar();
    this.ensureSidebarVisibility();
  }

  private initializeSidebar(): void {
    const sidebar: HTMLElement | null = this.el.nativeElement.querySelector('.social-sidebar');
    if (!sidebar) {
      console.error('Sidebar no encontrado en el DOM');
      return;
    }

    // Añadir atributos de accesibilidad
    this.renderer.setAttribute(sidebar, 'aria-label', 'Redes sociales');
    
    // Inicializar íconos con tipado explícito
    const links: NodeListOf<HTMLElement> = sidebar.querySelectorAll('.social-sidebar__link');
    links.forEach((link: HTMLElement) => {
      this.renderer.setAttribute(link, 'tabindex', '0');
    });
  }

  private ensureSidebarVisibility(): void {
    setTimeout(() => {
      const sidebar: HTMLElement | null = document.querySelector('.social-sidebar');
      if (!sidebar) return;

      const styles: CSSStyleDeclaration = window.getComputedStyle(sidebar);
      
      // Verificar si está oculto
      if (styles.display === 'none' || styles.visibility === 'hidden' || parseFloat(styles.opacity) < 0.1) {
        console.warn('Sidebar estaba oculto, aplicando correcciones');
        
        // Aplicar estilos de emergencia
        this.renderer.setStyle(sidebar, 'display', 'flex');
        this.renderer.setStyle(sidebar, 'visibility', 'visible');
        this.renderer.setStyle(sidebar, 'opacity', '1');
        this.renderer.setStyle(sidebar, 'z-index', '10000');
        
        // Posicionamiento forzado
        this.renderer.setStyle(sidebar, 'position', 'fixed');
        this.renderer.setStyle(sidebar, 'right', '35px');
        this.renderer.setStyle(sidebar, 'top', '50%');
        this.renderer.setStyle(sidebar, 'transform', 'translateY(-50%)');
      }
    }, 500);
  }

  openCertificate(): void {
    const pdfPath: string = 'pdf/UI-UXCertificado.pdf';
    window.open(pdfPath, '_blank');
  }
}
