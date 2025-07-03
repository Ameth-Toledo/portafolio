import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-modulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-modulo.component.html',
  styleUrl: './card-modulo.component.css'
})
export class CardModuloComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() moduloId: number = 0;

  @Output() cardClick = new EventEmitter<number>(); 
    
  onCardClick(): void {
    if (this.moduloId > 0) {
      this.cardClick.emit(this.moduloId);
    }
  }
}
