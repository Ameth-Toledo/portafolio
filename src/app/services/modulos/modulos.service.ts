import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Modulo } from '../../models/modulo';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  private apiUrl = `${environment.apiUrl}/modulos`;

  constructor(private http: HttpClient) { }

  createModulo(moduloData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, moduloData);
  }

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

  updateModulo(modulo: any): Observable<any> {
    const { id, ...moduloData } = modulo;
    return this.http.put<any>(`${this.apiUrl}/${id}`, moduloData);
  }

  deleteModulo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}