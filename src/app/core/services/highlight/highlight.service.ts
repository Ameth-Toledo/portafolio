import { Injectable } from '@angular/core';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

@Injectable({
  providedIn: 'root'
})
export class HighlightService {
  private registeredLanguages = false;

  constructor() {
    this.registerLanguages();
  }

  private registerLanguages(): void {
    if (this.registeredLanguages) return;
    
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('html', html);
    hljs.registerLanguage('css', css);
    
    this.registeredLanguages = true;
  }

  highlightCode(rawCode: string, language: string): string {
    if (!rawCode) return '';
    
    const code = this.cleanCode(rawCode);
    
    try {
      return hljs.highlight(code, {
        language: language.toLowerCase(),
        ignoreIllegals: true
      }).value;
    } catch (e) {
      console.warn('Error en resaltado de sintaxis:', e);
      return code;
    }
  }

  private cleanCode(code: string): string {
    // Elimina espacios iniciales/finales y TODAS las líneas vacías del final
    return code
      .replace(/^\s+/, '')       // Elimina espacios al inicio
      .replace(/\s+$/, '')       // Elimina espacios al final
      .replace(/\n+$/, '');      // Elimina todos los saltos de línea al final
  }
}