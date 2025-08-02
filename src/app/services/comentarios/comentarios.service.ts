import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

export interface Comentario {
  key?: string;
  texto: string;
  moduloId: string;
  autor: string;
  fecha: string;
  fechaEditado?: string; // Agregar esta propiedad opcional
}

@Injectable()
export class ComentariosService {
  private comentariosRef: AngularFireList<Comentario>;

  constructor(private db: AngularFireDatabase) {
    this.comentariosRef = db.list('comentarios');
  }

  getComentariosPorModulo(moduloId: string) {
    return this.db.list('comentarios', ref =>
      ref.orderByChild('moduloId').equalTo(moduloId)
    ).snapshotChanges();
  }

  agregarComentario(moduloId: string, texto: string): Promise<void> {
    const comentario: Omit<Comentario, 'key'> = {
      texto,
      moduloId,
      autor: "Ing",
      fecha: new Date().toISOString()
    };
    return this.comentariosRef.push(comentario).then(() => { });
  }

  editarComentario(key: string, nuevoTexto: string): Promise<void> {
    return this.comentariosRef.update(key, {
      texto: nuevoTexto,
      fechaEditado: new Date().toISOString()
    });
  }

  eliminarComentario(key: string): Promise<void> {
    return this.comentariosRef.remove(key);
  }
}