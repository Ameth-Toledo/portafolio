import { Component, ViewEncapsulation, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  formattedText?: string;
  hasCodeBlocks?: boolean;
  codeBlocks?: CodeBlock[];
}

interface CodeBlock {
  id: string;
  language: string;
  code: string;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ChatbotComponent implements AfterViewInit, OnDestroy {
  isOpen = false;
  isLoading = false;
  messages: Message[] = [
    {
      text: '¡Hola! Soy AmethDev, tu asistente de IA especializado en cursos de programación. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date(),
      formattedText: '¡Hola! Soy AmethDev, tu asistente de IA especializado en cursos de programación. ¿En qué puedo ayudarte hoy?',
      hasCodeBlocks: false
    }
  ];
  newMessage = '';

  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private readonly API_KEY = 'AIzaSyCVZNEOvB_s4qZvTlCVhTAsMHwQ4isunxU';

  private readonly SYSTEM_PROMPT = `
  Eres AmethDev, un asistente de IA especializado exclusivamente en cursos de programación y desarrollo web.

  REGLAS ESTRICTAS DE FORMATO DE CÓDIGO:
  - SIEMPRE usa bloques de código con \`\`\` para todo código de más de una línea
  - Formato correcto: \`\`\`javascript (nueva línea) código (nueva línea) \`\`\`
  - NUNCA escribas texto después del lenguaje en la misma línea
  - Para código inline corto usa backticks simples: \`variable\`
  - NO uses asteriscos (*) para nada
  - NO uses **texto** para resaltar
  - NO uses etiquetas HTML

  EJEMPLOS DE FORMATO CORRECTO:

  Para bloques de código:
  \`\`\`javascript
  const express = require('express');
  const app = express();
  
  app.get('/users', (req, res) => {
    res.json({ message: 'Hola mundo' });
  });
  \`\`\`

  Para código inline: \`const nombre = 'valor'\`

  CONTENIDO DE CÓDIGO:
  - Proporciona código COMPLETO y FUNCIONAL
  - Incluye todos los imports necesarios
  - Agrega comentarios explicativos
  - Para APIs: muestra endpoints completos
  - Para componentes: incluye decoradores y métodos completos
  - No fragmentes el código, muestra ejemplos completos

  TECNOLOGÍAS QUE DOMINAS:
  - JavaScript, TypeScript, React, Angular, Vue.js
  - Python, Django, Flask, FastAPI
  - HTML5, CSS3, SASS, Bootstrap, Tailwind
  - Node.js, Express
  - Bases de datos (SQL, PostgreSQL, MongoDB)
  - Git, herramientas de desarrollo
  - APIs REST, GraphQL
  - Testing, deployment básico

  IMPORTANTE: 
  - Siempre separa explicaciones del código
  - Usa párrafos cortos y claros
  - Mantén las explicaciones simples y directas

  Responde siempre en español, mantén un tono amigable y educativo.
  `;

  private conversationHistory: ChatMessage[] = [];
  private codeBlocksMap: Map<string, string> = new Map();

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    // Configurar función global para acceso al código
    (window as any).getCodeById = (codeId: string) => {
      return this.codeBlocksMap.get(codeId) || '';
    };

    // Configurar función global para copia
    (window as any).copyCodeFromComponent = (codeId: string, buttonElement: HTMLElement) => {
      const code = this.codeBlocksMap.get(codeId);
      if (code) {
        this.copyCodeInternal(code, buttonElement);
      }
    };
  }

  ngOnDestroy() {
    // Limpiar funciones globales
    delete (window as any).getCodeById;
    delete (window as any).copyCodeFromComponent;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (this.newMessage.trim() && !this.isLoading) {
      this.messages.push({
        text: this.newMessage,
        isUser: true,
        timestamp: new Date(),
        hasCodeBlocks: false
      });

      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;

      try {
        const response = await this.getGeminiResponse(userMessage);
        const { formattedText, codeBlocks, hasCodeBlocks } = this.formatResponse(response);

        this.messages.push({
          text: response,
          isUser: false,
          timestamp: new Date(),
          formattedText: formattedText,
          hasCodeBlocks: hasCodeBlocks,
          codeBlocks: codeBlocks
        });

        this.conversationHistory.push(
          { role: 'user', parts: [{ text: userMessage }] },
          { role: 'model', parts: [{ text: response }] }
        );

      } catch (error) {
        console.error('Error al obtener respuesta de Gemini:', error);
        this.messages.push({
          text: 'Lo siento, hubo un error al conectar con la IA. ¿Podrías intentarlo de nuevo?',
          isUser: false,
          timestamp: new Date(),
          formattedText: 'Lo siento, hubo un error al conectar con la IA. ¿Podrías intentarlo de nuevo?',
          hasCodeBlocks: false
        });
      } finally {
        this.isLoading = false;
        setTimeout(() => this.scrollToBottom(), 100);
      }
    }
  }

