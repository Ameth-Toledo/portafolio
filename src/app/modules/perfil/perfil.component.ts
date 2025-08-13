import { Component, OnInit } from '@angular/core';
import { HeaderBlogComponent } from "../../components/header-blog/header-blog.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';
import { Curso } from '../../models/curso';
import { CursosService } from '../../services/cursos/cursos.service';

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
  selector: 'app-perfil',
  standalone: true,
  imports: [HeaderBlogComponent, CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  user: UserProfile | null = null;
  editableUser: UserProfile | null = null;
  isLoading: boolean = true;
  isEditing: boolean = false;
  isSaving: boolean = false;
  error: string | null = null;
  defaultAvatar: string = 'avatares/default-avatar.png';

  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  
  availableAvatars: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    private cursosService: CursosService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser || !currentUser.userId) {
      this.error = 'No se pudo obtener la información del usuario';
      this.isLoading = false;
      return;
    }

    const userId = currentUser.userId;
    this.usersService.getUserProfile(userId).subscribe({
      next: (response: UserProfileResponse) => {
        this.user = response.user;
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.error = 'Error al cargar el perfil del usuario';
        this.isLoading = false;
        console.error('Error loading profile:', error);
      }
    });
  }

  getAvatarPath(avatarId?: number): string {
    const avatar = avatarId || this.user?.avatar;
    if (!avatar) return this.defaultAvatar;
    const avatarPath = `avatares/${avatar}.png`;
    return avatarPath;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultAvatar;
  }

  getRoleName(roleId: number): string {
    const roles: {[key: number]: string} = {
      1: 'Administrador',
      2: 'Alumno'
    };
    return roles[roleId] || 'Usuario';
  }

  get name(): string {
    return this.user?.nombres || '';
  }

  get fullName(): string {
    if (!this.user) return '';
    return `${this.user.nombres} ${this.user.apellido_paterno} ${this.user.apellido_materno}`;
  }

  get editableFullName(): string {
    if (!this.editableUser) return '';
    return `${this.editableUser.nombres} ${this.editableUser.apellido_paterno} ${this.editableUser.apellido_materno}`;
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

  sendToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/blog']);
  }

  // Nuevos métodos para edición inline
  editProfile(): void {
    if (!this.user) return;
    
    this.editableUser = { ...this.user };
    this.isEditing = true;
    this.error = null;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editableUser = null;
    this.error = null;
  }

  saveProfile(): void {
    if (!this.editableUser || this.isSaving) return;

    // Validaciones básicas
    if (!this.editableUser.nombres.trim()) {
      this.error = 'El nombre es requerido';
      return;
    }
    if (!this.editableUser.apellido_paterno.trim()) {
      this.error = 'El apellido paterno es requerido';
      return;
    }
    if (!this.editableUser.email.trim()) {
      this.error = 'El email es requerido';
      return;
    }

    this.isSaving = true;
    this.error = null;

    this.usersService.updateUserProfile(this.editableUser.id, this.editableUser).subscribe({
      next: (response: UserProfileResponse) => {
        this.user = response.user;
        this.isEditing = false;
        this.editableUser = null;
        this.isSaving = false;
        // Opcional: mostrar mensaje de éxito
      },
      error: (error: Error) => {
        this.error = 'Error al actualizar el perfil';
        this.isSaving = false;
        console.error('Error updating profile:', error);
      }
    });
  }

  confirmDeleteAccount(): void {
    if (confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      if (this.user) {
        this.usersService.deleteUser(this.user.id).subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/login']);
          },
          error: (error: Error) => {
            this.error = 'Error al eliminar la cuenta';
            console.error('Error deleting account:', error);
          }
        });
      }
    }
  }

  // Métodos para búsqueda de cursos (conservados)
  onBuscar(termino: string): void {
    if (!termino) {
      this.cursosFiltrados = [...this.cursos];
      return;
    }
    
    this.cursosService.searchCursosByNombre(termino).subscribe({
      next: (cursos) => {
        this.cursosFiltrados = cursos;
      },
      error: (err: Error) => console.error('Error al buscar cursos', err)
    });
  }
}