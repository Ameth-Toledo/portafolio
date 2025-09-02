import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UsersService } from '../../services/users/users.service';
import { Subscription } from 'rxjs';

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
  
  isAuthenticated = false;
  userProfile: UserProfile | null = null;
  showUserMenu = false;
  
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
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
      if (user && user.userId) {
        this.loadUserProfile(user.userId);
      } else {
        this.userProfile = null;
      }
    });
    
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
  }

  private handleOutsideClick(event: Event) {
    const target = event.target as HTMLElement;
    const userContainer = target.closest('.user-profile-container');
    
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
  }

  onLogout() {
    this.authService.logout();
    this.showUserMenu = false;
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
}