import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../../models/curso';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = 'https://amethdev-api.vercel.app/api/cursos';

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  getCursoById(id: number): Observable<Curso> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Curso>(this.apiUrl, { params });
  }

  searchCursosByNombre(nombre: string): Observable<Curso[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Curso[]>(this.apiUrl, { params });
  }
}
