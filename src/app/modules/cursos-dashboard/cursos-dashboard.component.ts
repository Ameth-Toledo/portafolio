import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardCursoDashboardComponent } from '../../components/card-curso-dashboard/card-curso-dashboard.component';
import { CursosService } from '../../services/cursos/cursos.service';
import { Curso } from '../../models/curso';

interface NuevoCurso {
  nombre: string;
  nivel: string;
  duracion: string;
  tecnologia: string;
  fecha: string;
  imagen: string;
  descripcion: string;
}

@Component({
  selector: 'app-cursos-dashboard',
  standalone: true,
  imports: [CommonModule, CardCursoDashboardComponent, FormsModule],
  templateUrl: './cursos-dashboard.component.html',
  styleUrl: './cursos-dashboard.component.css'
})
export class CursosDashboardComponent implements OnInit {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];
  terminoBusqueda: string = '';

  isModalOpen = false;
  isLoading = false;
  isSaving = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';

  isEditMode = false;
  cursoEditandoId: number | null = null;

  isListening = false;
  recognition: any;

  curso: NuevoCurso = {
    nombre: '',
    nivel: 'Basico',
    duracion: '',
    tecnologia: '',
    fecha: '',
    imagen: '',
    descripcion: ''
  };

  niveles = ['Basico', 'Intermedio', 'Avanzado'];

  constructor(private cursosService: CursosService) {
    const { webkitSpeechRecognition } = window as any;
    if (webkitSpeechRecognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.terminoBusqueda = transcript;
        this.filtrarCursos();
        this.isListening = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Error en el reconocimiento de voz:', event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };
    }
  }

  ngOnInit(): void {
    this.cargarCursos();
  }

  cargarCursos(): void {
    this.isLoading = true;
    this.cursosService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cursosFiltrados = [...cursos];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar cursos:', error);
        this.errorMessage = 'Error al cargar los cursos. Por favor, intenta de nuevo.';
        this.showErrorModal = true;
        this.isLoading = false;
      }
    });
  }

  private obtenerFechaActual(): string {
    const fecha = new Date();
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const dia = fecha.getDate();
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();

    return `${dia} de ${mes} del ${año}`;
  }

  filtrarCursos(): void {
    if (!this.terminoBusqueda.trim()) {
      this.cursosFiltrados = [...this.cursos];
      return;
    }

    const termino = this.terminoBusqueda.toLowerCase().trim();
    this.cursosFiltrados = this.cursos.filter(curso =>
      curso.nombre.toLowerCase().includes(termino) ||
      curso.descripcion.toLowerCase().includes(termino) ||
      curso.tecnologia.toLowerCase().includes(termino) ||
      curso.nivel.toLowerCase().includes(termino)
    );
  }

  onBuscar(): void {
    this.filtrarCursos();
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.cursosFiltrados = [...this.cursos];
  }

  toggleVoiceRecognition(): void {
    if (!this.recognition) {
      console.warn('Reconocimiento de voz no disponible');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      this.recognition.start();
      this.isListening = true;
    }
  }

  openModal(): void {
    this.resetForm();
    this.isEditMode = false;
    this.cursoEditandoId = null;
    this.isModalOpen = true;
    this.curso.fecha = this.obtenerFechaActual();

    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 150);
  }

  openEditModal(cursoAEditar: Curso): void {
    this.isEditMode = true;
    this.cursoEditandoId = cursoAEditar.id;
    this.isModalOpen = true;

    this.curso = {
      nombre: cursoAEditar.nombre,
      nivel: cursoAEditar.nivel,
      duracion: cursoAEditar.duracion,
      tecnologia: cursoAEditar.tecnologia,
      fecha: cursoAEditar.fecha,
      imagen: cursoAEditar.imagen,
      descripcion: cursoAEditar.descripcion
    };

    setTimeout(() => {
      document.body.style.overflow = 'hidden';
    }, 150);
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.isSaving = false;
    this.isEditMode = false;
    this.cursoEditandoId = null;
    this.resetForm();
    document.body.style.overflow = 'auto';
  }

  resetForm(): void {
    this.curso = {
      nombre: '',
      nivel: 'Basico',
      duracion: '',
      tecnologia: '',
      fecha: '',
      imagen: '',
      descripcion: ''
    };
    this.isSaving = false;
  }

  onSubmit(): void {
    if (this.isValidForm() && !this.isSaving) {
      this.isSaving = true;

      const cursoData = {
        nombre: this.curso.nombre.trim(),
        nivel: this.curso.nivel,
        duracion: this.curso.duracion.trim(),
        tecnologia: this.curso.tecnologia.trim(),
        fecha: this.curso.fecha.trim(),
        imagen: this.curso.imagen.trim(),
        descripcion: this.curso.descripcion.trim()
      };

      if (this.isEditMode && this.cursoEditandoId) {
        const cursoCompleto: Curso = {
          id: this.cursoEditandoId,
          ...cursoData
        };

        this.cursosService.updateCurso(cursoCompleto).subscribe({
          next: (cursoActualizado) => {
            this.isSaving = false;

            const index = this.cursos.findIndex(c => c.id === this.cursoEditandoId);
            if (index !== -1) {
              this.cursos[index] = cursoActualizado;
              this.filtrarCursos();
            }

            this.closeModal();
            setTimeout(() => {
              this.showSuccessModal = true;
            }, 100);
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = error.error?.message || 'Error al actualizar el curso. Por favor, intenta de nuevo.';
            setTimeout(() => {
              this.showErrorModal = true;
            }, 100);
          }
        });
      } else {
        this.cursosService.createCurso(cursoData).subscribe({
          next: (cursoCreado) => {
            this.isSaving = false;
            this.cursos.push(cursoCreado);
            this.filtrarCursos();
            this.closeModal();
            setTimeout(() => {
              this.showSuccessModal = true;
            }, 100);
          },
          error: (error) => {
            this.isSaving = false;
            this.errorMessage = error.error?.message || 'Error al crear el curso. Por favor, intenta de nuevo.';
            setTimeout(() => {
              this.showErrorModal = true;
            }, 100);
          }
        });
      }
    }
  }

  isValidForm(): boolean {
    return !!(
      this.curso.nombre.trim() &&
      this.curso.duracion.trim() &&
      this.curso.tecnologia.trim() &&
      this.curso.fecha.trim() &&
      this.curso.imagen.trim() &&
      this.curso.descripcion.trim()
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  eliminarCurso(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este curso?')) {
      this.cursosService.deleteCurso(id).subscribe({
        next: () => {
          this.cursos = this.cursos.filter(c => c.id !== id);
          this.filtrarCursos();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el curso. Por favor, intenta de nuevo.';
          this.showErrorModal = true;
        }
      });
    }
  }
}