  private formatResponse(text: string): { formattedText: string; codeBlocks: CodeBlock[]; hasCodeBlocks: boolean } {
    console.log('Texto original:', text);
    
    let formatted = text.trim()
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\*/g, '');

    const codeBlocks: CodeBlock[] = [];
    let codeBlockCounter = 0;

    // Detectar y extraer bloques de código con ```
    formatted = formatted.replace(/```(\w+)?\s*\n?([\s\S]*?)```/g, (match, language, code) => {
      const cleanCode = code.trim();
      if (cleanCode.length > 0) {
        const codeId = `code_block_${Date.now()}_${codeBlockCounter++}`;
        const lang = language || 'javascript';
        
        // Guardar código en el mapa
        this.codeBlocksMap.set(codeId, cleanCode);
        
        codeBlocks.push({
          id: codeId,
          language: lang,
          code: cleanCode
        });

        return `<div class="code-placeholder" data-code-id="${codeId}" data-language="${lang}"></div>`;
      }
      return match;
    });

    // Detectar patrón alternativo "lenguaje Copiar"
    formatted = formatted.replace(/(\w+)\s+Copiar\s*\n\s*([\s\S]*?)(?=\n\n|\n[A-ZÁÉÍÓÚÑ]|$)/g, (match, language, code) => {
      const cleanCode = code.trim();
      if (this.isLikelyCode(cleanCode)) {
        const codeId = `code_block_${Date.now()}_${codeBlockCounter++}`;
        const lang = language.toLowerCase();
        
        this.codeBlocksMap.set(codeId, cleanCode);
        
        codeBlocks.push({
          id: codeId,
          language: lang,
          code: cleanCode
        });

        return `<div class="code-placeholder" data-code-id="${codeId}" data-language="${lang}"></div>`;
      }
      return match;
    });

