import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Contenido } from '../../models/contenido';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContenidoService {
  
  private baseUrl = `${environment.apiUrl}/contenido`;

  constructor(private http: HttpClient) { }

  getAllContenido(): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(this.baseUrl);
  }

  getContenidoByModulo(id_modulo: number): Observable<Contenido[]> {
    return this.http.get<Contenido[]>(this.baseUrl).pipe(
      map(contenidos => contenidos.filter(contenido => contenido.id_modulo === id_modulo))
    );
  }

  getContenidoById(id: number): Observable<Contenido> {
    return this.http.get<Contenido>(`${this.baseUrl}/${id}`);
  }
}