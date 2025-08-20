import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  showPassword: boolean = false;
  isLoading: boolean = false;
  
  showSuccessModal: boolean = false;
  showErrorModal: boolean = false;
  
  successMessage: string = '';
  errorMessage: string = '';
  loggedUserName: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadSavedCredentials();
  }

  private loadSavedCredentials() {
    try {
      const savedCredentials = localStorage.getItem('savedCredentials');
      
      if (savedCredentials) {
        const credentials = JSON.parse(savedCredentials);
        
        if (credentials.email && credentials.password) {
          this.email = credentials.email;
          this.password = credentials.password;
          this.rememberMe = true;
          
          console.log('Credenciales cargadas desde localStorage');
        }
      }
    } catch (error) {
      console.error('Error al cargar credenciales guardadas:', error);
      localStorage.removeItem('savedCredentials');
    }
  }

  private saveCredentials() {
    if (this.rememberMe) {
      try {
        const credentials = {
          email: this.email,
          password: this.password
        };
        
        localStorage.setItem('savedCredentials', JSON.stringify(credentials));
        console.log('Credenciales guardadas en localStorage');
      } catch (error) {
        console.error('Error al guardar credenciales:', error);
      }
    } else {
      localStorage.removeItem('savedCredentials');
      console.log('Credenciales eliminadas del localStorage');
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateForm(): boolean {
    if (!this.email.trim()) {
      this.showError('Por favor, ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.showError('Por favor, ingresa un correo electrónico válido');
      return false;
    }

    if (!this.password) {
      this.showError('Por favor, ingresa tu contraseña');
      return false;
    }

    if (this.password.length < 6) {
      this.showError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    return true;
  }

  onLogin() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta completa del login:', response);
        
        const userData = this.authService.processLoginResponse(response);
        
        if (!userData) {
          this.showError('Error procesando la respuesta del servidor');
          return;
        }

        this.saveCredentials();
        
        this.authService.saveUserData(userData, this.rememberMe);
        
        this.loggedUserName = userData.name;
        this.successMessage = `¡Bienvenido/a de nuevo ${this.loggedUserName}!`;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en el login:', error);
        this.handleLoginError(error);
      }
    });
  }

  onRememberMeChange() {
    if (!this.rememberMe) {
      localStorage.removeItem('savedCredentials');
      console.log('Credenciales eliminadas por desmarcado de recordarme');
    }
  }

  private handleLoginError(error: any) {
    if (error.status === 401) {
      this.showError('Credenciales incorrectas. Verifica tu email y contraseña.');
    } else if (error.status === 404) {
      this.showError('Usuario no encontrado. ¿Ya tienes una cuenta registrada?');
    } else if (error.status === 429) {
      this.showError('Demasiados intentos fallidos. Intenta más tarde.');
    } else if (error.status === 500) {
      this.showError('Error en el servidor. Por favor, intenta más tarde.');
    } else {
      this.showError('Error de conexión. Verifica tu conexión a internet.');
    }
  }

  showError(message: string) {
    this.errorMessage = message;
    this.showErrorModal = true;
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    
    const currentUser = this.authService.getCurrentUser();
    console.log('Usuario antes de redirigir:', currentUser);
    
    if (!currentUser) {
      console.error('No hay usuario logueado para redirigir');
      this.showError('Error en el estado de autenticación');
      return;
    }
    
    const redirectUrl = this.authService.getRedirectUrl();
    console.log('URL de redirección:', redirectUrl);
    
    this.router.navigate([redirectUrl]);
  }

  closeErrorModal() {
    this.showErrorModal = false;
  }

  onRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['register']);
  }

  clearSavedCredentials() {
    localStorage.removeItem('savedCredentials');
    this.email = '';
    this.password = '';
    this.rememberMe = false;
    console.log('Credenciales limpiadas manualmente');
  }
}