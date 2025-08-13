import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service'; 
import { environment } from '../../../environments/environment';

export interface Comentario {
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

export interface ComentarioResponse {
  comentarios: Comentario[];
}

export interface CreateComentarioRequest {
  modulo_id: number;
  usuario_id: number;
  texto: string;
}

export interface UpdateComentarioRequest {
  modulo_id: number;
  usuario_id: number;
  texto: string;
}

@Injectable()
export class ComentariosService {
  private baseUrl = `${environment.apiUrl}/comentarios`;

  constructor(
    private http: HttpClient,
    private authService: AuthService // Inyectar AuthService
  ) {}

  // Obtener el ID del usuario actual logueado
  private getCurrentUserId(): number {
    const currentUser = this.authService.getCurrentUser();
    return currentUser ? currentUser.userId : 1; // Fallback a 1 si no hay usuario
  }

  // Método principal que usarás para obtener comentarios con nombres de usuario
  getComentariosPorModulo(moduloId: string): Observable<any[]> {
    return this.http.get<ComentarioResponse>(`${this.baseUrl}/modulo/${moduloId}/with-user`)
      .pipe(
        map(response => {
          const currentUserId = this.getCurrentUserId();
          console.log('Usuario actual en servicio:', currentUserId);
          
          // Transformar los datos para que sean compatibles con el componente existente
          return response.comentarios.map(comentario => {
            const canEdit = comentario.usuario_id === currentUserId;
            console.log(`Comentario ${comentario.id}: usuario_id=${comentario.usuario_id}, currentUserId=${currentUserId}, canEdit=${canEdit}`);
            
            return {
              payload: {
                key: comentario.id?.toString(),
                val: () => ({
                  key: comentario.id?.toString(),
                  texto: comentario.texto,
                  moduloId: comentario.modulo_id.toString(),
                  autor: this.formatUserName(comentario),
                  fecha: comentario.fecha,
                  modulo_id: comentario.modulo_id,
                  usuario_id: comentario.usuario_id,
                  avatar: comentario.avatar,
                  canEdit: canEdit
                })
              }
            };
          });
        })
      );
  }

  private formatUserName(comentario: Comentario): string {
    if (comentario.nombre_usuario) {
      const apellidos = [comentario.apellido_paterno, comentario.apellido_materno]
        .filter(apellido => apellido && apellido.trim() !== '')
        .join(' ');
      
      return apellidos ? `${comentario.nombre_usuario} ${apellidos}` : comentario.nombre_usuario;
    }
    return "Usuario desconocido";
  }

  agregarComentario(moduloId: string, texto: string): Promise<void> {
    const currentUserId = this.getCurrentUserId();
    
    const comentario: CreateComentarioRequest = {
      modulo_id: parseInt(moduloId),
      usuario_id: currentUserId,
      texto: texto
    };

    console.log('Agregando comentario con usuario ID:', currentUserId);

    return this.http.post<any>(this.baseUrl, comentario)
      .toPromise()
      .then(() => {});
  }

  editarComentarioCompleto(key: string, comentario: UpdateComentarioRequest): Promise<void> {
    return this.http.put<any>(`${this.baseUrl}/${key}`, comentario)
      .toPromise()
      .then(() => {});
  }

  eliminarComentario(key: string): Promise<void> {
    return this.http.delete<any>(`${this.baseUrl}/${key}`)
      .toPromise()
      .then(() => {});
  }

  // Métodos adicionales
  getAllComentarios(): Observable<Comentario[]> {
    return this.http.get<ComentarioResponse>(`${this.baseUrl}/with-user`)
      .pipe(map(response => response.comentarios));
  }

  getComentarioById(id: number): Observable<Comentario> {
    return this.http.get<{comentario: Comentario}>(`${this.baseUrl}/${id}`)
      .pipe(map(response => response.comentario));
  }

  getComentariosByUsuario(usuarioId: number): Observable<Comentario[]> {
    return this.http.get<ComentarioResponse>(`${this.baseUrl}/usuario/${usuarioId}`)
      .pipe(map(response => response.comentarios));
  }

  getTotalComentarios(): Observable<number> {
    return this.http.get<{total: number}>(`${this.baseUrl}/total`)
      .pipe(map(response => response.total));
  }

  // Método para establecer el usuario actual (deprecated - ahora se obtiene automáticamente)
  setCurrentUserId(userId: number): void {
    console.warn('setCurrentUserId() está deprecated. El ID se obtiene automáticamente del AuthService.');
  }

  // Método público para obtener el ID del usuario actual (si se necesita externamente)
  getAuthenticatedUserId(): number {
    return this.getCurrentUserId();
  }
}