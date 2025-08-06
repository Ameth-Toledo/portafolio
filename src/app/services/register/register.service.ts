import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface RegisterData {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  rol_id: number;
  avatar: number;
}

interface RegisterResponse {
  message?: string;
  data?: any;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) { }

  register(userData: RegisterData): Observable<RegisterResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<RegisterResponse>(this.apiUrl, userData, { headers });
  }
}