import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    paypal: any;
  }
}

declare var paypal: any;

@Injectable({
  providedIn: 'root'
})
export class PaypalService {

  constructor() { }

  loadPayPalScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.paypal) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypal.clientId}&currency=${environment.paypal.currency}&intent=capture`;
      script.onload = () => resolve();
      script.onerror = () => reject('Error al cargar PayPal SDK');
      document.head.appendChild(script);
    });
  }

  createDonationButton(containerId: string, amount: string = '50.00'): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        paypal.Buttons({
          style: {
            shape: 'rect',
            color: 'blue',
            layout: 'vertical',
            label: 'donate',
            height: 50,
            tagline: false
          },
          createOrder: (data: any, actions: any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: amount,
                  currency_code: environment.paypal.currency
                },
                description: `Donación de $${amount} MXN para apoyar el contenido educativo`
              }]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              console.log('Donación completada:', details);
              this.onDonationSuccess(details);
            });
          },
          onError: (err: any) => {
            console.error('Error en la donación:', err);
            this.onDonationError(err);
          },
          onCancel: (data: any) => {
            console.log('Donación cancelada:', data);
            this.onDonationCancel();
          }
        }).render(`#${containerId}`).then(() => {
          this.forceFullWidth(containerId);
          resolve();
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  private forceFullWidth(containerId: string): void {
    setTimeout(() => {
      const container = document.getElementById(containerId);
      if (container) {
        const paypalButtons = container.querySelectorAll('div, iframe');
        paypalButtons.forEach((element: any) => {
          if (element.style) {
            element.style.width = '100%';
            element.style.minWidth = '100%';
          }
        });

        const style = document.createElement('style');
        style.textContent = `
          #${containerId} > div {
            width: 100% !important;
            min-width: 100% !important;
          }
          #${containerId} iframe {
            width: 100% !important;
            min-width: 100% !important;
          }
          #${containerId} .paypal-button {
            width: 100% !important;
          }
        `;
        document.head.appendChild(style);
      }
    }, 500);
  }

  private onDonationSuccess(details: any): void {
    const donatorName = details.payer.name.given_name;
    const amount = details.purchase_units[0].amount.value;
    const currency = details.purchase_units[0].amount.currency_code;

    this.showSuccessModal(donatorName, amount, currency);

    this.saveDonationToFirebase(details);
  }

  private showSuccessModal(donatorName: string, amount: string, currency: string): void {
    const modal = document.createElement('div');
    modal.className = 'donation-success-modal';
    modal.innerHTML = `
      <div class="donation-success-overlay"></div>
      <div class="donation-success-content">
        <div class="success-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </div>
        <h2>¡Donación Exitosa!</h2>
        <p>¡Gracias <strong>${donatorName}</strong>!</p>
        <p>Tu donación de <strong>$${amount} ${currency}</strong> ha sido procesada exitosamente.</p>
        <p>¡Realmente aprecio tu apoyo! 🎉</p>
        <button class="success-close-btn" onclick="this.parentElement.parentElement.remove()">
          Cerrar
        </button>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .donation-success-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
      }
      .donation-success-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }
      .donation-success-content {
        background: #1a1a1a;
        border-radius: 16px;
        padding: 40px 30px;
        text-align: center;
        position: relative;
        max-width: 400px;
        margin: 0 20px;
        border: 2px solid #10B981;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .success-icon {
        margin-bottom: 20px;
      }
      .donation-success-content h2 {
        color: #10B981;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      .donation-success-content p {
        color: #e5e5e5;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 10px;
      }
      .donation-success-content strong {
        color: #10B981;
      }
      .success-close-btn {
        background: #10B981;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 20px;
        transition: all 0.3s ease;
      }
      .success-close-btn:hover {
        background: #0d9f6e;
        transform: translateY(-2px);
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);

    setTimeout(() => {
      if (modal.parentElement) {
        modal.remove();
      }
    }, 10000);
  }

  private onDonationError(error: any): void {
    console.error('Error detallado en la donación:', error);
    
    let errorMessage = 'Hubo un problema procesando tu donación. ';
    
    if (error.name === 'INSTRUMENT_DECLINED') {
      errorMessage += 'Tu método de pago fue rechazado. Por favor intenta con otra tarjeta.';
    } else if (error.name === 'VALIDATION_ERROR') {
      errorMessage += 'Algunos datos no son válidos. Por favor verifica la información.';
    } else if (error.name === 'PAYER_ACTION_REQUIRED') {
      errorMessage += 'Se requiere una acción adicional de tu parte. Por favor completa el proceso.';
    } else {
      errorMessage += 'Por favor intenta nuevamente o usa otro método de pago.';
    }

    this.showErrorModal(errorMessage);
  }

  private showErrorModal(message: string): void {
    const modal = document.createElement('div');
    modal.className = 'donation-error-modal';
    modal.innerHTML = `
      <div class="donation-error-overlay"></div>
      <div class="donation-error-content">
        <div class="error-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        </div>
        <h2>Error en la Donación</h2>
        <p>${message}</p>
        <div class="error-actions">
          <button class="error-retry-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
            Intentar de Nuevo
          </button>
          <button class="error-close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">
            Cerrar
          </button>
        </div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .donation-error-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        animation: fadeIn 0.3s ease;
      }
      .donation-error-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
      }
      .donation-error-content {
        background: #1a1a1a;
        border-radius: 16px;
        padding: 40px 30px;
        text-align: center;
        position: relative;
        max-width: 400px;
        margin: 0 20px;
        border: 2px solid #EF4444;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .error-icon {
        margin-bottom: 20px;
      }
      .donation-error-content h2 {
        color: #EF4444;
        font-size: 24px;
        margin-bottom: 15px;
        font-weight: 600;
      }
      .donation-error-content p {
        color: #e5e5e5;
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 25px;
      }
      .error-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
      }
      .error-retry-btn, .error-close-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        border: none;
        transition: all 0.3s ease;
      }
      .error-retry-btn {
        background: #10B981;
        color: white;
      }
      .error-retry-btn:hover {
        background: #0d9f6e;
        transform: translateY(-2px);
      }
      .error-close-btn {
        background: #374151;
        color: #9CA3AF;
      }
      .error-close-btn:hover {
        background: #4B5563;
        color: white;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  private onDonationCancel(): void {
    console.log('El usuario canceló la donación');
    
    const toast = document.createElement('div');
    toast.className = 'donation-cancel-toast';
    toast.innerHTML = `
      <div class="toast-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
        <span>Donación cancelada</span>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .donation-cancel-toast {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #1a1a1a;
        border: 1px solid #F59E0B;
        border-radius: 8px;
        padding: 12px 16px;
        z-index: 99999;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
      }
      .toast-content {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #F59E0B;
        font-size: 14px;
        font-weight: 500;
      }
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes fadeOut {
        from {
          opacity: 1;
        }
        to {
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 3000);
  }

  private saveDonationToFirebase(details: any): void {
    const donationData = {
      transactionId: details.id,
      amount: details.purchase_units[0].amount.value,
      currency: details.purchase_units[0].amount.currency_code,
      donatorName: details.payer.name.given_name,
      donatorEmail: details.payer.email_address,
      status: details.status,
      timestamp: new Date().toISOString(),
    };

    console.log('Datos de donación para guardar:', donationData);
    
    // Aquí implementarías la lógica para guardar en Firebase
    // this.firebaseService.saveDonation(donationData);
  }

  validateAmount(amount: string): boolean {
    const numAmount = parseFloat(amount);
    return numAmount >= 10 && numAmount <= 10000;
  }

  formatAmount(amount: number): string {
    return amount.toFixed(2);
  }
}