import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-curso-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './card-curso-dashboard.component.html',
  styleUrls: ['./card-curso-dashboard.component.css']
})
export class CardCursoDashboardComponent {
  @Input() id: number = 0;
  @Input() nombre: string = '';
  @Input() descripcion: string = '';
  @Input() nivel: string = '';
  @Input() duracion: string = '';
  @Input() tecnologia: string = '';
  @Input() fecha: string = '';
  @Input() imagen: string = '';
  
  @Output() cardClick = new EventEmitter<number>();
  @Output() editCourse = new EventEmitter<any>();
  @Output() deleteCourse = new EventEmitter<number>();
  
  showDeleteModal = false;
  showEditModal = false;
  isSaving = false;
  
  niveles = ['Basico', 'Intermedio', 'Avanzado'];
  
  editData = {
    id: 0,
    nombre: '',
    descripcion: '',
    nivel: 'Basico',
    duracion: '',
    tecnologia: '',
    fecha: '',
    imagen: ''
  };

  constructor (private router: Router) {}

  onCardClick(): void {
    this.router.navigate(['/dashboard/modules'], {
      queryParams: { cursoId: this.id, nombreCurso: this.nombre }
    });
  }

  openDeleteModal(): void {
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
  }

  confirmDelete(): void {
    this.deleteCourse.emit(this.id);
    this.closeDeleteModal();
  }

  openEditModal(): void {
    // Cargar datos actuales en el formulario de edición
    this.editData = {
      id: this.id,
      nombre: this.nombre,
      descripcion: this.descripcion,
      nivel: this.nivel,
      duracion: this.duracion,
      tecnologia: this.tecnologia,
      fecha: this.fecha,
      imagen: this.imagen
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  onEditSubmit(): void {
    if (this.isEditFormValid() && !this.isSaving) {
      this.isSaving = true;
      this.editCourse.emit(this.editData);
      // El padre deberá manejar el cierre del modal después de guardar
    }
  }

  isEditFormValid(): boolean {
    return !!(
      this.editData.nombre.trim() &&
      this.editData.descripcion.trim() &&
      this.editData.nivel.trim() &&
      this.editData.duracion.trim() &&
      this.editData.tecnologia.trim() &&
      this.editData.fecha.trim() &&
      this.editData.imagen.trim()
    );
  }
}