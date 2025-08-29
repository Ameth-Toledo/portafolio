import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { Subscription } from 'rxjs';
import { Curso } from '../../models/curso';

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

interface NotificationData {
  titulo: string;
  mensaje: string;
  curso?: Curso;
}

interface StoredNotification {
  id: string;
  titulo: string;
  mensaje: string;
  curso?: Curso;
  timestamp: Date;
  read: boolean;
}

@Component({
  selector: 'app-header-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-blog.component.html',
  styleUrl: './header-blog.component.css'
})
export class HeaderBlogComponent implements OnInit, OnDestroy {
  @Output() buscar = new EventEmitter<string>();
  terminoBusqueda: string = '';
  isListening = false;
  recognition: any;
  
  // Propiedades para el usuario autenticado
  isAuthenticated = false;
  userProfile: UserProfile | null = null;
  showUserMenu = false;
  
  // Propiedades para las notificaciones
  showNotification: boolean = false;
  notificationData: NotificationData | null = null;
  showNotificationPanel: boolean = false;
  notificationHistory: StoredNotification[] = [];
  hasUnreadNotifications: boolean = false;
  unreadCount: number = 0;
  
  private authSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    const { webkitSpeechRecognition } = window as any;
    if (webkitSpeechRecognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.terminoBusqueda = transcript;
        this.onBuscar();
        this.isListening = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  ngOnInit() {
    // Suscribirse a los cambios de autenticación
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user && user.userId) {
        this.loadUserProfile(user.userId);
        this.loadNotificationHistory();
      } else {
        this.userProfile = null;
        this.clearNotificationHistory();
      }
    });

    // Cargar historial de notificaciones al inicializar
    this.loadNotificationHistory();
    
    // Escuchar clicks fuera del panel para cerrarlo
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  private handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.notification-bell-container');
    const userContainer = target.closest('.user-profile-container');
    
    if (!notificationContainer && this.showNotificationPanel) {
      this.showNotificationPanel = false;
    }
    
    if (!userContainer && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  loadUserProfile(userId: number) {
    this.usersService.getUserProfile(userId).subscribe({
      next: (response) => {
        this.userProfile = response.user;
      },
      error: (error) => {
        console.error('Error al cargar el perfil del usuario:', error);
      }
    });
  }

  getAvatarPath(): string {
    if (this.userProfile && this.userProfile.avatar) {
      return `avatares/${this.userProfile.avatar}.png`;
    }
    return 'avatares/1.png';
  }

  getUserDisplayName(): string {
    if (this.userProfile) {
      return this.userProfile.nombres;
    }
    return '';
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu && this.showNotificationPanel) {
      this.showNotificationPanel = false;
    }
  }

  onLogout() {
    this.authService.logout();
    this.showUserMenu = false;
    this.clearNotificationHistory();
    this.router.navigate(['/blog']);
  }

  onProfile() {
    this.showUserMenu = false;
    this.router.navigate(['/perfil']);
  }

  onBuscar() {
    this.buscar.emit(this.terminoBusqueda);
  }

  toggleVoiceRecognition(): void {
    if (!this.recognition) {
      console.warn('Reconocimiento de voz no disponible');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.start();
      this.isListening = true;
    }
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['login']);
  }

  // Métodos para las notificaciones

  /**
   * Muestra una notificación WebSocket y la agrega al historial
   */
  showWebSocketNotification(data: NotificationData) {
    // Mostrar toast de notificación
    this.notificationData = data;
    this.showNotification = true;
    
    // Agregar al historial
    const newNotification: StoredNotification = {
      id: this.generateNotificationId(),
      titulo: data.titulo,
      mensaje: data.mensaje,
      curso: data.curso,
      timestamp: new Date(),
      read: false
    };
    
    this.notificationHistory.unshift(newNotification);
    this.saveNotificationHistory();
    this.updateNotificationCounts();
    
    // Auto-ocultar toast después de 5 segundos
    setTimeout(() => {
      this.hideNotification();
    }, 5000);
  }

  /**
   * Oculta la notificación toast
   */
  hideNotification() {
    this.showNotification = false;
    this.notificationData = null;
  }

  /**
   * Toggle del panel de notificaciones
   */
  toggleNotificationPanel() {
    this.showNotificationPanel = !this.showNotificationPanel;
    if (this.showNotificationPanel && this.showUserMenu) {
      this.showUserMenu = false;
    }
  }

  /**
   * Marca una notificación como leída
   */
  markAsRead(notificationId: string) {
    const notification = this.notificationHistory.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.saveNotificationHistory();
      this.updateNotificationCounts();
    }
  }

  /**
   * Limpia todas las notificaciones
   */
  clearAllNotifications() {
    this.notificationHistory = [];
    this.saveNotificationHistory();
    this.updateNotificationCounts();
  }

  /**
   * Actualiza los contadores de notificaciones
   */
  private updateNotificationCounts() {
    this.unreadCount = this.notificationHistory.filter(n => !n.read).length;
    this.hasUnreadNotifications = this.unreadCount > 0;
  }

  /**
   * Genera un ID único para las notificaciones
   */
  private generateNotificationId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Guarda el historial de notificaciones en localStorage
   */
  private saveNotificationHistory() {
    if (!this.isAuthenticated || !this.userProfile) return;
    
    const key = `notifications_${this.userProfile.id}`;
    const notificationsToSave = this.notificationHistory.slice(0, 50); // Mantener solo las últimas 50
    localStorage.setItem(key, JSON.stringify(notificationsToSave));
  }

  /**
   * Carga el historial de notificaciones desde localStorage
   */
  private loadNotificationHistory() {
    if (!this.isAuthenticated || !this.userProfile) return;
    
    const key = `notifications_${this.userProfile.id}`;
    const stored = localStorage.getItem(key);
    
    if (stored) {
      try {
        this.notificationHistory = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        this.updateNotificationCounts();
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
        this.notificationHistory = [];
      }
    } else {
      this.notificationHistory = [];
    }
  }

  /**
   * Limpia el historial de notificaciones
   */
  private clearNotificationHistory() {
    this.notificationHistory = [];
    this.hasUnreadNotifications = false;
    this.unreadCount = 0;
    this.showNotificationPanel = false;
  }

  /**
   * Obtiene el tiempo transcurrido desde una notificación
   */
  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return timestamp.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    });
  }

  /**
   * TrackBy function para el ngFor de notificaciones
   */
  trackByNotificationId(index: number, notification: StoredNotification): string {
    return notification.id;
  }
}