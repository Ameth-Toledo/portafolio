import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contenido } from '../../models/contenido';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {

private baseUrl = 'https://amethdev-api.vercel.app/api/contenido';

  constructor(private http: HttpClient) { }

  // Obtener todo el contenido
  getAllContenido(): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(this.baseUrl);
  }

  // Obtener contenido por ID de módulo
  getContenidoByModulo(id_modulo: number): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(`${this.baseUrl}?id_modulo=${id_modulo}`);
  }

  // Obtener un contenido específico por ID
  getContenidoById(id: number): Observable<Contenido> {
    return this.http.get<Contenido>(`${this.baseUrl}/${id}`);
  }
}
