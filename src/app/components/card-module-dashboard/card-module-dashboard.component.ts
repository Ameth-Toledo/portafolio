import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-card-module-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  showEditModal = false;
  isSaving = false;
  
  editData = {
    titulo: '',
    imagen_portada: '',
    descripcion: ''
  };

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
    this.editData = {
      titulo: this.title,
      imagen_portada: this.imageUrl,
      descripcion: this.description
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEditSubmit(): void {
    if (this.isEditFormValid() && !this.isSaving) {
      this.isSaving = true;
      const updatedData = {
        ...this.editData,
        id: this.moduloId
      };
      this.editModule.emit(updatedData);
    }
  }

  isEditFormValid(): boolean {
    return !!(
      this.editData.titulo.trim() &&
      this.editData.imagen_portada.trim() &&
      this.editData.descripcion.trim()
    );
  }
}