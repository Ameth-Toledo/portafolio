import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header-blog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header-blog.component.html',
  styleUrl: './header-blog.component.css'
})
export class HeaderBlogComponent {
  @Output() buscar = new EventEmitter<string>();
  terminoBusqueda: string = '';
  isListening = false;
  recognition: any;

  constructor() {
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

  onLogin() {}
}
