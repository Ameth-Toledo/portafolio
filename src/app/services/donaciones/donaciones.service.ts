import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Donacion {
  id?: number;
  usuario_id: number;
  modulo_id: number;
  monto: number;
  moneda: string;
  estado: string;
  metodo_pago: string;
  transaction_id: string;
  payment_id: string;
  fecha_pago: string;
  
  // Campos adicionales para mostrar nombres
  usuario_nombre?: string;
  usuario_apellidos?: string;
  modulo_titulo?: string;
  curso_nombre?: string;
}

export interface CreateDonacionRequest {
  usuario_id: number;
  modulo_id: number;
  monto: number;
  moneda?: string;
  estado: string;
  metodo_pago?: string;
  transaction_id?: string;
  payment_id?: string;
}

export interface DonacionResponse {
  message: string;
  donacion: Donacion;
}

export interface StatsResponse {
  total_donaciones: number;
  total_monto: number;
  promedio_donacion: number;
  donaciones_por_mes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DonacionesService {
  private readonly apiUrl = `${environment.apiUrl}/donaciones`;
  private readonly statsUrl = `${environment.apiUrl}/stats/donaciones`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    });
  }

  // Crear donación
  createDonacion(donacionData: CreateDonacionRequest): Observable<DonacionResponse> {
    return this.http.post<DonacionResponse>(this.apiUrl, donacionData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener todas las donaciones
  getAllDonaciones(): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener donación por ID
  getDonacionById(id: number): Observable<Donacion> {
    return this.http.get<Donacion>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener donaciones por usuario
  getDonacionesByUsuario(usuarioId: number): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.apiUrl}/usuario/${usuarioId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener donaciones por módulo
  getDonacionesByModulo(moduloId: number): Observable<Donacion[]> {
    return this.http.get<Donacion[]>(`${this.apiUrl}/modulo/${moduloId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener total de donaciones
  getTotalDonaciones(): Observable<{ total: number; amount: number }> {
    return this.http.get<{ total: number; amount: number }>(`${this.apiUrl}/total`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar donación
  updateDonacion(id: number, donacionData: Partial<Donacion>): Observable<DonacionResponse> {
    return this.http.put<DonacionResponse>(`${this.apiUrl}/${id}`, donacionData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar donación
  deleteDonacion(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener estadísticas por usuario
  getStatsByUsuario(usuarioId: number): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.statsUrl}/usuario/${usuarioId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener estadísticas por módulo
  getStatsByModulo(moduloId: number): Observable<StatsResponse> {
    return this.http.get<StatsResponse>(`${this.statsUrl}/modulo/${moduloId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  // Método helper para crear donación desde el pago exitoso
  createDonacionFromPayment(
    usuarioId: number,
    moduloId: number,
    amount: string,
    paymentData: any
  ): Observable<DonacionResponse> {
    const donacionData: CreateDonacionRequest = {
      usuario_id: usuarioId,
      modulo_id: moduloId,
      monto: parseFloat(amount),
      moneda: 'MXN',
      estado: paymentData.status || 'pending',
      metodo_pago: paymentData.payment_method_id || 'mercadopago',
      transaction_id: paymentData.id?.toString(),
      payment_id: paymentData.payment_id?.toString()
    };

    return this.createDonacion(donacionData);
  }

  validatePaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/validate-payment/${paymentId}`, {
      headers: this.getHeaders()
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en DonacionesService:', error);
    let errorMessage = 'Error desconocido';
    
    if (error.error?.error) {
      errorMessage = error.error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}