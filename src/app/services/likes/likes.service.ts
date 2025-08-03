import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

export interface Like {
  key?: string;
  moduloId: string;
  usuarioId: string; // Identificador único del usuario/dispositivo
  fecha: string;
}

@Injectable()
export class LikesService {
  private likesRef: AngularFireList<Like>;
  private usuarioId: string;

  constructor(private db: AngularFireDatabase) {
    this.likesRef = db.list('likes');
    this.usuarioId = this.generateUserId();
  }

  // Generar un ID único para el usuario basado en características del navegador
  private generateUserId(): string {
    // Verificar si ya existe un ID en sessionStorage
    let userId = sessionStorage.getItem('user_id');
    
    if (!userId) {
      // Crear un ID único basado en características del navegador
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const platform = navigator.platform;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timestamp = Date.now();
      
      // Combinar características y crear un hash simple
      const fingerprint = `${userAgent}_${language}_${platform}_${screenResolution}_${timezone}_${timestamp}`;
      userId = this.simpleHash(fingerprint);
      
      // Guardar en sessionStorage para esta sesión
      sessionStorage.setItem('user_id', userId);
    }
    
    return userId;
  }

  // Función hash simple para crear un ID único
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  // Obtener ID del usuario actual
  getUsuarioId(): string {
    return this.usuarioId;
  }

  // Obtener todos los likes de un módulo
  getLikesPorModulo(moduloId: string) {
    return this.db.list('likes', ref =>
      ref.orderByChild('moduloId').equalTo(moduloId)
    ).snapshotChanges();
  }

  // Agregar like
  agregarLike(moduloId: string): Promise<void> {
    const like: Omit<Like, 'key'> = {
      moduloId,
      usuarioId: this.usuarioId,
      fecha: new Date().toISOString()
    };
    return this.likesRef.push(like).then(() => { });
  }

  // Quitar like por key
  quitarLike(key: string): Promise<void> {
    return this.likesRef.remove(key);
  }
}