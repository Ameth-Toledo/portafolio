import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Like {
  id?: number;
  modulo_id: number;
  usuario_id?: number;
  fingerprint_hash?: string;
  fecha: string;
}

export interface LikeCountResponse {
  modulo_id: number;
  like_count: number;
  user_liked: boolean;
}

export interface ToggleLikeResponse {
  action: string; // "liked" o "unliked"
  like_count: number;
  message: string;
}

export interface ModuloWithLikes {
  modulo_id: number;
  like_count: number;
}

export interface UserLikesResponse {
  usuario_id?: number;
  fingerprint_hash?: string;
  likes: Like[];
  total_likes: number;
}

export interface DailyLikeStat {
  date: string;
  like_count: number;
}

export interface HourlyLikeStat {
  hour: number;
  like_count: number;
}

export interface LikeStats {
  modulo_id: number;
  start_date: string;
  end_date: string;
  total_likes: number;
  daily_stats: DailyLikeStat[];
  top_hours: HourlyLikeStat[];
}

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private readonly baseUrl = 'http://localhost:8080/likes'; // Cambia por tu URL de API
  private fingerprint: string;

  constructor(private http: HttpClient) {
    this.fingerprint = this.generateFingerprint();
  }

  private generateFingerprint(): string {
    let fingerprint = sessionStorage.getItem('user_fingerprint');
    
    if (!fingerprint) {
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const platform = navigator.platform;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timestamp = Date.now();
      
      const fingerprintData = `${userAgent}_${language}_${platform}_${screenResolution}_${timezone}_${timestamp}`;
      fingerprint = this.simpleHash(fingerprintData);
      
      sessionStorage.setItem('user_fingerprint', fingerprint);
    }
    
    return fingerprint;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; 
    }
    return Math.abs(hash).toString(36);
  }

  getFingerprint(): string {
    return this.fingerprint;
  }

  // Toggle like (dar/quitar like)
  toggleLike(moduloId: number, usuarioId?: number): Observable<ToggleLikeResponse> {
    const body: any = {};
    
    if (usuarioId) {
      body.usuario_id = usuarioId;
    } else {
      body.fingerprint_hash = this.fingerprint;
    }

    return this.http.post<ToggleLikeResponse>(`${this.baseUrl}/modulo/${moduloId}/toggle`, body);
  }

  // Obtener contador de likes y estado del usuario
  getLikeCount(moduloId: number, usuarioId?: number): Observable<LikeCountResponse> {
    let params = new HttpParams();
    
    if (usuarioId) {
      params = params.set('usuario_id', usuarioId.toString());
    } else {
      params = params.set('fingerprint_hash', this.fingerprint);
    }

    return this.http.get<LikeCountResponse>(`${this.baseUrl}/modulo/${moduloId}`, { params });
  }

  // Obtener todos los likes de un módulo
  getLikesPorModulo(moduloId: number): Observable<{ modulo_id: number; likes: Like[]; total: number }> {
    return this.http.get<{ modulo_id: number; likes: Like[]; total: number }>(`${this.baseUrl}/modulo/${moduloId}/all`);
  }

  // Obtener módulos más likeados
  getMostLikedModulos(limit: number = 10): Observable<{ modulos: ModuloWithLikes[]; total_modulos: number; limit_applied: number }> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ modulos: ModuloWithLikes[]; total_modulos: number; limit_applied: number }>(`${this.baseUrl}/modulos/most-liked`, { params });
  }

  // Obtener likes de un usuario específico
  getLikesByUser(usuarioId?: number): Observable<{ data: UserLikesResponse }> {
    let params = new HttpParams();
    
    if (usuarioId) {
      params = params.set('usuario_id', usuarioId.toString());
    } else {
      params = params.set('fingerprint_hash', this.fingerprint);
    }

    return this.http.get<{ data: UserLikesResponse }>(`${this.baseUrl}/user`, { params });
  }

  // Obtener estadísticas de likes por período
  getLikeStats(moduloId: number, startDate: string, endDate: string): Observable<{ data: LikeStats }> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<{ data: LikeStats }>(`${this.baseUrl}/modulo/${moduloId}/stats`, { params });
  }

  // Métodos de conveniencia para el componente actual
  agregarLike(moduloId: string, usuarioId?: number): Promise<ToggleLikeResponse> {
    return this.toggleLike(parseInt(moduloId), usuarioId).toPromise() as Promise<ToggleLikeResponse>;
  }

  quitarLike(moduloId: string, usuarioId?: number): Promise<ToggleLikeResponse> {
    return this.toggleLike(parseInt(moduloId), usuarioId).toPromise() as Promise<ToggleLikeResponse>;
  }

  // Método para obtener un ID de usuario simulado (para compatibilidad)
  getUsuarioId(): string {
    return this.fingerprint;
  }
}