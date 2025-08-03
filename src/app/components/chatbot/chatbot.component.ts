import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
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
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  isOpen = false;
  isLoading = false;
  messages: Message[] = [
    {
      text: '¡Hola! Soy AmethDev, tu asistente de IA especializado en cursos de programación. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }
  ];
  newMessage = '';

  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private readonly API_KEY = 'AIzaSyCVZNEOvB_s4qZvTlCVhTAsMHwQ4isunxU';

  private readonly SYSTEM_PROMPT = `
    Eres AmethDev, un asistente de IA especializado exclusivamente en cursos de programación y desarrollo web.

    REGLAS ESTRICTAS:
    - Solo respondes preguntas sobre programación, desarrollo web, y tecnologías relacionadas
    - Si te preguntan sobre otros temas, educadamente redirige hacia programación
    - Proporciona ejemplos de código cuando sea útil
    - Mantén respuestas concisas pero educativas (máximo 3 párrafos)
    - Si no sabes algo, admítelo pero ofrece alternativas relacionadas

    TECNOLOGÍAS QUE DOMINAS:
    - JavaScript, TypeScript, React, Angular, Vue.js
    - Python, Django, Flask
    - HTML5, CSS3, SASS, Bootstrap, Tailwind
    - Node.js, Express
    - Bases de datos (SQL, MongoDB)
    - Git, herramientas de desarrollo
    - APIs REST, GraphQL
    - Testing, deployment básico

    Responde siempre en español, mantén un tono amigable y educativo.
  `;

  private conversationHistory: ChatMessage[] = [];

  constructor(private http: HttpClient) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  async sendMessage() {
    if (this.newMessage.trim() && !this.isLoading) {
      this.messages.push({
        text: this.newMessage,
        isUser: true,
        timestamp: new Date()
      });

      const userMessage = this.newMessage;
      this.newMessage = '';
      this.isLoading = true;

      try {
        const response = await this.getGeminiResponse(userMessage);
        
        this.messages.push({
          text: response,
          isUser: false,
          timestamp: new Date()
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
          timestamp: new Date()
        });
      } finally {
        this.isLoading = false;
        this.scrollToBottom();
      }
    }
  }

  private async getGeminiResponse(userMessage: string): Promise<string> {
    const messages: ChatMessage[] = [
      {
        role: 'user',
        parts: [{ text: this.SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'Entendido. Soy AmethDev y solo responderé preguntas sobre programación y desarrollo web.' }]
      },
      ...this.conversationHistory.slice(-8), 
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
        maxOutputTokens: 500,
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

  private isProgrammingRelated(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    
    const programmingKeywords = [
      // Lenguajes
      'javascript', 'js', 'python', 'java', 'typescript', 'php', 'c++', 'c#',
      // Frameworks y librerías
      'react', 'angular', 'vue', 'django', 'flask', 'express', 'nodejs', 'node',
      // Web
      'html', 'css', 'sass', 'scss', 'bootstrap', 'tailwind', 'web', 'frontend', 'backend',
      // Conceptos
      'programación', 'programacion', 'código', 'codigo', 'desarrollo', 'función', 'funcion', 
      'variable', 'array', 'objeto', 'clase', 'método', 'metodo', 'api', 'base de datos', 
      'algoritmo', 'debugging', 'debug', 'error', 'sintaxis', 'framework', 'biblioteca',
      // Herramientas
      'git', 'github', 'npm', 'webpack', 'vscode', 'terminal', 'consola',
      // Cursos y aprendizaje
      'curso', 'aprender', 'tutorial', 'ejercicio', 'proyecto', 'práctica', 'practica',
      // Preguntas comunes
      'como', 'qué es', 'que es', 'diferencia entre', 'mejor manera', 'problema'
    ];
    
    const programmingPhrases = [
      'programar', 'desarrollar', 'codificar', 'lenguaje de programación',
      'framework', 'biblioteca', 'desarrollo web', 'desarrollo de software'
    ];
    
    return programmingKeywords.some(keyword => lowerMessage.includes(keyword)) ||
           programmingPhrases.some(phrase => lowerMessage.includes(phrase)) ||
           lowerMessage.length < 10; 
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
    }, 100);
  }
}