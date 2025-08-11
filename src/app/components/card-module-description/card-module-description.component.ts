import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Contenido } from '../../models/contenido';
import { LikesService } from '../../services/likes/likes.service';
import { MercadoPagoService } from '../../services/mercadoPago/mercado-pago.service';
import { DonacionesService, CreateDonacionRequest } from '../../services/donaciones/donaciones.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-module-description',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-module-description.component.html',
  styleUrl: './card-module-description.component.css'
})
export class CardModuleDescriptionComponent implements OnInit {
  @Input() modulo: Contenido | null = null;
  
  safeVideoUrl: SafeResourceUrl | null = null;
  loading = false;
  error: string | null = null;
  cursoId: number | null = null;
  nombreCurso: string | null = null;

  likes: any[] = [];
  likesCount = 0;
  userHasLiked = false;
  loadingLikes = false;
  isUserAuthenticated = false;

  showMercadoPagoModal = false;
  selectedAmount = '50.00';
  customAmount: number | null = null;
  mercadoPagoLoaded = false;
  processingPayment = false;

  quickAmounts = [
    { value: '20.00', label: 'Un café ☕' },
    { value: '50.00', label: 'Desayuno 🥐' },
    { value: '100.00', label: 'Comida 🍕' },
    { value: '200.00', label: 'Cena 🍽️' },
    { value: '500.00', label: '¡Eres increíble! 🎉' },
    { value: '1000.00', label: '¡Súper apoyo! 🌟' }
  ];

  constructor(
    private likesService: LikesService,
    private mercadoPagoService: MercadoPagoService,
    private donacionesService: DonacionesService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMercadoPagoSDK();
    this.isUserAuthenticated = this.likesService.isUserAuthenticated();
    if (this.modulo) {
      this.cargarLikes(this.modulo.id_modulo);
      this.loadDonacionStats();
    }
  }

  ngOnChanges(): void {
    if (this.modulo) {
      this.cargarLikes(this.modulo.id_modulo);
      this.loadDonacionStats();
    }
  }

  cargarLikes(moduloId: number) {
    this.loadingLikes = true;

    this.likesService.getLikeCount(moduloId).subscribe({
      next: (response) => {
        this.likesCount = response.like_count;
        this.userHasLiked = response.user_liked;
        this.loadingLikes = false;
      },
      error: (err) => {
        console.error('Error al cargar likes:', err);
        this.loadingLikes = false;
      }
    });
  }

  loadDonacionStats(): void {
    if (!this.modulo) return;
    
    this.donacionesService.getStatsByModulo(this.modulo.id_modulo).subscribe({
      next: (stats) => {
      },
      error: (err) => {
        console.error('Error cargando estadísticas de donaciones:', err);
      }
    });
  }

  toggleLike() {
    if (!this.modulo || this.loadingLikes) return;

    if (!this.isUserAuthenticated) {
      this.showLoginRequired();
      return;
    }

    this.loadingLikes = true;
    const moduloId = this.modulo.id_modulo;

    this.likesService.toggleLike(moduloId).subscribe({
      next: (response) => {
        this.likesCount = response.like_count;
        this.userHasLiked = response.action === 'liked';
        this.loadingLikes = false;
      },
      error: (err) => {
        if (err.message?.includes('iniciar sesión')) {
          this.showLoginRequired();
        } else {
          alert('Error al cambiar el like');
        }
        this.loadingLikes = false;
      }
    });
  }

  showLoginRequired(): void {
    const shouldRedirect = confirm('Debes iniciar sesión para dar like. ¿Quieres ir a la página de login?');
    if (shouldRedirect) {
      this.router.navigate(['/login']);
    }
  }

  private async loadMercadoPagoSDK(): Promise<void> {
    try {
      await this.mercadoPagoService.loadMercadoPagoScript();
      this.mercadoPagoLoaded = true;
      console.log('MercadoPago SDK cargado exitosamente');
    } catch (error) {
      console.error('Error cargando MercadoPago SDK:', error);
    }
  }

  openMercadoPagoModal(): void {
    if (!this.isUserAuthenticated) {
      this.showLoginRequired();
      return;
    }

    if (!this.mercadoPagoLoaded) {
      alert('MercadoPago aún se está cargando, por favor espera un momento...');
      return;
    }
    
    this.showMercadoPagoModal = true;

    setTimeout(() => {
      this.renderMercadoPagoButton();
    }, 100);
  }

  closeMercadoPagoModal(): void {
    this.showMercadoPagoModal = false;
    this.selectedAmount = '50.00';
    this.customAmount = null;
    this.processingPayment = false;
  }

