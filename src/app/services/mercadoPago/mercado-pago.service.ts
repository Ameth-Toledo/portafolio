import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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

  constructor() { }

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
      // Verificar que tenemos la clave pública
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

  // Método simplificado para crear botón personalizado
  async createCustomDonationButton(containerId: string, amount: string = '50.00'): Promise<void> {
    try {
      console.log('Creando botón personalizado de MercadoPago para:', amount);
      
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('Contenedor no encontrado:', containerId);
        return;
      }

      // Limpiar contenido anterior
      container.innerHTML = '';

      // Mostrar loading mientras se procesa
      this.showLoadingButton(container);

      // Verificar que MercadoPago esté disponible
      if (!window.MercadoPago || !this.isInitialized) {
        console.log('MercadoPago no disponible, creando botón directo');
        this.createDirectPaymentButton(container, amount);
        return;
      }

      // Intentar crear preferencia si tenemos access token
      if (environment.mercadoPago?.accessToken) {
        try {
          const preferenceId = await this.createDonationPreference(amount);
          this.createPreferenceButton(container, preferenceId, amount);
        } catch (error) {
          console.error('Error creando preferencia:', error);
          this.createDirectPaymentButton(container, amount);
        }
      } else {
        console.log('No hay access token, creando botón directo');
        this.createDirectPaymentButton(container, amount);
      }

      // Agregar estilos
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
          <span>Cargando MercadoPago...</span>
        </div>
      </div>
    `;
  }

  private async createDonationPreference(amount: string): Promise<string> {
    const preferenceData = {
      items: [
        {
          title: `Donación de apoyo - $${amount} MXN`,
          quantity: 1,
          currency_id: 'MXN',
          unit_price: parseFloat(amount)
        }
      ],
      payer: {
        email: 'donador@example.com'
      },
      back_urls: {
        success: window.location.origin + '/donation-success',
        failure: window.location.origin + '/donation-failure',
        pending: window.location.origin + '/donation-pending'
      },
      auto_return: 'approved',
      external_reference: `donation-${Date.now()}`,
      expires: true,
      expiration_date_from: new Date().toISOString(),
      expiration_date_to: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
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
      throw new Error(`Error creating preference: ${response.status}`);
    }

    const preference = await response.json();
    return preference.id;
  }

  private createPreferenceButton(container: HTMLElement, preferenceId: string, amount: string): void {
    const checkoutUrl = `https://www.mercadopago.com.mx/checkout/v1/redirect?pref_id=${preferenceId}`;
    
    container.innerHTML = `
      <div class="mercadopago-button-container">
        <button class="mercadopago-donation-btn" onclick="window.open('${checkoutUrl}', '_blank')">
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
          </div>
        </button>
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
  }

  private createDirectPaymentButton(container: HTMLElement, amount: string): void {
    // Crear enlace directo a MercadoPago para donaciones
    const mercadoPagoUrl = `https://www.mercadopago.com.mx`;
    
    container.innerHTML = `
      <div class="mercadopago-button-container">
        <button class="mercadopago-donation-btn" onclick="window.open('${mercadoPagoUrl}', '_blank')">
          <div class="mp-button-content">
            <div class="mp-logo">
              <svg class="mp-icon" viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 65c-13.8 0-25-11.2-25-25s11.2-25 25-25 25 11.2 25 25-11.2 25-25 25z"/>
                <circle cx="50" cy="50" r="15"/>
              </svg>
            </div>
            <div class="mp-text-content">
              <span class="mp-button-text">Donar $${amount} MXN</span>
              <span class="mp-subtitle">vía MercadoPago</span>
            </div>
          </div>
          <div class="mp-payment-methods">
            <span class="mp-method">💳 Tarjeta</span>
            <span class="mp-method">🏪 OXXO</span>
            <span class="mp-method">🏦 Transferencia</span>
          </div>
        </button>
        <div class="mp-info">
          <small>Serás redirigido a MercadoPago para realizar tu donación</small>
        </div>
      </div>
    `;
  }

  private createFallbackButton(containerId: string, amount: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="mercadopago-button-container">
        <button class="mercadopago-fallback-btn" onclick="alert('MercadoPago no está disponible en este momento. Por favor intenta más tarde o contacta al creador.')">
          <div class="fallback-content">
            <span class="fallback-icon">⚠️</span>
            <span class="fallback-text">Donar $${amount} MXN</span>
            <small>MercadoPago no disponible</small>
          </div>
        </button>
      </div>
    `;
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
        gap: 12px;
        padding: 15px 0;
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
      }
      
      .mercadopago-donation-btn:hover {
        background: linear-gradient(135deg, #0073a3, #005580) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 20px rgba(0, 158, 227, 0.4) !important;
      }
      
      .mercadopago-donation-btn:active {
        transform: translateY(0) !important;
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
        gap: 8px !important;
        font-size: 11px !important;
        opacity: 0.85 !important;
        flex-wrap: wrap !important;
        justify-content: center !important;
        margin-top: 4px !important;
      }
      
      .mp-method {
        font-size: 10px !important;
        white-space: nowrap !important;
        background: rgba(255, 255, 255, 0.1) !important;
        padding: 2px 6px !important;
        border-radius: 4px !important;
      }
      
      .mp-security, .mp-info {
        display: flex !important;
        align-items: center !important;
        gap: 6px !important;
        color: #888 !important;
        font-size: 12px !important;
        text-align: center !important;
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
        .mp-loading-button {
          max-width: 100% !important;
          margin: 0 10px !important;
        }
        
        .mp-button-content {
          gap: 10px !important;
        }
        
        .mp-button-text {
          font-size: 16px !important;
        }
        
        .mp-payment-methods {
          gap: 6px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Método de debug mejorado
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