import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users/users.service';
import { CursosService } from '../../services/cursos/cursos.service';
import { LikesService } from '../../services/likes/likes.service';
import { DonacionesService } from '../../services/donaciones/donaciones.service';
import { ComentariosService } from '../../services/comentarios/comentarios.service';
import { forkJoin } from 'rxjs';

interface DashboardStats {
  totalUsers: number;
  totalCursos: number;
  totalLikes: number;
  totalDonations: number;
  totalAmount: number;
}

interface ModuleWithLikes {
  modulo_id: number;
  modulo_titulo: string;
  like_count: number;
}

interface Donation {
  id?: number;
  usuario_id: number;
  modulo_id: number;
  monto: number;
  moneda: string;
  estado: string;
  metodo_pago: string;
  transaction_id: string;
  payment_id: string;
  fecha_pago: string;
  usuario_nombre?: string;
  usuario_apellidos?: string;
  modulo_titulo?: string;
  curso_nombre?: string;
}

interface Comment {
  id?: number;
  modulo_id: number;
  usuario_id: number;
  texto: string;
  fecha: string;
  nombre_usuario?: string;
  apellido_paterno?: string;
  apellido_materno?: string;
  avatar?: number;
  key?: string;
  autor?: string;
}

@Component({
  selector: 'app-inicio-dashboard',
  standalone: true,
  imports: [CommonModule],
  providers: [ComentariosService],
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

  topModules: ModuleWithLikes[] = [];
  recentDonations: Donation[] = [];
  recentComments: Comment[] = [];

  loading = true;
  error: string | null = null;

  constructor(
    private usersService: UsersService,
    private cursosService: CursosService,
    private likesService: LikesService,
    private donacionesService: DonacionesService,
    private comentariosService: ComentariosService
  ) { }

  ngOnInit() {
    this.loadDashboardStats();
  }

  loadDashboardStats() {
    this.loading = true;
    this.error = null;

    forkJoin({
      users: this.usersService.getTotalUsers(),
      cursos: this.cursosService.getTotalCursos(),
      donations: this.donacionesService.getAllDonaciones(),
      likes: this.likesService.getMostLikedModulos(5),
      allDonations: this.donacionesService.getAllDonaciones(),
      comments: this.comentariosService.getAllComentarios()
    }).subscribe({
      next: (response) => {
        console.log('Dashboard response:', response);

        this.stats.totalUsers = response.users.total || 0;

        this.stats.totalCursos = response.cursos.total_cursos || 0;

        this.processDonationsData(response.donations);

        if (response.likes && response.likes.modulos) {
          this.stats.totalLikes = response.likes.modulos.reduce((total, modulo) => total + (modulo.like_count || 0), 0);
          this.topModules = response.likes.modulos.slice(0, 5);
        } else {
          this.stats.totalLikes = 0;
        }

        this.processRecentDonations(response.allDonations);

        this.processRecentComments(response.comments);

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
  }

  processRecentDonations(donationsResponse: any) {
    let donaciones: any[] = [];

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

    this.recentDonations = donaciones
      .sort((a, b) => new Date(b.fecha_pago || b.fecha_creacion || 0).getTime() -
        new Date(a.fecha_pago || a.fecha_creacion || 0).getTime())
      .slice(0, 5);
  }

  processRecentComments(commentsResponse: any) {
    let comentarios: any[] = [];

    if (Array.isArray(commentsResponse)) {
      comentarios = commentsResponse;
    } else if (commentsResponse && typeof commentsResponse === 'object') {
      if (commentsResponse.comentarios && Array.isArray(commentsResponse.comentarios)) {
        comentarios = commentsResponse.comentarios;
      } else if (commentsResponse.data && Array.isArray(commentsResponse.data)) {
        comentarios = commentsResponse.data;
      }
    }

    this.recentComments = comentarios
      .map(comment => {
        if (comment.nombre_usuario && !comment.autor) {
          const apellidos = [comment.apellido_paterno, comment.apellido_materno]
            .filter(apellido => apellido && apellido.trim() !== '')
            .join(' ');

          comment.autor = apellidos
            ? `${comment.nombre_usuario} ${apellidos}`
            : comment.nombre_usuario;
        }

        if (!comment.autor) {
          comment.autor = 'Usuario';
        }

        return comment;
      })
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
      .slice(0, 5);
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

  formatDate(dateString: string): string {
    if (!dateString) return 'Fecha desconocida';

    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  getAvatarUrl(avatarId: number): string {
    return `/avatares/${avatarId}.png`;
  }
}