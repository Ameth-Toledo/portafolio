import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card-contact',
  standalone: true,
  imports: [],
  templateUrl: './card-contact.component.html',
  styleUrl: './card-contact.component.css'
})
export class CardContactComponent {
  @Input() name: string = '';
  @Input() url: string = '';
  @Input() selected: boolean = false;
  @Output() selectedChange = new EventEmitter<boolean>();

  toggleSelection(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
  }

  handleCardClick(event: MouseEvent) {
    if (!this.selected) {
      // Solo abre el enlace si no está seleccionado
      window.open(this.url, '_blank', 'noopener,noreferrer');
    }
    this.selected = !this.selected;
    this.selectedChange.emit(this.selected);
  }
}
