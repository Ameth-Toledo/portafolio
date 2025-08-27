import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  public sidebarClosed = true;
  public currentRoute = '';
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadUserPreferences();
    this.subscribeToRouterEvents();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  private subscribeToRouterEvents(): void {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
        this.updateActiveMenuItems();
      });

    this.currentRoute = this.router.url;
    setTimeout(() => this.updateActiveMenuItems(), 0);
  }

  private updateActiveMenuItems(): void {
    const allLinks = this.elementRef.nativeElement.querySelectorAll('.nav-link a');
    allLinks.forEach((link: HTMLElement) => {
      this.renderer.removeClass(link, 'active');
    });

    let activeSelector = '';
    
    if (this.currentRoute.includes('/dashboard/inicio')) {
      activeSelector = '[data-route="inicio"]';
    } else if (this.currentRoute.includes('/dashboard/cursos')) {
      activeSelector = '[data-route="cursos"]';
    } else if (this.currentRoute.includes('/dashboard/comentarios')) {
      activeSelector = '[data-route="comentarios"]';
    } else if (this.currentRoute.includes('/dashboard/profile')) {
      activeSelector = '[data-route="profile"]';
    } else if (this.currentRoute.includes('/dashboard/users')) {
      activeSelector = '[data-route="users"]';
    } else if (this.currentRoute.includes('/dashboard/donaciones')) {
      activeSelector = '[data-route="donaciones"]';
    } else if (this.currentRoute.includes('/dashboard/likes')) {
      activeSelector = '[data-route="likes"]';
    }

    if (activeSelector) {
      const activeLink = this.elementRef.nativeElement.querySelector(activeSelector);
      if (activeLink) {
        this.renderer.addClass(activeLink, 'active');
      }
    }
  }

  toggleSidebar(): void {
    const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
    if (sidebar) {
      if (this.sidebarClosed) {
        this.renderer.removeClass(sidebar, 'close');
        this.sidebarClosed = false;
        console.log('Sidebar abierto - flecha debe apuntar izquierda');
      } else {
        this.renderer.addClass(sidebar, 'close');
        this.sidebarClosed = true;
        console.log('Sidebar cerrado - flecha debe apuntar derecha');
      }

      localStorage.setItem('sidebarClosed', this.sidebarClosed.toString());
    }
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadUserPreferences(): void {
    const savedSidebarState = localStorage.getItem('sidebarClosed');
    if (savedSidebarState === 'false') {
      this.sidebarClosed = false;
      setTimeout(() => {
        const sidebar = this.elementRef.nativeElement.querySelector('.sidebar');
        if (sidebar) {
          this.renderer.removeClass(sidebar, 'close');
        }
      }, 0);
    }
  }

  onComents(event: Event): void {
    event.preventDefault();
    this.router.navigate(['dashboard/comentarios']);
  }

  onInicio(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/inicio'])
  }

  onCursos(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/cursos'])
  }

  onProfile(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/profile']);
  }

  onUsers(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/users'])
  }

  onDonaciones(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/donaciones'])
  }

  onLikes(event: Event) {
    event.preventDefault();
    this.router.navigate(['dashboard/likes'])
  }

  isRouteActive(route: string): boolean {
    return this.currentRoute.includes(`/dashboard/${route}`);
  }
}