import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { CursosService } from '../../services/cursos/cursos.service';
import { LikesService } from '../../services/likes/likes.service';
import { DonacionesService } from '../../services/donaciones/donaciones.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  totalCursos: number;
  totalLikes: number;
  totalDonations: number;
  totalAmount: number;
}

@Component({
  selector: 'app-inicio-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio-dashboard.component.html',
  styleUrl: './inicio-dashboard.component.css'
})
export class InicioDashboardComponent implements OnInit {
  
  stats: DashboardStats = {
    totalUsers: 0,
    totalCursos: 0,
    totalLikes: 0,
    totalDonations: 0,
    totalAmount: 0
  };

  loading = true;
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    private cursosService: CursosService,
    private likesService: LikesService,
    private donacionesService: DonacionesService
  ) {}

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.error = null;

    // Cargar todas las estadísticas en paralelo
    forkJoin({
      users: this.usersService.getTotalUsers(),
      cursos: this.cursosService.getTotalCursos(),
      donations: this.donacionesService.getAllDonaciones(),
      likes: this.likesService.getMostLikedModulos(100) // ✅ CORREGIDO: Cambiar de 1000 a 100
    }).subscribe({
      next: (response) => {
        console.log('Dashboard response:', response);
        
        // Usuarios
        this.stats.totalUsers = response.users.total || 0;
        
        // Cursos
        this.stats.totalCursos = response.cursos.total_cursos || 0;
        
        // Donaciones - manejar diferentes formatos de respuesta
        this.processDonationsData(response.donations);
        
        // Likes - sumar todos los likes de todos los módulos
        if (response.likes && response.likes.modulos) {
          this.stats.totalLikes = response.likes.modulos.reduce((total, modulo) => total + (modulo.like_count || 0), 0);
        } else {
          this.stats.totalLikes = 0;
        }
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.error = 'Error al cargar las estadísticas del dashboard';
        this.loading = false;
      }
    });
  }

  processDonationsData(donationsResponse: any) {
    console.log('Processing donations data:', donationsResponse);
    
    let donaciones: any[] = [];
    
    // Manejar diferentes formatos de respuesta igual que en el componente de donaciones
    if (Array.isArray(donationsResponse)) {
      donaciones = donationsResponse;
    } else if (donationsResponse && typeof donationsResponse === 'object') {
      if (donationsResponse.donaciones && Array.isArray(donationsResponse.donaciones)) {
        donaciones = donationsResponse.donaciones;
      } else if (donationsResponse.data && Array.isArray(donationsResponse.data)) {
        donaciones = donationsResponse.data;
      } else if (donationsResponse.results && Array.isArray(donationsResponse.results)) {
        donaciones = donationsResponse.results;
      }
    }

    console.log('Processed donations:', donaciones);

    this.stats.totalDonations = donaciones.length;
    this.stats.totalAmount = donaciones.reduce((sum, donacion) => {
      return sum + (donacion.monto || 0);
    }, 0);

    console.log('Stats after processing:', {
      totalDonations: this.stats.totalDonations,
      totalAmount: this.stats.totalAmount
    });
  }

  formatNumber(num: number): string {
    if (isNaN(num) || !isFinite(num)) {
      return '0';
    }
    return new Intl.NumberFormat('es-MX').format(num);
  }

  formatCurrency(amount: number): string {
    if (isNaN(amount) || !isFinite(amount)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount);
  }
}