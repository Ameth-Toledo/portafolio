import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    email: string;
    name: string;
    token: string;
    userId: number;
  };
  message: string;
}

interface User {
  email: string;
  name: string;
  userId: number;
  token: string;
  rol_id: number;
}

interface JWTPayload {
  user_id: number;
  email: string;
  rol_id?: number; 
  exp: number;
  iat?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth() {
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        console.log('Usuario recuperado del almacenamiento:', userData);
        this.currentUserSubject.next(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        this.clearStoredAuth();
      }
    }
  }

  private clearStoredAuth() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
  }

  private decodeJWT(token: string): JWTPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Token JWT inválido');
        return null;
      }

      const payload = parts[1];
      
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64 + '=='.substring(0, (3 * base64.length) % 4);
      
      const decodedPayload = atob(paddedBase64);
      
      const jwtData = JSON.parse(decodedPayload) as JWTPayload;
      
      console.log('JWT decodificado:', jwtData);
      return jwtData;
    } catch (error) {
      console.error('Error decodificando JWT:', error);
      return null;
    }
  }

  login(loginData: LoginData): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData, { headers });
  }

  processLoginResponse(response: LoginResponse): User | null {
    console.log('Procesando respuesta de login:', response);

    if (!response.data || !response.data.token) {
      console.error('Respuesta de login inválida');
      return null;
    }

    const jwtPayload = this.decodeJWT(response.data.token);
    
    if (!jwtPayload) {
      console.error('No se pudo decodificar el JWT');
      return null;
    }

    let rolId: number;
    
    if (jwtPayload.rol_id) {
      rolId = jwtPayload.rol_id;
      console.log('Rol extraído del JWT:', rolId);
    } else {
      console.log('JWT payload completo:', jwtPayload);
      console.log('user_id del JWT:', jwtPayload.user_id);
      console.log('userId del response:', response.data.userId);
      
      if (jwtPayload.user_id === 1) {
        rolId = 1; 
        console.log('Rol determinado por user_id=1 (admin):', rolId);
      } else {
        rolId = 2;
        console.log('Rol determinado por defecto (usuario):', rolId);
      }
    }

    const userData: User = {
      email: response.data.email,
      name: response.data.name,
      userId: response.data.userId,
      token: response.data.token,
      rol_id: rolId
    };

    console.log('Datos de usuario procesados finales:', userData);
    return userData;
  }

  saveUserData(userData: User, rememberMe: boolean = false) {
    console.log('Guardando datos de usuario:', userData);
    
    if (!userData.token) {
      console.error('Intento de guardar usuario sin token');
      return;
    }
    
    this.currentUserSubject.next(userData);
    this.clearStoredAuth();
    
    if (rememberMe) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('Usuario guardado en localStorage');
    } else {
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('Usuario guardado en sessionStorage');
    }
  }

  logout() {
    console.log('Cerrando sesión');
    this.currentUserSubject.next(null);
    this.clearStoredAuth();
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    return user;
  }

  isAuthenticated(): boolean {
    const user = this.getCurrentUser();
    const isAuth = user !== null && !!user.token;
    console.log('isAuthenticated():', isAuth);
    return isAuth;
  }

  getUserRole(): number | null {
    const user = this.getCurrentUser();
    console.log('getUserRole() - Usuario actual:', user);
    const role = user ? user.rol_id : null;
    console.log('getUserRole() retorna:', role);
    return role;
  }

  getRedirectUrl(): string {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('getRedirectUrl() - No hay usuario, redirigiendo a login');
      return '/login';
    }
    
    console.log('getRedirectUrl() - Determinando redirección para rol:', user.rol_id);
    
    switch (user.rol_id) {
      case 1:
        console.log('getRedirectUrl() - Redirigiendo a dashboard (admin)');
        return '/dashboard/inicio';
      case 2:
        console.log('getRedirectUrl() - Redirigiendo a blog (usuario)');
        return '/blog';      
      default:
        console.log('getRedirectUrl() - Rol desconocido, redirigiendo a blog');
        return '/blog';   
    }
  }

  updateToken(newToken: string) {
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, token: newToken };
      const inLocalStorage = !!localStorage.getItem('currentUser');
      
      this.currentUserSubject.next(updatedUser);
      
      if (inLocalStorage) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      } else {
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getCurrentUser()?.token;
    if (!tokenToCheck) return true;

    const jwtPayload = this.decodeJWT(tokenToCheck);
    if (!jwtPayload || !jwtPayload.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return jwtPayload.exp < currentTime;
  }
}