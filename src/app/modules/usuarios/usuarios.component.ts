import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule],
  providers: [
    UsersService,
    AuthService,
    HttpClient
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit {
  // Expose Math to template
  Math = Math;
  
  // Datos originales
  allUsuarios: UserProfile[] = [];
  // Datos paginados
  usuarios: UserProfile[] = [];
  loading = true;
  
  // Configuración de paginación
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.loading = true;
    // Obtener solo usuarios con rol_id: 2
    this.usersService.getUsersByRole(2).subscribe({
      next: (usuarios) => {
        this.allUsuarios = usuarios;
        this.totalItems = usuarios.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePaginatedData();
        this.loading = false;
        console.log('Usuarios con rol_id 2 cargados:', usuarios);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading = false;
      }
    });
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.usuarios = this.allUsuarios.slice(startIndex, endIndex);
  }

  // Métodos de paginación
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  // Generar array de páginas para mostrar en la paginación
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Method to get the end index for pagination display
  getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  eliminarUsuario(usuario: UserProfile) {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${this.formatUserName(usuario)}?`)) {
      this.usersService.deleteUser(usuario.id).subscribe({
        next: () => {
          console.log('Usuario eliminado');
          this.cargarUsuarios(); 
        },
        error: (error) => {
          console.error('Error al eliminar usuario:', error);
          alert('Error al eliminar el usuario');
        }
      });
    }
  }

  // Método para formatear el nombre completo del usuario
  formatUserName(usuario: UserProfile): string {
    const apellidos = [usuario.apellido_paterno, usuario.apellido_materno]
      .filter(apellido => apellido && apellido.trim() !== '')
      .join(' ');
    
    return apellidos ? `${usuario.nombres} ${apellidos}` : usuario.nombres;
  }

  // Método para manejar errores de carga de avatar
  onAvatarError(event: any) {
    // Si la imagen no se puede cargar, mostrar un avatar por defecto
    event.target.src = 'avatares/1.png';
  }

  // Método para formatear la fecha de registro
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}