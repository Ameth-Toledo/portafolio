import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { DonacionesService } from '../donaciones/donaciones.service';

declare global {
  interface Window {
    MercadoPago: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MercadoPagoService {
  private mp: any;
  private isInitialized = false;

  constructor(private donacionesService: DonacionesService) { }

  loadMercadoPagoScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.MercadoPago && this.isInitialized) {
        console.log('MercadoPago ya está cargado e inicializado');
        resolve();
        return;
      }

      if (window.MercadoPago && !this.isInitialized) {
        this.initializeMercadoPago();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.onload = () => {
        console.log('SDK de MercadoPago cargado desde script');
        this.initializeMercadoPago();
        resolve();
      };
      script.onerror = () => {
        console.error('Error al cargar MercadoPago SDK');
        reject('Error al cargar MercadoPago SDK');
      };
      document.head.appendChild(script);
    });
  }

  private initializeMercadoPago(): void {
    try {
      if (!environment.mercadoPago?.publicKey) {
        console.error('No se encontró la clave pública de MercadoPago en environment');
        return;
      }

      this.mp = new window.MercadoPago(environment.mercadoPago.publicKey, {
        locale: 'es-MX'
      });
      
      this.isInitialized = true;
      console.log('MercadoPago inicializado correctamente');
    } catch (error) {
      console.error('Error inicializando MercadoPago:', error);
    }
  }

  async createCustomDonationButton(
    containerId: string, 
    amount: string = '50.00',
    moduloId?: number,
    onSuccess?: (paymentData: any) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    try {
      console.log('Creando botón personalizado de MercadoPago para:', amount);
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Contenedor no encontrado:', containerId);
        return;
      }

      container.innerHTML = '';
      this.showLoadingButton(container);

      if (!window.MercadoPago || !this.isInitialized) {
        console.log('MercadoPago no disponible, creando opciones alternativas');
        this.createPaymentOptionsButton(container, amount, moduloId, onSuccess, onError);
        return;
      }

      if (environment.mercadoPago?.accessToken) {
        try {
          const preferenceId = await this.createDonationPreference(amount, moduloId);
          this.createPreferenceButton(container, preferenceId, amount, moduloId, onSuccess, onError);
        } catch (error) {
          console.error('Error creando preferencia:', error);
          this.createPaymentOptionsButton(container, amount, moduloId, onSuccess, onError);
        }
      } else {
        console.log('No hay access token, creando opciones de pago');
        this.createPaymentOptionsButton(container, amount, moduloId, onSuccess, onError);
      }

      this.addCustomButtonStyles();
      
    } catch (error) {
      console.error('Error creating custom MercadoPago button:', error);
      this.createFallbackButton(containerId, amount);
    }
  }

  private showLoadingButton(container: HTMLElement): void {
    container.innerHTML = `
      <div class="mercadopago-button-container">
        <div class="mp-loading-button">
          <div class="mp-spinner"></div>
          <span>Cargando opciones de pago...</span>
        </div>
      </div>
    `;
  }

  private async createDonationPreference(amount: string, moduloId?: number): Promise<string> {
    const timestamp = Date.now();
    const randomId = Math.floor(Math.random() * 1000);
    
    const preferenceData = {
      items: [
        {
          title: `Donación de apoyo - $${amount} MXN`,
          description: moduloId ? `Apoyo al módulo ${moduloId}` : 'Donación general de apoyo',
          quantity: 1,
          currency_id: 'MXN',
          unit_price: parseFloat(amount)
        }
      ],
      payer: {
        email: 'shakerzest@gmail.com',
        name: 'Donador',
        surname: 'Anónimo'
      },
      external_reference: `donation-${timestamp}-${randomId}`,
      statement_descriptor: 'DONACION APOYO',
      payment_methods: {
        excluded_payment_methods: [], 
        excluded_payment_types: [],   
        installments: 12              
      },
      notification_url: `${environment.apiUrl}/webhooks/mercadopago`,
      metadata: {
        modulo_id: moduloId?.toString() || '',
        donation_type: 'support'
      },
      expires: false,
      binary_mode: false
    };

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${environment.mercadoPago.accessToken}`
      },
      body: JSON.stringify(preferenceData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response from MercadoPago:', errorData);
      throw new Error(`Error creating preference: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const preference = await response.json();
    console.log('Preferencia creada exitosamente:', preference.id);
    return preference.id;
  }

  private createPreferenceButton(
    container: HTMLElement, 
    preferenceId: string, 
    amount: string,
    moduloId?: number,
    onSuccess?: (paymentData: any) => void,
    onError?: (error: any) => void
  ): void {
    const checkoutUrl = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${preferenceId}`;
    
    container.innerHTML = `
      <div class="mercadopago-button-container">
        <button class="mercadopago-donation-btn primary" id="mp-donation-btn">
          <div class="mp-button-content">
            <div class="mp-logo">
              <svg class="mp-icon" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 65c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z"/>
                <circle cx="50" cy="50" r="15"/>
              </svg>
            </div>
            <div class="mp-text-content">
              <span class="mp-button-text">Donar $${amount} MXN</span>
              <span class="mp-subtitle">con MercadoPago</span>
            </div>
          </div>
          <div class="mp-payment-methods">
            <span class="mp-method">💳 Tarjeta</span>
            <span class="mp-method">🏪 OXXO</span>
            <span class="mp-method">🏦 Transferencia</span>
            <span class="mp-method">📱 Pagos digitales</span>
          </div>
        </button>
        
        ${this.createAlternativeOptions(amount)}
        
        <div class="mp-security">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <circle cx="12" cy="16" r="1"></circle>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Pago 100% seguro</span>
        </div>
      </div>
    `;

    // Agregar evento click al botón
    const donationBtn = document.getElementById('mp-donation-btn');
    if (donationBtn) {
      donationBtn.addEventListener('click', () => {
        this.openPaymentWindow(checkoutUrl, preferenceId, moduloId, onSuccess, onError);
      });
    }
  }

  private openPaymentWindow(
    checkoutUrl: string, 
    preferenceId: string, 
    moduloId?: number,
    onSuccess?: (paymentData: any) => void,
    onError?: (error: any) => void
  ): void {
    const paymentWindow = window.open(
      checkoutUrl, 
      'mercadopago_payment', 
      'width=800,height=600,scrollbars=yes,resizable=yes'
    );

    if (!paymentWindow) {
      alert('Por favor permite las ventanas emergentes para completar el pago');
      return;
    }

    // Verificar el estado del pago periódicamente
    const checkPaymentStatus = setInterval(() => {
      if (paymentWindow.closed) {
        clearInterval(checkPaymentStatus);
        this.checkPaymentResult(preferenceId, moduloId, onSuccess, onError);
      }
    }, 1000);

    // Timeout después de 10 minutos
    setTimeout(() => {
      if (!paymentWindow.closed) {
        clearInterval(checkPaymentStatus);
        paymentWindow.close();
        if (onError) {
          onError({ message: 'Tiempo de pago agotado' });
        }
      }
    }, 600000);
  }

  private async checkPaymentResult(
    preferenceId: string,
    moduloId?: number,
    onSuccess?: (paymentData: any) => void,
    onError?: (error: any) => void
  ) {
    try {
      // Aquí deberías hacer una llamada a tu backend para verificar el estado del pago
      // usando el preferenceId con la API de MercadoPago
      const response = await fetch(`${environment.apiUrl}/payments/check-status/${preferenceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const paymentData = await response.json();
        if (paymentData.status === 'approved') {
          if (onSuccess) {
            onSuccess(paymentData);
          }
        } else if (paymentData.status === 'rejected' || paymentData.status === 'cancelled') {
          if (onError) {
            onError({ message: 'Pago rechazado o cancelado' });
          }
        }
      }
    } catch (error) {
      console.error('Error verificando estado del pago:', error);
      if (onError) {
        onError(error);
      }
    }
  }

  private createPaymentOptionsButton(
    container: HTMLElement, 
    amount: string,
    moduloId?: number,
    onSuccess?: (paymentData: any) => void,
    onError?: (error: any) => void
  ): void {
    container.innerHTML = `
      <div class="mercadopago-button-container">
        <div class="payment-options-title">
          <h4>Opciones de donación - ${amount} MXN</h4>
        </div>
        
        <button class="mercadopago-donation-btn primary" id="mp-generic-btn">
          <div class="mp-button-content">
            <div class="mp-logo">
              <svg class="mp-icon" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 65c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z"/>
                <circle cx="50" cy="50" r="15"/>
              </svg>
            </div>
            <div class="mp-text-content">
              <span class="mp-button-text">MercadoPago</span>
              <span class="mp-subtitle">Pago con cuenta MP</span>
            </div>
          </div>
        </button>
        
        ${this.createAlternativeOptions(amount)}
        
        <div class="mp-info">
          <small>Elige la opción que más te convenga</small>
        </div>
      </div>
    `;

    // Agregar evento al botón genérico
    const genericBtn = document.getElementById('mp-generic-btn');
    if (genericBtn) {
      genericBtn.addEventListener('click', () => {
        window.open('https://www.mercadopago.com.mx', '_blank');
      });
    }
  }

  // Eliminado el botón de donación de prueba y corregida la URL de MercadoPago
  private createAlternativeOptions(amount: string): string {
    return `
      <div class="alternative-payment-methods">
        <div class="payment-method-separator">
          <span>O también puedes:</span>
        </div>
        
        <button class="alternative-payment-btn" onclick="window.open('https://www.mercadopago.com.mx/money-in', '_blank')">
          <div class="alt-method-content">
            <span class="alt-method-icon">💳</span>
            <div class="alt-method-text">
              <span class="alt-method-title">Pagar con Tarjeta</span>
              <span class="alt-method-subtitle">Sin cuenta MercadoPago</span>
            </div>
          </div>
        </button>
        
        <button class="alternative-payment-btn" onclick="navigator.share ? navigator.share({title: 'Donación de apoyo', text: 'Apoya este proyecto con ${amount} MXN', url: window.location.href}) : prompt('Comparte este enlace:', window.location.href)">
          <div class="alt-method-content">
            <span class="alt-method-icon">📤</span>
            <div class="alt-method-text">
              <span class="alt-method-title">Compartir</span>
              <span class="alt-method-subtitle">Invita a otros a donar</span>
            </div>
          </div>
        </button>
      </div>
    `;
  }

  private createFallbackButton(containerId: string, amount: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="mercadopago-button-container">
        <div class="payment-options-title">
          <h4>Opciones de donación - ${amount} MXN</h4>
        </div>
        
        <button class="mercadopago-fallback-btn" onclick="window.open('https://www.mercadopago.com.mx', '_blank')">
          <div class="fallback-content">
            <span class="fallback-icon">⚠️</span>
            <span class="fallback-text">Ir a MercadoPago</span>
            <small>Servicio temporalmente no disponible</small>
          </div>
        </button>
        
        ${this.createAlternativeOptions(amount)}
        
        <div class="mp-info">
          <small>Si tienes problemas, intenta más tarde o contacta al creador</small>
        </div>
      </div>
    `;
  }

  // Método para crear donación directa (sin MercadoPago)
  async createDirectDonation(
    usuarioId: number,
    moduloId: number,
    amount: string,
    metodoPago: string = 'directo'
  ): Promise<any> {
    try {
      const donacionData = {
        usuario_id: usuarioId,
        modulo_id: moduloId,
        monto: parseFloat(amount),
        moneda: 'MXN',
        estado: 'completed',
        metodo_pago: metodoPago,
        transaction_id: `direct-${Date.now()}`,
        payment_id: `pay-${Date.now()}`
      };

      return this.donacionesService.createDonacion(donacionData).toPromise();
    } catch (error) {
      console.error('Error creando donación directa:', error);
      throw error;
    }
  }

  // Método para verificar el estado de un pago
  async verifyPaymentStatus(paymentId: string): Promise<any> {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${environment.mercadoPago.accessToken}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error verificando pago: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error verificando estado del pago:', error);
      throw error;
    }
  }

  private addCustomButtonStyles(): void {
    if (document.getElementById('mp-custom-styles')) return;

    const style = document.createElement('style');
    style.id = 'mp-custom-styles';
    style.textContent = `
      .mercadopago-button-container {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        padding: 20px 0;
      }
      
      .payment-options-title {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
      }
      
      .payment-options-title h4 {
        color: #10b981;
        font-size: 18px;
        font-weight: 600;
        margin: 0;
      }
      
      .mercadopago-donation-btn {
        background: linear-gradient(135deg, #009ee3, #0073a3) !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 18px 24px !important;
        color: white !important;
        font-weight: 600 !important;
        font-size: 16px !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        box-shadow: 0 4px 15px rgba(0, 158, 227, 0.3) !important;
        width: 100% !important;
        max-width: 350px !important;
        position: relative !important;
        overflow: hidden !important;
        margin-bottom: 10px !important;
      }
      
      .mercadopago-donation-btn:hover {
        background: linear-gradient(135deg, #0073a3, #005580) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(0, 158, 227, 0.4) !important;
      }
      
      .alternative-payment-methods {
        width: 100%;
        max-width: 350px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .payment-method-separator {
        text-align: center;
        color: #888;
        font-size: 14px;
        margin: 10px 0;
        position: relative;
      }
      
      .payment-method-separator::before,
      .payment-method-separator::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 30%;
        height: 1px;
        background: #444;
      }
      
      .payment-method-separator::before {
        left: 0;
      }
      
      .payment-method-separator::after {
        right: 0;
      }
      
      .alternative-payment-btn {
        background: #252525 !important;
        border: 2px solid #404040 !important;
        border-radius: 10px !important;
        padding: 12px 16px !important;
        color: white !important;
        cursor: pointer !important;
        transition: all 0.3s ease !important;
        width: 100% !important;
      }
      
      .alternative-payment-btn:hover {
        border-color: #666 !important;
        background: #333 !important;
        transform: translateY(-1px) !important;
      }
      
      .alt-method-content {
        display: flex !important;
        align-items: center !important;
        gap: 12px !important;
      }
      
      .alt-method-icon {
        font-size: 20px !important;
        width: 24px !important;
        text-align: center !important;
      }
      
      .alt-method-text {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 2px !important;
      }
      
      .alt-method-title {
        font-size: 14px !important;
        font-weight: 600 !important;
      }
      
      .alt-method-subtitle {
        font-size: 12px !important;
        color: #888 !important;
      }
      
      .mp-button-content {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 12px !important;
        margin-bottom: 8px !important;
      }
      
      .mp-logo {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
      
      .mp-icon {
        width: 28px !important;
        height: 28px !important;
        filter: brightness(1.2) !important;
      }
      
      .mp-text-content {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 2px !important;
      }
      
      .mp-button-text {
        font-size: 18px !important;
        font-weight: bold !important;
        line-height: 1.2 !important;
      }
      
      .mp-subtitle {
        font-size: 12px !important;
        opacity: 0.9 !important;
        font-weight: normal !important;
      }
      
      .mp-payment-methods {
        display: flex !important;
        gap: 6px !important;
        font-size: 10px !important;
        opacity: 0.85 !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        margin-top: 4px !important;
      }
      
      .mp-method {
        font-size: 9px !important;
        white-space: nowrap !important;
        background: rgba(255, 255, 255, 0.1) !important;
        padding: 2px 4px !important;
        border-radius: 4px !important;
      }
      
      .mp-security, .mp-info {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        color: #888 !important;
        font-size: 12px !important;
        text-align: center !important;
        margin-top: 10px !important;
      }
      
      .mp-security svg {
        color: #10b981 !important;
        width: 16px !important;
        height: 16px !important;
      }
      
      .mp-loading-button {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 10px !important;
        padding: 18px 24px !important;
        background: #f3f4f6 !important;
        border-radius: 12px !important;
        color: #6b7280 !important;
        width: 100% !important;
        max-width: 350px !important;
      }
      
      .mp-spinner {
        width: 20px !important;
        height: 20px !important;
        border: 2px solid #e5e7eb !important;
        border-top: 2px solid #3b82f6 !important;
        border-radius: 50% !important;
        animation: mp-spin 1s linear infinite !important;
      }
      
      @keyframes mp-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      .mercadopago-fallback-btn {
        background: linear-gradient(135deg, #6b7280, #4b5563) !important;
        border: 2px dashed #9ca3af !important;
        border-radius: 12px !important;
        padding: 18px 24px !important;
        color: white !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        width: 100% !important;
        max-width: 350px !important;
        transition: all 0.3s ease !important;
        margin-bottom: 10px !important;
      }
      
      .mercadopago-fallback-btn:hover {
        background: linear-gradient(135deg, #4b5563, #374151) !important;
        border-color: #6b7280 !important;
      }
      
      .fallback-content {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 6px !important;
      }
      
      .fallback-icon {
        font-size: 24px !important;
      }
      
      .fallback-text {
        font-size: 16px !important;
        font-weight: bold !important;
      }
      
      @media (max-width: 640px) {
        .mercadopago-donation-btn, 
        .mercadopago-fallback-btn, 
        .mp-loading-button,
        .alternative-payment-methods {
          max-width: 100% !important;
          margin: 0 10px !important;
        }
        
        .payment-options-title h4 {
          font-size: 16px;
        }
        
        .mp-button-content {
          gap: 10px !important;
        }
        
        .mp-button-text {
          font-size: 16px !important;
        }
        
        .mp-payment-methods {
          gap: 4px !important;
        }
        
        .alternative-payment-btn {
          padding: 10px 12px !important;
        }
        
        .alt-method-title {
          font-size: 13px !important;
        }
        
        .alt-method-subtitle {
          font-size: 11px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  debugMercadoPago(): void {
    console.log('=== DEBUG MERCADOPAGO ===');
    console.log('Window.MercadoPago:', !!window.MercadoPago);
    console.log('MP Instance:', !!this.mp);
    console.log('Is Initialized:', this.isInitialized);
    console.log('Environment keys:', {
      publicKey: environment.mercadoPago?.publicKey ? `${environment.mercadoPago.publicKey.substring(0, 10)}...` : 'NOT SET',
      accessToken: environment.mercadoPago?.accessToken ? 'SET' : 'NOT SET'
    });
    
    if (window.MercadoPago) {
      console.log('MercadoPago version:', window.MercadoPago.version || 'Unknown');
    }
    
    console.log('========================');
  }
}