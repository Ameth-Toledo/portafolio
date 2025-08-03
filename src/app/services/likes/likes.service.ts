import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

export interface Like {
  key?: string;
  moduloId: string;
  usuarioId: string; 
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

  private generateUserId(): string {
    let userId = sessionStorage.getItem('user_id');
    
    if (!userId) {
      const userAgent = navigator.userAgent;
      const language = navigator.language;
      const platform = navigator.platform;
      const screenResolution = `${screen.width}x${screen.height}`;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const timestamp = Date.now();
      
      const fingerprint = `${userAgent}_${language}_${platform}_${screenResolution}_${timezone}_${timestamp}`;
      userId = this.simpleHash(fingerprint);
      
      sessionStorage.setItem('user_id', userId);
    }
    
    return userId;
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

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getLikesPorModulo(moduloId: string) {
    return this.db.list('likes', ref =>
      ref.orderByChild('moduloId').equalTo(moduloId)
    ).snapshotChanges();
  }

  agregarLike(moduloId: string): Promise<void> {
    const like: Omit<Like, 'key'> = {
      moduloId,
      usuarioId: this.usuarioId,
      fecha: new Date().toISOString()
    };
    return this.likesRef.push(like).then(() => { });
  }

  quitarLike(key: string): Promise<void> {
    return this.likesRef.remove(key);
  }
}