    // Formatear código inline con clases personalizadas
    formatted = formatted.replace(/`([^`\n]+)`/g, '<span class="inline-code-custom">$1</span>');
    
    // Formatear listas
    formatted = formatted.replace(/^\s*-\s+(.+)$/gm, '<div class="bullet-point-custom">$1</div>');
    formatted = formatted.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<div class="bullet-point-custom">$1. $2</div>');

    // Formatear párrafos
    formatted = formatted.replace(/\n\n/g, '<br><br>');
    formatted = formatted.replace(/\n/g, '<br>');
    
    // Procesar placeholders después del formateo
    setTimeout(() => this.processCodePlaceholders(), 100);
    
    console.log('Texto formateado:', formatted);
    console.log('Bloques de código encontrados:', codeBlocks);

    return {
      formattedText: formatted,
      codeBlocks: codeBlocks,
      hasCodeBlocks: codeBlocks.length > 0
    };
  }

  private processCodePlaceholders() {
    const placeholders = document.querySelectorAll('.code-placeholder');
    placeholders.forEach((placeholder) => {
      const codeId = placeholder.getAttribute('data-code-id');
      const language = placeholder.getAttribute('data-language') || 'javascript';
      const code = this.codeBlocksMap.get(codeId || '');
      
      if (code && codeId) {
        const codeHtml = `
          <div class="code-block-container">
            <div class="code-block-header">
              <span class="code-language">${language}</span>
              <button class="copy-code-btn" data-code-id="${codeId}" onclick="window.copyCodeFromComponent('${codeId}', this)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 4V2C8 1.44772 8.44772 1 9 1H19C19.5523 1 20 1.44772 20 2V12C20 12.5523 19.5523 13 19 13H17V11H18V3H10V4H8Z" fill="currentColor"/>
                  <path d="M5 5C4.44772 5 4 5.44772 4 6V20C4 20.5523 4.44772 21 5 21H15C15.5523 21 16 20.5523 16 20V6C16 5.44772 15.5523 5 15 5H5Z" fill="currentColor"/>
                </svg>
                Copiar
              </button>
            </div>
            <div class="code-block-content">
              <pre class="code-block-pre">${this.escapeHtml(code)}</pre>
            </div>
          </div>
        `;
        placeholder.outerHTML = codeHtml;
      }
    });
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Método mejorado para copiar código
  copyCode(code: string, codeId: string) {
    const buttonElement = document.querySelector(`[data-code-id="${codeId}"]`) as HTMLElement;
    this.copyCodeInternal(code, buttonElement);
  }

  private copyCodeInternal(code: string, buttonElement?: HTMLElement | null) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code).then(() => {
        console.log('Código copiado al portapapeles');
        this.showCopySuccess(buttonElement);
      }).catch(err => {
        console.error('Error al copiar código:', err);
        this.fallbackCopyText(code, buttonElement);
      });
    } else {
      this.fallbackCopyText(code, buttonElement);
    }
  }

  private showCopySuccess(buttonElement?: HTMLElement | null) {
    if (buttonElement) {
      const originalHTML = buttonElement.innerHTML;
      const originalStyle = buttonElement.style.cssText;
      
      buttonElement.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
        ¡Copiado!
      `;
      buttonElement.style.background = '#15803D';
      buttonElement.style.borderColor = '#166534';
      buttonElement.style.transform = 'scale(0.95)';
      
      setTimeout(() => {
        buttonElement.innerHTML = originalHTML;
        buttonElement.style.cssText = originalStyle;
      }, 2000);
    }
  }

  private fallbackCopyText(text: string, buttonElement?: HTMLElement | null) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      console.log('Código copiado al portapapeles (fallback)');
      this.showCopySuccess(buttonElement);
    } catch (err) {
      console.error('Error al copiar código:', err);
    }
    
    document.body.removeChild(textArea);
  }

  private isLikelyCode(text: string): boolean {
    const codePatterns = [
      /const\s+\w+\s*=/,
      /function\s+\w+\s*\(/,
      /app\.\w+\(/,
      /require\s*\(/,
      /import\s+.*from/,
      /export\s+(default\s+)?/,
      /console\.(log|error|warn)/,
      /\.json\s*\(/,
      /\.listen\s*\(/,
      /=>\s*\{/,
      /\/\/.*$/m,
      /\{\s*$/m,
      /\}\s*;?\s*$/m,
      /express\(\)/,
      /\.use\s*\(/,
      /\.get\s*\(/,
      /\.post\s*\(/,
      /\.put\s*\(/,
      /\.delete\s*\(/
    ];
    
    const hasCodePatterns = codePatterns.some(pattern => pattern.test(text));
    const hasCodeStructure = text.includes('{') && text.includes('}');
    const hasLineCount = text.split('\n').length > 3;
    
    return hasCodePatterns && hasCodeStructure && hasLineCount;
  }

  private async getGeminiResponse(userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        parts: [{ text: this.SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Entendido. Soy AmethDev y responderé con código completo y funcional, usando ``` correctamente.' }]
      },
      ...this.conversationHistory.slice(-10),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const payload = {
      contents: messages,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const url = `${this.GEMINI_API_URL}?key=${this.API_KEY}`;

    const response = await this.http.post<GeminiResponse>(url, payload, {
      headers: { 'Content-Type': 'application/json' }
    }).toPromise();

    return response?.candidates[0]?.content?.parts[0]?.text ||
      'Lo siento, no pude generar una respuesta. ¿Podrías reformular tu pregunta?';
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 150);
  }

  // Método público para obtener código por ID
  getCodeBlock(message: Message, codeId: string): CodeBlock | undefined {
    return message.codeBlocks?.find(block => block.id === codeId);
  }

  // Método para limpiar el historial de códigos (opcional)
  clearCodeHistory() {
    this.codeBlocksMap.clear();
  }
}