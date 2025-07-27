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

  getAllContenido(): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(this.baseUrl);
  }

  getContenidoByModulo(id_modulo: number): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(`${this.baseUrl}?id_modulo=${id_modulo}`);
  }

  getContenidoById(id: number): Observable<Contenido> {
    return this.http.get<Contenido>(`${this.baseUrl}/${id}`);
  }
}
