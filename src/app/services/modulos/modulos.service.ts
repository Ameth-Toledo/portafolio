import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../../models/modulo';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {
  private apiUrl = 'https://amethdev-api.vercel.app/api/modulos';

  constructor(private http: HttpClient) {}

  getModulos(): Observable<Modulo[]> {
    return this.http.get<Modulo[]>(this.apiUrl);
  }

  getModuloById(id: number): Observable<Modulo> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Modulo>(this.apiUrl, { params });
  }

  getModulosByCursoId(cursoId: number): Observable<Modulo[]> {
    const params = new HttpParams().set('id_curso', cursoId.toString());
    return this.http.get<Modulo[]>(this.apiUrl, { params });
  }

  searchModulosByNombre(nombre: string): Observable<Modulo[]> {
    const params = new HttpParams().set('titulo', nombre);
    return this.http.get<Modulo[]>(this.apiUrl, { params });
  }

  searchModulosByNombreAndCurso(nombre: string, cursoId: number): Observable<Modulo[]> {
    const params = new HttpParams()
      .set('titulo', nombre)
      .set('id_curso', cursoId.toString());
    return this.http.get<Modulo[]>(this.apiUrl, { params });
  }
}