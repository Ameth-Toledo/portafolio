import { Component, Input, AfterViewInit } from '@angular/core';
import hljs from 'highlight.js';

@Component({
  selector: 'app-code-block',
  standalone: true,
  imports: [],
  template: `
    <div class="code-block">
      @if (filename) {
        <div class="code-header">
          <span class="filename">{{ filename }}</span>
        </div>
      }
      <div class="code-container">
        <div class="line-numbers">
          @for (line of lineNumbers; track line) {
            <span>{{ line }}</span>
          }
        </div>
        <pre><code [class]="highlightClass" [innerHTML]="highlightedCode"></code></pre>
      </div>
    </div>
  `,
  styles: [`
    .code-block {
      background: #0d1117 !important;
      border-radius: 8px;
      overflow: hidden;
      font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.6;
      border: 1px solid #30363d;
      width: 100%;
    }
    .code-header {
      background: #161b22;
      padding: 8px 14px;
      border-bottom: 1px solid #30363d;
    }
    .filename {
      color: #8b949e;
      font-size: 11px;
      font-family: 'Poppins', sans-serif;
    }
    .code-container {
      display: flex;
      padding: 12px 0;
      overflow-x: auto;
      background: #0d1117 !important;
    }
    .line-numbers {
      display: flex;
      flex-direction: column;
      padding: 0 12px 0 14px;
      text-align: right;
      color: #484f58;
      user-select: none;
      border-right: 1px solid #21262d;
      min-width: 40px;
    }
    .line-numbers span {
      height: 20.8px;
      line-height: 20.8px;
      font-size: 12px;
    }
    pre {
      margin: 0;
      padding: 0 14px;
      flex: 1;
      overflow-x: auto;
      white-space: pre;
      tab-size: 2;
      background: #0d1117 !important;
    }
    pre code {
      background: #0d1117 !important;
      color: #c9d1d9 !important;
      padding: 0 !important;
      white-space: pre;
      font-family: 'Fira Code', 'Consolas', 'Courier New', monospace;
    }

    /* ── Endpoints ── */
    :host ::ng-deep .method-post   { color: #7ee787; font-weight: 600; }
    :host ::ng-deep .method-get    { color: #79c0ff; font-weight: 600; }
    :host ::ng-deep .method-put    { color: #ffa657; font-weight: 600; }
    :host ::ng-deep .method-delete { color: #ff7b72; font-weight: 600; }
    :host ::ng-deep .endpoint-path { color: #e6edf3; }
    :host ::ng-deep .endpoint-protected { color: #484f58; font-style: italic; }

    /* ── .env ── */
    :host ::ng-deep .env-key    { color: #79c0ff; }
    :host ::ng-deep .env-equals { color: #6e7681; }
    :host ::ng-deep .env-value  { color: #7ee787; }

    @media (max-width: 767px) {
      .code-block { font-size: 11px; }
      .code-container { padding: 10px 0; }
    }
  `]
})
export class CodeBlockComponent implements AfterViewInit {
  @Input() code: string = '';
  @Input() language: string = 'bash';
  @Input() filename?: string;

  highlightedCode: string = '';
  highlightClass: string = '';
  lineNumbers: number[] = [];

  ngAfterViewInit() {
    this.highlight();
  }

  private highlight() {
    const langMap: Record<string, string> = {
      'bash':       'bash',
      'sh':         'bash',
      'sql':        'sql',
      'typescript': 'typescript',
      'ts':         'typescript',
      'javascript': 'javascript',
      'js':         'javascript',
      'env':        'plaintext',
      'plaintext':  'plaintext',
    };

    const lang = langMap[this.language] || 'bash';
    this.highlightClass = `language-${lang}`;

    const lines = this.code.split('\n');
    this.lineNumbers = Array.from({ length: lines.length }, (_, i) => i + 1);

    if (this.language === 'plaintext') {
      this.highlightedCode = this.highlightEndpoints(this.code);
      return;
    }

    if (this.language === 'env') {
      this.highlightedCode = this.highlightEnv(this.code);
      return;
    }

    try {
      const result = hljs.highlight(this.code, { language: lang });
      this.highlightedCode = result.value;
    } catch {
      this.highlightedCode = this.escapeHtml(this.code);
    }
  }

  private highlightEndpoints(code: string): string {
    const methodColors: Record<string, string> = {
      'POST':   'method-post',
      'GET':    'method-get',
      'PUT':    'method-put',
      'DELETE': 'method-delete',
    };

    return code
      .split('\n')
      .map(line => {
        const match = line.match(/^(\s*)(POST|GET|PUT|DELETE)(\s+)(\/\S+)(\s+)?(\(protegido\))?(.*)$/);
        if (!match) return this.escapeHtml(line);

        const [, indent, method, space1, path, space2 = '', protected_ = '', rest] = match;
        const methodClass = methodColors[method] ?? '';

        return (
          this.escapeHtml(indent) +
          `<span class="${methodClass}">${method}</span>` +
          this.escapeHtml(space1) +
          `<span class="endpoint-path">${this.escapeHtml(path)}</span>` +
          this.escapeHtml(space2) +
          (protected_ ? `<span class="endpoint-protected">${this.escapeHtml(protected_)}</span>` : '') +
          this.escapeHtml(rest)
        );
      })
      .join('\n');
  }

  private highlightEnv(code: string): string {
    return code
      .split('\n')
      .map(line => {
        if (line.trim() === '' || line.trim().startsWith('#')) {
          return `<span class="env-comment">${this.escapeHtml(line)}</span>`;
        }

        const eqIndex = line.indexOf('=');
        if (eqIndex === -1) return this.escapeHtml(line);

        const key   = line.slice(0, eqIndex);
        const value = line.slice(eqIndex + 1);

        return (
          `<span class="env-key">${this.escapeHtml(key)}</span>` +
          `<span class="env-equals">=</span>` +
          `<span class="env-value">${this.escapeHtml(value)}</span>`
        );
      })
      .join('\n');
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}