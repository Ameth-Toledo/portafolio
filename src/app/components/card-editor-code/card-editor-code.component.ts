import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-editor-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-editor-code.component.html',
  styleUrl: './card-editor-code.component.css'
})
export class CardEditorCodeComponent {
  @Input() code: string = '';
  @Input() language: 'html' | 'css' = 'html';
  @Input() lenguaje: string = '';

  get highlightedCode(): string {
    return this.highlightSyntax(this.code, this.language);
  }

  getLines(): number[] {
    const lineCount = this.code.split('\n').length;
    return Array(lineCount).fill(0);
  }

  private highlightSyntax(code: string, language: 'html' | 'css'): string {
    if (language === 'html') {
      return this.highlightHTML(code);
    } else {
      return this.highlightCSS(code);
    }
  }

  private highlightHTML(html: string): string {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/&lt;!DOCTYPE\s+html&gt;/g, '<span class="tag">&lt;!DOCTYPE <span class="keyword">html</span>&gt;</span>')
      .replace(/&lt;(\/?)([a-zA-Z0-9-]+)([^&]*)&gt;/g, (match, slash, tagName, rest) => {
        return `<span class="tag">&lt;${slash}<span class="tag-name">${tagName}</span>${this.highlightHTMLAttributes(rest)}&gt;</span>`;
      })
      .replace(/&lt;!--([\s\S]*?)--&gt;/g, '<span class="comment">&lt;!--$1--&gt;</span>');
  }

  private highlightHTMLAttributes(attrs: string): string {
    return attrs.replace(/([a-zA-Z0-9-]+)=("([^"]*)"|'([^']*)')/g, 
      '<span class="attribute"> $1</span>=<span class="value">$2</span>');
  }

  private highlightCSS(css: string): string {
    return css
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\/(\*[\s\S]*?\*)\//g, '<span class="comment">/*$1*/</span>')
      .replace(/([^{};\s][^{};]*)(?=\s*{)/g, '<span class="selector">$1</span>')
      .replace(/([a-zA-Z-]+)\s*:/g, '<span class="property">$1</span>:')
      .replace(/:\s*([^;}]+)/g, ': <span class="value">$1</span>')
      .replace(/!important/g, '<span class="keyword">!important</span>');
  }
}
