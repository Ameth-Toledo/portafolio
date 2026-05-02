import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  menuAbierto = false;

  constructor(private router: Router) {}

  navegarYCerrar(event: Event, fragment: string): void {
    event.preventDefault();
    this.cerrarMenu();
    
    // Navegar con el fragmento
    this.router.navigate([], { fragment: fragment });
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu(): void {
    this.menuAbierto = false;
  }
}