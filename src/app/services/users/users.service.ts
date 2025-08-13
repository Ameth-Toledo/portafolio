import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environment';

interface UserProfile {
  id: number;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  avatar: number;
  rol_id: number;
  fecha_registro: string;
}

interface UserProfileResponse {
  user: UserProfile;
}

interface AllUsersResponse {
  total: number;
  users: UserProfile[];
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getHeaders(): HttpHeaders {
    const user = this.authService.getCurrentUser();
    const token = user?.token || '';

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getUserProfile(userId: number): Observable<UserProfileResponse> {
    const headers = this.getHeaders();
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/${userId}`, { headers });
  }

  getAllUsers(): Observable<UserProfile[]> {
    const headers = this.getHeaders();
    return this.http.get<AllUsersResponse>(`${this.apiUrl}`, { headers })
      .pipe(map(response => response.users));
  }

  getUsersByRole(rolId: number): Observable<UserProfile[]> {
    return this.getAllUsers().pipe(
      map(users => users.filter(user => user.rol_id === rolId))
    );
  }

  deleteUser(userId: number): Observable<void> {
    const headers = this.getHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${userId}`, { headers });
  }

  updateUserProfile(userId: number, userData: UserProfile): Observable<UserProfileResponse> {
    const headers = this.getHeaders();
    return this.http.put<UserProfileResponse>(`${this.apiUrl}/${userId}`, userData, { headers });
  }
}