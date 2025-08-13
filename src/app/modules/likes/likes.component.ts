import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LikesService, ModuloWithLikes, LikeWithUserInfo, UserLikesResponse, LikeStats, DailyLikeStat, HourlyLikeStat, ModuloOption } from '../../services/likes/likes.service';

interface UserLikeInfo extends UserLikesResponse {
  usuario_nombre?: string;
  usuario_apellidos?: string;
}

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [LikesService],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.css'
})
export class LikesComponent implements OnInit {
  // Loading states
  loadingMostLiked = false;
  loadingUserLikes = false;
  loadingModuleStats = false;
  loadingModuleLikes = false;
  loadingModuloOptions = false;

  // Data
  mostLikedModules: ModuloWithLikes[] = [];
  userLikes: UserLikeInfo | null = null;
  moduleStats: LikeStats | null = null;
  moduleLikes: LikeWithUserInfo[] = [];
  moduloOptions: ModuloOption[] = [];
  
  // Form data - Cambiar a string para manejar el valor inicial vacío
  selectedModuleId: string = '';
  selectedUserId: number = 1;
  statsModuleId: string = '';
  statsStartDate: string = '';
  statsEndDate: string = '';
  mostLikedLimit: number = 10;
  
  // Pagination for module likes
  currentPage = 1;
  itemsPerPage = 10;
  totalModuleLikes = 0;
  totalPages = 0;
  paginatedModuleLikes: LikeWithUserInfo[] = [];

  // Stats for display
  totalLikesOverall = 0;

  Math = Math;

  constructor(private likesService: LikesService) {
    // Set default dates (last 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    
    this.statsEndDate = endDate.toISOString().split('T')[0];
    this.statsStartDate = startDate.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadModuloOptions();
  }

