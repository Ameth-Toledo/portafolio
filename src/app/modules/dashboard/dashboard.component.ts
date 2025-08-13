import { Component, OnInit, OnDestroy, ElementRef, Renderer2, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  public sidebarClosed = true;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadUserPreferences();
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
}