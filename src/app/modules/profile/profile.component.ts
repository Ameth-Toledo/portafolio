import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users/users.service';
import { AuthService } from '../../services/auth/auth.service';

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
   defaultAvatar: string = 'assets/avatares/default.png';
 
   constructor(
     private usersService: UsersService,
     private authService: AuthService,
     private router: Router,
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
 
   getAvatarPath(): string {
     if (!this.user) return this.defaultAvatar;
     const avatarPath = `avatares/${this.user.avatar}.png`;
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
     this.router.navigate(['dashboard/inicio']);
   }
 
   editProfile(): void {
     this.router.navigate(['/profile/edit']);
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
}