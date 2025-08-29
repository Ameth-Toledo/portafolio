import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NotificationMessage {
  type: string;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private websocket?: WebSocket;
  private notificationsSubject = new BehaviorSubject<NotificationMessage | null>(null);
  private connectionStatusSubject = new BehaviorSubject<boolean>(false);

  public notifications$: Observable<NotificationMessage | null> = this.notificationsSubject.asObservable();
  public connectionStatus$: Observable<boolean> = this.connectionStatusSubject.asObservable();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const wsUrl = environment.wsUrl || 'ws://localhost:8080/ws/notifications';
    
    try {
      this.websocket = new WebSocket(wsUrl);
      
      this.websocket.onopen = () => {
        console.log('WebSocket conectado');
        this.connectionStatusSubject.next(true);
      };

      this.websocket.onmessage = (event) => {
        try {
          const notification: NotificationMessage = JSON.parse(event.data);
          console.log('Notificación recibida:', notification);
          this.notificationsSubject.next(notification);
        } catch (error) {
          console.error('Error al parsear notificación:', error);
        }
      };

      this.websocket.onclose = () => {
        console.log('WebSocket desconectado');
        this.connectionStatusSubject.next(false);
        // Reconectar después de 3 segundos
        setTimeout(() => this.connect(), 3000);
      };

      this.websocket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
        this.connectionStatusSubject.next(false);
      };

    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      this.connectionStatusSubject.next(false);
    }
  }

  public disconnect(): void {
    if (this.websocket) {
      this.websocket.close();
    }
  }

  public clearNotifications(): void {
    this.notificationsSubject.next(null);
  }
}