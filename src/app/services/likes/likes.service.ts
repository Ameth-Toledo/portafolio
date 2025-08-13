import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Like {
  id?: number;
  modulo_id: number;
  usuario_id?: number;
  fingerprint_hash?: string;
  fecha: string;
}

// Nueva interfaz con información extendida
export interface LikeWithUserInfo {
  id: number;
  modulo_id: number;
  modulo_titulo: string;
  usuario_id?: number;
  usuario_nombre?: string;
  usuario_apellido?: string;
  fingerprint_hash?: string;
  fecha: string;
}

// Interfaz actualizada para módulos
export interface ModuloWithLikes {
  modulo_id: number;
  modulo_titulo: string; // Nuevo campo
  like_count: number;
}

// Nueva interfaz para opciones del selector
export interface ModuloOption {
  id: number;
  titulo: string;
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

export interface UserLikesResponse {
  usuario_id?: number;
  fingerprint_hash?: string;
  likes: LikeWithUserInfo[]; // Actualizado para usar la nueva interfaz
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
  modulo_titulo: string; // Nuevo campo
  start_date: string;
  end_date: string;
  total_likes: number;
  daily_stats: DailyLikeStat[];
  top_hours: HourlyLikeStat[];
}

// Interfaces para las respuestas del backend
interface BackendResponse<T> {
  data?: T;
  error: boolean;
  message: string;
}

interface BackendModulosOptionsResponse {
  data: {
    modulos: ModuloOption[];
    total: number;
  };
  error: boolean;
  message: string;
}

interface BackendMostLikedResponse {
  modulos: ModuloWithLikes[];
  total_modulos: number;
  limit_applied: number;
}

interface BackendModuleLikesResponse {
  modulo_id: number;
  likes: Like[];
  total: number;
}

interface BackendDetailedLikesResponse {
  data: {
    modulo_id: number;
    likes: LikeWithUserInfo[];
    total: number;
  };
  error: boolean;
  message: string;
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

  // Corregido para usar el endpoint detailed que incluye info del usuario
  getLikesPorModulo(moduloId: number): Observable<{ modulo_id: number; likes: LikeWithUserInfo[]; total: number }> {
    return this.http.get<BackendDetailedLikesResponse>(`${this.baseUrl}/modulo/${moduloId}/detailed`).pipe(
      map(response => {
        console.log('Respuesta detailed del backend:', response);
        
        if (response.error) {
          throw new Error(response.message || 'Error al obtener likes del módulo');
        }
        
        return {
          modulo_id: response.data.modulo_id,
          likes: response.data.likes || [],
          total: response.data.total
        };
      })
    );
  }

  // Corregido para manejar la respuesta real del backend
  getMostLikedModulos(limit: number = 10): Observable<{ modulos: ModuloWithLikes[]; total_modulos: number; limit_applied: number }> {
    let params = new HttpParams().set('limit', limit.toString());
    return this.http.get<BackendMostLikedResponse>(`${this.baseUrl}/modulos/most-liked`, { params });
  }

  // Actualizado para usar la nueva interfaz
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

  // ✅ CORREGIDO: Manejar la estructura real de respuesta del backend
  getAllModulos(): Observable<{ modulos: ModuloOption[] }> {
    return this.http.get<BackendModulosOptionsResponse>(`${this.baseUrl}/modulos/options`).pipe(
      map(response => {
        console.log('Respuesta completa del backend:', response);
        
        if (response.error) {
          throw new Error(response.message || 'Error al obtener módulos');
        }
        
        return {
          modulos: response.data?.modulos || []
        };
      })
    );
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