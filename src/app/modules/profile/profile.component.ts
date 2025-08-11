import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';

interface UserProfile {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  avatar: number;
  rol_id: number;
  fecha_registro: string;
}

interface UserProfileResponse {
  user: UserProfile;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: UserProfile | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  // Estadísticas simuladas (puedes conectarlas a tu API)
  stats = {
    cursosCompletados: 0,
    diasActividad: 4,
    nivelProgreso: 'Principiante',
    puntosTotales: 0
  };

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    // Simulando datos del usuario (reemplaza con tu llamada real a la API)
    const userData: UserProfileResponse = {
      "user": {
        "apellido_materno": "Toledo",
        "apellido_paterno": "Mendez", 
        "avatar": 2,
        "email": "233363@ids.upchiapas.edu.mx",
        "fecha_registro": "2025-08-06T12:00:50.925791Z",
        "id": 1,
        "nombres": "Ameth de Jesus",
        "rol_id": 1
      }
    };

    // Simular carga
    setTimeout(() => {
      this.user = userData.user;
      this.isLoading = false;
    }, 1000);

    // Para usar con tu servicio real, descomenta esto:
    /*
    this.usersService.getUserProfile(1).subscribe({
      next: (response: UserProfileResponse) => {
        this.user = response.user;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar el perfil';
        this.isLoading = false;
        console.error('Error loading profile:', error);
      }
    });
    */
  }

  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.nombres} ${this.user.apellido_paterno} ${this.user.apellido_materno}`;
  }

  get userInitials(): string {
    if (!this.user) return '';
    const nombres = this.user.nombres.split(' ');
    const initials = nombres.map(n => n[0]).join('') + this.user.apellido_paterno[0];
    return initials.toUpperCase();
  }

  get formattedDate(): string {
    if (!this.user) return '';
    const date = new Date(this.user.fecha_registro);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  get userRoleText(): string {
    if (!this.user) return '';
    return this.user.rol_id === 1 ? 'Estudiante' : 'Profesor';
  }

  sendToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/home']);
  }

  editProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  onBuscar(searchTerm: string): void {
    // Implementar lógica de búsqueda si es necesario
    console.log('Búsqueda:', searchTerm);
  }
}