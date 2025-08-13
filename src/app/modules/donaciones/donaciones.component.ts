import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DonacionesService, Donacion } from '../../services/donaciones/donaciones.service';
import { AuthService } from '../../services/auth/auth.service';

// Define interface for API response
interface DonacionesResponse {
  donaciones?: Donacion[];
  data?: Donacion[];
  results?: Donacion[];
  [key: string]: any; // Allow other properties
}

@Component({
  selector: 'app-donaciones',
  standalone: true,
  imports: [CommonModule],
  providers: [
    DonacionesService,
    AuthService,
    HttpClient
  ],
  templateUrl: './donaciones.component.html',
  styleUrl: './donaciones.component.css'
})
export class DonacionesComponent implements OnInit {
  // Expose Math to template
  Math = Math;
  
  // Datos originales
  allDonaciones: Donacion[] = [];
  // Datos paginados
  donaciones: Donacion[] = [];
  loading = true;
  
  // Configuración de paginación
  currentPage = 1;
  itemsPerPage = 20;
  totalItems = 0;
  totalPages = 0;

  // Estadísticas
  totalMonto = 0;
  promedioDonacion = 0;
  donacionesHoy = 0;

  constructor(
    private donacionesService: DonacionesService
  ) {}

  ngOnInit() {
    this.cargarDonaciones();
  }

  cargarDonaciones() {
    this.loading = true;
    this.donacionesService.getAllDonaciones().subscribe({
      next: (response: DonacionesResponse | Donacion[] | any) => {
        console.log('Respuesta completa del servicio:', response);
        
        // Manejar diferentes formatos de respuesta
        let donaciones: Donacion[] = [];
        
        if (Array.isArray(response)) {
          // Si la respuesta es directamente un array
          donaciones = response;
        } else if (response && typeof response === 'object') {
          // Si la respuesta es un objeto, buscar la propiedad que contiene el array
          if (response.donaciones && Array.isArray(response.donaciones)) {
            donaciones = response.donaciones;
          } else if (response.data && Array.isArray(response.data)) {
            donaciones = response.data;
          } else if (response.results && Array.isArray(response.results)) {
            donaciones = response.results;
          } else {
            console.warn('Formato de respuesta no reconocido:', response);
            donaciones = [];
          }
        }
        
        this.allDonaciones = donaciones;
        this.totalItems = donaciones.length;
        this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
        this.calcularEstadisticas();
        this.updatePaginatedData();
        this.loading = false;
        console.log('Donaciones procesadas:', donaciones);
      },
      error: (error) => {
        console.error('Error al cargar donaciones:', error);
        this.loading = false;
      }
    });
  }

  calcularEstadisticas() {
    // Validar que allDonaciones sea un array
    if (!Array.isArray(this.allDonaciones)) {
      console.warn('allDonaciones no es un array:', this.allDonaciones);
      this.totalMonto = 0;
      this.promedioDonacion = 0;
      this.donacionesHoy = 0;
      return;
    }

    this.totalMonto = this.allDonaciones.reduce((sum, donacion) => {
      return sum + (donacion.monto || 0);
    }, 0);
    
    this.promedioDonacion = this.totalItems > 0 ? this.totalMonto / this.totalItems : 0;
    
    // Calcular donaciones de hoy
    const hoy = new Date().toDateString();
    this.donacionesHoy = this.allDonaciones.filter(donacion => {
      if (donacion.fecha_pago) {
        return new Date(donacion.fecha_pago).toDateString() === hoy;
      }
      return false;
    }).length;
  }

  updatePaginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.donaciones = this.allDonaciones.slice(startIndex, endIndex);
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

  eliminarDonacion(donacion: Donacion) {
    if (confirm(`¿Estás seguro de que quieres eliminar esta donación de $${donacion.monto} ${donacion.moneda}?`)) {
      this.donacionesService.deleteDonacion(donacion.id!).subscribe({
        next: () => {
          console.log('Donación eliminada');
          this.cargarDonaciones(); // Recargar la lista completa
        },
        error: (error) => {
          console.error('Error al eliminar donación:', error);
          alert('Error al eliminar la donación');
        }
      });
    }
  }

  // Método para formatear fecha
  formatDate(dateString: string): string {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Método para formatear monto
  formatAmount(amount: number, currency: string = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  // Método para obtener clase CSS según el estado
  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'approved':
      case 'completado':
        return 'estado-aprobado';
      case 'pending':
      case 'pendiente':
        return 'estado-pendiente';
      case 'rejected':
      case 'rechazado':
        return 'estado-rechazado';
      default:
        return 'estado-default';
    }
  }

  // Método para obtener texto del estado
  getEstadoTexto(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'approved':
        return 'Aprobado';
      case 'pending':
        return 'Pendiente';
      case 'rejected':
        return 'Rechazado';
      case 'completado':
        return 'Completado';
      default:
        return estado;
    }
  }
}