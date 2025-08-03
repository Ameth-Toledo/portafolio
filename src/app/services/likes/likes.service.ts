import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

export interface Like {
  key?: string;
  moduloId: string;
  usuario: string;
  fecha: string;
}

@Injectable()
export class LikesService {
  private likesRef: AngularFireList<Like>;

  constructor(private db: AngularFireDatabase) {
    this.likesRef = db.list('likes');
  }

  getLikesPorModulo(moduloId: string) {
    return this.db.list('likes', ref =>
      ref.orderByChild('moduloId').equalTo(moduloId)
    ).snapshotChanges();
  }

  agregarLike(moduloId: string, usuario: string): Promise<void> {
    const like: Omit<Like, 'key'> = {
      moduloId,
      usuario,
      fecha: new Date().toISOString()
    };
    return this.likesRef.push(like).then(() => { });
  }

  quitarLike(key: string): Promise<void> {
    return this.likesRef.remove(key);
  }
}