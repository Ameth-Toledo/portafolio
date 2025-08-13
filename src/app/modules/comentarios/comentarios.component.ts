import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ComentariosService } from '../../services/comentarios/comentarios.service';
import { AuthService } from '../../services/auth/auth.service';
import { Comentario } from '../../services/comentarios/comentarios.service';

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule],
  providers: [
    ComentariosService,
    AuthService,
    HttpClient
  ],
  templateUrl: './comentarios.component.html',
  styleUrl: './comentarios.component.css'
})
export class ComentariosComponent implements OnInit {
  Math = Math;
  allComentarios: Comentario[] = [];
  comentarios: Comentario[] = [];
  loading = true;
  
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;

  constructor(
    private comentariosService: ComentariosService
  ) {}

  ngOnInit() {
    this.cargarTodosLosComentarios();
  }

  cargarTodosLosComentarios() {
    this.loading = true;
    this.comentariosService.getAllComentarios().subscribe({
      next: (comentarios) => {
        this.allComentarios = comentarios;
        this.totalItems = comentarios.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.updatePaginatedData();
        this.loading = false;
        console.log('Todos los comentarios cargados:', comentarios);
      },
      error: (error) => {
        console.error('Error al cargar comentarios:', error);
        this.loading = false;
      }
    });
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.comentarios = this.allComentarios.slice(startIndex, endIndex);
  }

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

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  getPaginationEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  eliminarComentario(comentario: Comentario) {
    if (confirm('¿Estás seguro de que quieres eliminar este comentario?')) {
      const key = comentario.id?.toString() || '';
      this.comentariosService.eliminarComentario(key).then(() => {
        console.log('Comentario eliminado');
        this.cargarTodosLosComentarios();
      }).catch((error) => {
        console.error('Error al eliminar comentario:', error);
        alert('Error al eliminar el comentario');
      });
    }
  }

  formatUserName(comentario: Comentario): string {
    if (comentario.nombre_usuario) {
      const apellidos = [comentario.apellido_paterno, comentario.apellido_materno]
        .filter(apellido => apellido && apellido.trim() !== '')
        .join(' ');
      
      return apellidos ? `${comentario.nombre_usuario} ${apellidos}` : comentario.nombre_usuario;
    }
    return "Usuario desconocido";
  }

  onAvatarError(event: any) {
    event.target.src = 'avatares/1.png';
  }

  puedeEliminar(comentario: any): boolean {
    return true;
  }
}