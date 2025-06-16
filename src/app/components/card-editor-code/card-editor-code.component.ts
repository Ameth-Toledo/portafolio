import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightService } from '../../services/highlight/highlight.service';

@Component({
  selector: 'app-card-editor-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-editor-code.component.html',
  styleUrl: './card-editor-code.component.css'
})
export class CardEditorCodeComponent  implements OnChanges {
  @Input() code: string = '';
  @Input() language: string = 'html';
  @Input() filename: string = '';
  @Input() tecnologyImg: string = '';
  
  displayedCode: string = '';
  lineNumbers: number[] = [];

  constructor(private highlightService: HighlightService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['code'] || changes['language']) {
      this.updateDisplay();
    }
  }

  private updateDisplay(): void {
    this.displayedCode = this.highlightService.highlightCode(this.code, this.language);
    this.calculateLineNumbers(this.code);
  }

  private calculateLineNumbers(rawCode: string): void {
    if (!rawCode) {
      this.lineNumbers = [];
      return;
    }

    const cleanedCode = rawCode
      .replace(/\s+$/, '')  // Elimina espacios al final
      .replace(/\n+$/, ''); // Elimina saltos de línea al final

    const lines = cleanedCode.split('\n');
    this.lineNumbers = Array.from({length: lines.length}, (_, i) => i + 1);
  }
}
