import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  action: string; 
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
  
  private readonly baseUrl = `${environment.apiUrl}/likes`; 

  constructor(
    private http: HttpClient
  ) {}

  private getCurrentUserId(): number | null {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.userId || null;
      }

      const sessionUserStr = sessionStorage.getItem('currentUser');
      if (sessionUserStr) {
        const user = JSON.parse(sessionUserStr);
        return user.userId || null;
      }

      return null;
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
      return null;
    }
  }

  isUserAuthenticated(): boolean {
    const userId = this.getCurrentUserId();
    return userId !== null;
  }

  toggleLike(moduloId: number): Observable<ToggleLikeResponse> {
    const usuarioId = this.getCurrentUserId();
    
    if (!usuarioId) {
      return throwError(() => new Error('Debes iniciar sesión para dar like'));
    }

    const body = {
      usuario_id: usuarioId
    };

    return this.http.post<ToggleLikeResponse>(`${this.baseUrl}/modulo/${moduloId}/toggle`, body);
  }

  getLikeCount(moduloId: number): Observable<LikeCountResponse> {
    const usuarioId = this.getCurrentUserId();
    
    let params = new HttpParams();
    
    if (usuarioId) {
      params = params.set('usuario_id', usuarioId.toString());
    } else {
      console.log('Usuario no autenticado, obteniendo solo conteo');
    }

    return this.http.get<LikeCountResponse>(`${this.baseUrl}/modulo/${moduloId}`, { params });
  }

  getLikesPorModulo(moduloId: number): Observable<{ modulo_id: number; likes: Like[]; total: number }> {
    return this.http.get<{ modulo_id: number; likes: Like[]; total: number }>(`${this.baseUrl}/modulo/${moduloId}/all`);
  }

  getMostLikedModulos(limit: number = 10): Observable<{ modulos: ModuloWithLikes[]; total_modulos: number; limit_applied: number }> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<{ modulos: ModuloWithLikes[]; total_modulos: number; limit_applied: number }>(`${this.baseUrl}/modulos/most-liked`, { params });
  }

  getLikesByUser(): Observable<{ data: UserLikesResponse }> {
    const usuarioId = this.getCurrentUserId();
    
    if (!usuarioId) {
      return throwError(() => new Error('Debes iniciar sesión para ver tus likes'));
    }

    let params = new HttpParams().set('usuario_id', usuarioId.toString());
    return this.http.get<{ data: UserLikesResponse }>(`${this.baseUrl}/user`, { params });
  }

  getLikeStats(moduloId: number, startDate: string, endDate: string): Observable<{ data: LikeStats }> {
    let params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<{ data: LikeStats }>(`${this.baseUrl}/modulo/${moduloId}/stats`, { params });
  }

  agregarLike(moduloId: string): Promise<ToggleLikeResponse> {
    return this.toggleLike(parseInt(moduloId)).toPromise() as Promise<ToggleLikeResponse>;
  }

  quitarLike(moduloId: string): Promise<ToggleLikeResponse> {
    return this.toggleLike(parseInt(moduloId)).toPromise() as Promise<ToggleLikeResponse>;
  }

  getUsuarioId(): number | null {
    return this.getCurrentUserId();
  }
}