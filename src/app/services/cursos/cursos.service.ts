import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Curso } from '../../models/curso';

interface TotalCursosResponse {
  message: string;
  total_cursos: number;
}
@Injectable({
  providedIn: 'root'
})
export class CursosService {
  private apiUrl = 'http://localhost:8080/cursos';

  constructor(private http: HttpClient) {}

  getCursos(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.apiUrl);
  }

  getCursoById(id: number): Observable<Curso> {
    const params = new HttpParams().set('id', id.toString());
    return this.http.get<Curso>(this.apiUrl, { params });
  }

  getTotalCursos(): Observable<TotalCursosResponse> {
    return this.http.get<TotalCursosResponse>(`${this.apiUrl}/total`);
  }
  
  searchCursosByNombre(nombre: string): Observable<Curso[]> {
    const params = new HttpParams().set('nombre', nombre);
    return this.http.get<Curso[]>(this.apiUrl, { params });
  }

  createCurso(curso: Omit<Curso, 'id'>): Observable<Curso> {
    return this.http.post<Curso>(this.apiUrl, curso);
  }

  updateCurso(curso: Curso): Observable<Curso> {
    return this.http.put<Curso>(`${this.apiUrl}/${curso.id}`, curso);
  }

  deleteCurso(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}