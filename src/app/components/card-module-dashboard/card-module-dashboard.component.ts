import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-module-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-module-dashboard.component.html',
  styleUrl: './card-module-dashboard.component.css'
})
export class CardModuleDashboardComponent {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() moduloId: number = 0;

  @Output() cardClick = new EventEmitter<number>();
  @Output() editModule = new EventEmitter<any>();
  @Output() deleteModule = new EventEmitter<number>();
  
  showDeleteModal = false;

  onCardClick(): void {
    if (this.moduloId > 0) {
      this.cardClick.emit(this.moduloId);
    }
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.deleteModule.emit(this.moduloId);
    this.closeDeleteModal();
  }

  openEditModal(): void {
    const moduleData = {
      id: this.moduloId,
      titulo: this.title,
      imagen_portada: this.imageUrl,
      descripcion: this.description
    };
    this.editModule.emit(moduleData);
  }
}