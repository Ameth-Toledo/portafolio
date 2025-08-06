import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterService } from '../../services/register/register.service'; // Ajusta la ruta según tu estructura
import { Router } from '@angular/router';

interface RegisterData {
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string;
  email: string;
  password: string;
  rol_id: number;
  avatar: number;
}

interface Avatar {
  id: number;
  name: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: RegisterData = {
    nombres: '',
    apellido_paterno: '',
    apellido_materno: '',
    email: '',
    password: '',
    rol_id: 2, 
    avatar: 1
  };

  showPassword: boolean = false;
  isLoading: boolean = false;
  showSuccessModal: boolean = false;
  registeredUserName: string = '';

  avatars: Avatar[] = [
    { id: 1, name: 'Avatar 1' },
    { id: 2, name: 'Avatar 2' },
    { id: 3, name: 'Avatar 3' },
    { id: 4, name: 'Avatar 4' },
    { id: 5, name: 'Avatar 5' }
  ];

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  selectAvatar(avatarId: number) {
    this.registerData.avatar = avatarId;
  }

  getPasswordStrengthClass(): string {
    const password = this.registerData.password;
    if (!password) return '';
    
    if (password.length < 6) return 'weak';
    if (password.length < 10) return 'medium';
    return 'strong';
  }

  getPasswordStrengthText(): string {
    const password = this.registerData.password;
    if (!password) return '';
    
    if (password.length < 6) return 'Débil';
    if (password.length < 10) return 'Media';
    return 'Fuerte';
  }

  validateForm(): boolean {
    const { nombres, apellido_paterno, apellido_materno, email, password } = this.registerData;
    
    if (!nombres.trim()) {
      alert('Por favor, ingresa tus nombres');
      return false;
    }
    
    if (!apellido_paterno.trim()) {
      alert('Por favor, ingresa tu apellido paterno');
      return false;
    }
    
    if (!apellido_materno.trim()) {
      alert('Por favor, ingresa tu apellido materno');
      return false;
    }
    
    if (!email.trim()) {
      alert('Por favor, ingresa tu correo electrónico');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Por favor, ingresa un correo electrónico válido');
      return false;
    }
    
    if (!password) {
      alert('Por favor, ingresa una contraseña');
      return false;
    }
    
    if (password.length < 8) {
      alert('La contraseña debe tener al menos 8 caracteres');
      return false;
    }
    
    return true;
  }

  onRegister() {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    const registerPayload = {
      ...this.registerData
    };

    // Llamada a la API
    this.registerService.register(registerPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Respuesta de la API:', response);
        
        // Si llegamos aquí, el registro fue exitoso (código 201)
        // Crear nombre completo para mostrar en la modal
        this.registeredUserName = `${this.registerData.nombres} ${this.registerData.apellido_paterno} ${this.registerData.apellido_materno}`;
        this.showSuccessModal = true;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error en el registro:', error);
        
        // Manejar diferentes tipos de errores
        if (error.status === 400) {
          alert('Datos inválidos. Por favor, verifica la información ingresada.');
        } else if (error.status === 409) {
          alert('El correo electrónico ya está registrado.');
        } else if (error.status === 500) {
          alert('Error en el servidor. Por favor, intenta más tarde.');
        } else {
          alert('Error de conexión. Por favor, verifica tu conexión a internet.');
        }
      }
    });
  }

  closeSuccessModal() {
    this.showSuccessModal = false;
    // Opcional: redirigir al login después de cerrar la modal
    this.router.navigate(['/login']);
  }

  onLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}