  private renderMercadoPagoButton(): void {
    const container = document.getElementById('mercadopago-button-container');
    if (container) {
      container.innerHTML = '';

      this.mercadoPagoService.createCustomDonationButton(
        'mercadopago-button-container', 
        this.finalAmount,
        this.modulo?.id_modulo,
        (paymentData) => this.handlePaymentSuccess(paymentData),
        (error) => this.handlePaymentError(error)
      ).then(() => {
        // Removido el setupTestDonationButton()
      }).catch(error => {
        this.renderFallbackButton();
      });
    }
  }

  private setupPaymentCallback(): void {
    // Configurar listener para el evento de pago exitoso de MercadoPago
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://www.mercadopago.com' && 
          event.origin !== 'https://www.mercadopago.com.mx') {
        return;
      }

      const paymentData = event.data;
      if (paymentData && paymentData.type === 'payment_success') {
        this.handlePaymentSuccess(paymentData);
      } else if (paymentData && paymentData.type === 'payment_error') {
        this.handlePaymentError(paymentData);
      }
    });
  }

  private handlePaymentSuccess(paymentData: any): void {
    if (!this.modulo || this.processingPayment) return;
    
    this.processingPayment = true;
    const userId = this.getUserId();

    if (!userId) {
      console.error('No se pudo obtener el ID del usuario');
      this.showPaymentError('Error: Usuario no identificado');
      this.processingPayment = false;
      return;
    }

    const donacionRequest: CreateDonacionRequest = {
      usuario_id: userId,
      modulo_id: this.modulo.id_modulo,
      monto: parseFloat(this.finalAmount),
      moneda: 'MXN',
      estado: paymentData.status === 'approved' ? 'completed' : 'pending',
      metodo_pago: paymentData.payment_method_id || 'mercadopago',
      transaction_id: paymentData.id?.toString(),
      payment_id: paymentData.payment_id?.toString()
    };

    this.donacionesService.createDonacion(donacionRequest).subscribe({
      next: (response) => {
        console.log('Donación registrada exitosamente:', response);
        this.showPaymentSuccess(response.donacion);
        this.loadDonacionStats();
        this.processingPayment = false;
        
        setTimeout(() => {
          this.closeMercadoPagoModal();
        }, 2000);
      },
      error: (err) => {
        console.error('Error registrando donación:', err);
        this.showPaymentError('Error registrando la donación');
        this.processingPayment = false;
      }
    });
  }

  private handlePaymentError(paymentData: any): void {
    console.error('Error en el pago:', paymentData);
    this.showPaymentError('El pago no pudo ser procesado');
    this.processingPayment = false;
  }

  private showPaymentSuccess(donacion: any): void {
    const message = `¡Gracias por tu donación de $${donacion.monto} ${donacion.moneda}! 
                    Tu apoyo es muy valioso. 🙏✨`;
    alert(message);
  }

  private showPaymentError(message: string): void {
    alert(`Error en el pago: ${message}. Por favor intenta nuevamente.`);
  }

  private getUserId(): number | null {
    // Implementar según tu sistema de autenticación
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        return user.id || user.usuario_id || null;
      } catch {
        return null;
      }
    }
    return null;
  }

  private renderFallbackButton(): void {
    const container = document.getElementById('mercadopago-button-container');
    if (container) {
      container.innerHTML = `
        <button class="mercadopago-fallback-btn" onclick="alert('MercadoPago no está disponible en este momento. Por favor intenta más tarde.')">
          <span>Donar ${this.finalAmount} MXN</span>
          <small>MercadoPago</small>
        </button>
      `;
    }
  }

  get finalAmount(): string {
    if (this.customAmount && this.customAmount >= 10) {
      return this.customAmount.toFixed(2);
    }
    return this.selectedAmount;
  }

  selectQuickAmount(amount: string): void {
    this.selectedAmount = amount;
    this.customAmount = null;
    setTimeout(() => {
      this.renderMercadoPagoButton();
    }, 50);
  }

  // Corregida la lógica del custom amount para que no convierta 10 en 100
  onCustomAmountChange(): void {
    if (this.customAmount !== null && this.customAmount >= 10 && this.customAmount <= 10000) {
      this.selectedAmount = this.customAmount.toFixed(2);
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    } else if (this.customAmount !== null && this.customAmount < 10) {
      // Solo establecer el mínimo si el usuario ingresó algo menor a 10
      this.customAmount = 10;
      this.selectedAmount = '10.00';
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    } else if (this.customAmount !== null && this.customAmount > 10000) {
      this.customAmount = 10000;
      this.selectedAmount = '10000.00';
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    }
  }

  getDonacionesByCurrentModule(): void {
    if (!this.modulo) return;

    this.donacionesService.getDonacionesByModulo(this.modulo.id_modulo).subscribe({
      next: (donaciones) => {
        console.log('Donaciones del módulo:', donaciones);
      },
      error: (err) => {
        console.error('Error obteniendo donaciones del módulo:', err);
      }
    });
  }
}