  // Cargar opciones de módulos primero, luego el resto
  loadModuloOptions() {
    this.loadingModuloOptions = true;
    console.log('Cargando opciones de módulos...');
    
    this.likesService.getAllModulos().subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.moduloOptions = response.modulos || [];
        console.log('Opciones cargadas:', this.moduloOptions);
        
        // Establecer valores por defecto si hay módulos disponibles
        if (this.moduloOptions.length > 0 && !this.selectedModuleId) {
          this.selectedModuleId = this.moduloOptions[0].id.toString();
          this.statsModuleId = this.moduloOptions[0].id.toString();
        }
        
        this.loadingModuloOptions = false;
        
        // Cargar el resto de datos después de tener los módulos
        this.loadMostLikedModules();
        this.loadUserLikes();
        if (this.selectedModuleId) {
          this.loadModuleLikes();
        }
        if (this.statsModuleId) {
          this.loadModuleStats();
        }
      },
      error: (error) => {
        console.error('Error loading modulo options:', error);
        this.loadingModuloOptions = false;
        
        // Aún así intentar cargar otros datos
        this.loadMostLikedModules();
        this.loadUserLikes();
      }
    });
  }

  // Load most liked modules
  loadMostLikedModules() {
    this.loadingMostLiked = true;
    this.likesService.getMostLikedModulos(this.mostLikedLimit).subscribe({
      next: (response) => {
        this.mostLikedModules = response.modulos || [];
        this.totalLikesOverall = this.mostLikedModules.reduce((sum, module) => sum + module.like_count, 0);
        this.loadingMostLiked = false;
      },
      error: (error) => {
        console.error('Error loading most liked modules:', error);
        this.loadingMostLiked = false;
      }
    });
  }

  // Load user likes
  loadUserLikes() {
    // Verificar si el usuario está autenticado antes de hacer la llamada
    if (!this.likesService.isUserAuthenticated()) {
      console.log('Usuario no autenticado, saltando carga de likes de usuario');
      return;
    }

    this.loadingUserLikes = true;
    this.likesService.getLikesByUser().subscribe({
      next: (response) => {
        this.userLikes = response.data;
        this.loadingUserLikes = false;
      },
      error: (error) => {
        console.error('Error loading user likes:', error);
        this.loadingUserLikes = false;
        this.userLikes = null;
      }
    });
  }

  // Load likes for specific module
  loadModuleLikes() {
    if (!this.selectedModuleId) {
      return;
    }

    this.loadingModuleLikes = true;
    const moduleId = parseInt(this.selectedModuleId);
    
    this.likesService.getLikesPorModulo(moduleId).subscribe({
      next: (response) => {
        this.moduleLikes = response.likes || [];
        this.totalModuleLikes = response.total || 0;
        this.totalPages = Math.ceil(this.totalModuleLikes / this.itemsPerPage);
        this.currentPage = 1; // Reset a la primera página
        this.updatePaginatedModuleLikes();
        this.loadingModuleLikes = false;
      },
      error: (error) => {
        console.error('Error loading module likes:', error);
        this.loadingModuleLikes = false;
      }
    });
  }

  // Load module statistics
  loadModuleStats() {
    if (!this.statsModuleId || !this.statsStartDate || !this.statsEndDate) {
      return;
    }

    this.loadingModuleStats = true;
    const moduleId = parseInt(this.statsModuleId);
    
    this.likesService.getLikeStats(moduleId, this.statsStartDate, this.statsEndDate).subscribe({
      next: (response) => {
        this.moduleStats = response.data;
        this.loadingModuleStats = false;
      },
      error: (error) => {
        console.error('Error loading module stats:', error);
        this.loadingModuleStats = false;
      }
    });
  }

  // Update paginated module likes
  updatePaginatedModuleLikes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedModuleLikes = this.moduleLikes.slice(startIndex, endIndex);
  }

  // Pagination methods
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedModuleLikes();
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

  // Form handlers
  onMostLikedLimitChange() {
    this.loadMostLikedModules();
  }

  onModuleIdChange() {
    this.currentPage = 1;
    this.loadModuleLikes();
  }

  onStatsFormSubmit() {
    this.loadModuleStats();
  }

  // Utility methods
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

  formatHour(hour: number): string {
    return `${hour.toString().padStart(2, '0')}:00`;
  }

  // Método para obtener el nombre completo del usuario
  getUserDisplayName(like: LikeWithUserInfo): string {
    if (like.usuario_id && like.usuario_nombre) {
      const apellido = like.usuario_apellido ? ` ${like.usuario_apellido}` : '';
      return `${like.usuario_nombre}${apellido}`;
    }
    return 'Usuario Anónimo';
  }

  // Método para obtener el título del módulo por ID
  getModuloTitleById(moduloId: string | number): string {
    const id = typeof moduloId === 'string' ? parseInt(moduloId) : moduloId;
    const modulo = this.moduloOptions.find(m => m.id === id);
    return modulo ? modulo.titulo : `Módulo ${id}`;
  }

  // Get peak hour from stats
  getPeakHour(): HourlyLikeStat | null {
    if (!this.moduleStats?.top_hours || this.moduleStats.top_hours.length === 0) {
      return null;
    }
    
    return this.moduleStats.top_hours.reduce((peak, current) => 
      current.like_count > peak.like_count ? current : peak
    );
  }

  // Get best day from stats
  getBestDay(): DailyLikeStat | null {
    if (!this.moduleStats?.daily_stats || this.moduleStats.daily_stats.length === 0) {
      return null;
    }
    
    return this.moduleStats.daily_stats.reduce((best, current) => 
      current.like_count > best.like_count ? current : best
    );
  }

  // Calculate average likes per day
  getAverageLikesPerDay(): number {
    if (!this.moduleStats?.daily_stats || this.moduleStats.daily_stats.length === 0) {
      return 0;
    }
    
    const totalLikes = this.moduleStats.daily_stats.reduce((sum, stat) => sum + stat.like_count, 0);
    return Math.round(totalLikes / this.moduleStats.daily_stats.length);
  }

  getBestDayFormatted(): string | null {
  const bestDay = this.getBestDay();
  if (!bestDay) {
    return null;
  }
  
  const formattedDate = this.formatDateOnly(bestDay.date);
  return `${formattedDate} (${bestDay.like_count} likes)`;
}

formatDateOnly(dateString: string): string {
  if (!dateString) return 'No disponible';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}
}