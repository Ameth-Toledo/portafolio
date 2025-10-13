import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-comand-copy',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comand-copy.component.html',
  styleUrl: './comand-copy.component.css'
})
export class ComandCopyComponent implements OnInit {
  @Input() comand: string = '';
  @Input() language: string = ''; // 'mysql', 'javascript', 'python', etc.
  
  isModalVisible: boolean = false;
  comandCopied: string = '';
  highlightedComand: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.updateHighlightedComand();
  }

  ngOnChanges(): void {
    this.updateHighlightedComand();
  }

  private updateHighlightedComand(): void {
    if (this.language && this.comand) {
      this.highlightedComand = this.sanitizer.bypassSecurityTrustHtml(
        this.highlightSyntax(this.comand, this.language)
      );
    }
  }

  private highlightSyntax(code: string, language: string): string {
    switch (language.toLowerCase()) {
      case 'mysql':
      case 'sql':
        return this.highlightSQL(code);
      case 'javascript':
      case 'js':
        return this.highlightJavaScript(code);
      case 'python':
        return this.highlightPython(code);
      default:
        return code;
    }
  }

  private highlightSQL(code: string): string {
    // Primero guardamos strings y comentarios para no modificarlos
    const strings = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*")/g;
    const comments = /(--[^\n]*|\/\*[\s\S]*?\*\/)/g;
    
    let highlighted = code;
    
    // Comments (primero para no interferir con otros patrones)
    highlighted = highlighted.replace(comments, '<span class="sql-comment">$1</span>');
    
    // Strings
    highlighted = highlighted.replace(strings, '<span class="sql-string">$1</span>');
    
    // Keywords de múltiples palabras (deben ir primero)
    const multiWordKeywords = /\b(IDENTIFIED BY|ORDER BY|GROUP BY|PRIMARY KEY|FOREIGN KEY|AUTO_INCREMENT)\b/gi;
    highlighted = highlighted.replace(multiWordKeywords, '<span class="sql-keyword">$1</span>');

    const keywordEspecial = /\b(CURRENT_TIMESTAMP)\b/gi;
    highlighted = highlighted.replace(keywordEspecial, '<span class="sql-keywordEspecial">$1</span>');
    
    // Keywords de una sola palabra
    const singleKeywords = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|TABLE|ALTER|DROP|JOIN|LEFT|RIGHT|INNER|OUTER|ON|AND|OR|NOT|IN|LIKE|BETWEEN|HAVING|LIMIT|OFFSET|AS|DISTINCT|COUNT|SUM|AVG|MAX|MIN|NULL|REFERENCES|INDEX|DATABASE|DATABASES|USE|SHOW|TABLES|DESC|DESCRIBE|SET|VALUES|INTO|DEFAULT|VARCHAR|INT|TEXT|DATE|DATETIME|TIMESTAMP|BOOLEAN|USER|GRANT|REVOKE|PRIVILEGES|ALL|BY|WITH|OPTION|IF|EXISTS|ENGINE|CHARACTER|COLLATE|CHARSET|TO|FLUSH|BEGIN|COMMIT|REVOKE|ROLLBACK|START|TRANSACTION|TRUNCATE|RENAME|EXPLAIN|UNION|CASE|WHEN|THEN|END|ELSE|CAST|CONVERT|EXIT|UNIQUE)\b/gi;
    highlighted = highlighted.replace(singleKeywords, '<span class="sql-keyword">$1</span>');
    
    // Functions
    const functions = /\b([A-Z_]+)(?=\()/g;
    highlighted = highlighted.replace(functions, '<span class="sql-function">$1</span>');
    
    // Numbers
    const numbers = /\b\d+(\.\d+)?\b/g;
    highlighted = highlighted.replace(numbers, '<span class="sql-number">$1</span>');

    return highlighted;
  }

  private highlightJavaScript(code: string): string {
    const keywords = /\b(const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|class|extends|import|export|from|default|new|this|super|try|catch|finally|throw|async|await|yield|typeof|instanceof|in|of|delete|void|null|undefined|true|false)\b/g;
    const strings = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*"|`([^`\\]|\\.)*`)/g;
    const numbers = /\b\d+(\.\d+)?\b/g;
    const comments = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g;

    let highlighted = code;
    highlighted = highlighted.replace(comments, '<span class="js-comment">$1</span>');
    highlighted = highlighted.replace(strings, '<span class="js-string">$1</span>');
    highlighted = highlighted.replace(keywords, '<span class="js-keyword">$1</span>');
    highlighted = highlighted.replace(numbers, '<span class="js-number">$1</span>');

    return highlighted;
  }

  private highlightPython(code: string): string {
    const keywords = /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|yield|pass|break|continue|raise|assert|del|global|nonlocal|True|False|None|and|or|not|in|is)\b/g;
    const strings = /('([^'\\]|\\.)*'|"([^"\\]|\\.)*"|'''[\s\S]*?'''|"""[\s\S]*?""")/g;
    const numbers = /\b\d+(\.\d+)?\b/g;
    const comments = /(#[^\n]*)/g;

    let highlighted = code;
    highlighted = highlighted.replace(comments, '<span class="py-comment">$1</span>');
    highlighted = highlighted.replace(strings, '<span class="py-string">$1</span>');
    highlighted = highlighted.replace(keywords, '<span class="py-keyword">$1</span>');
    highlighted = highlighted.replace(numbers, '<span class="py-number">$1</span>');

    return highlighted;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.comandCopied = text;
      this.showModal();
    }).catch(err => {
      console.error('Error al copiar al portapapeles', err);
    });
  }

  showModal(): void {
    this.isModalVisible = true;
    setTimeout(() => {
      this.isModalVisible = false;
      this.comandCopied = '';
    }, 3000);
  }
}