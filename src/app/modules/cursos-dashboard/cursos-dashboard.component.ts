import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardCursoDashboardComponent } from '../../components/card-curso-dashboard/card-curso-dashboard.component';
import { CursosService } from '../../services/cursos/cursos.service';
import { Curso } from '../../models/curso';

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
  
  // Estados de carga y modales
  isModalOpen = false;
  isLoading = false;
  isSaving = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  
  // Reconocimiento de voz
  isListening = false;
  recognition: any;
  
  nuevoCurso = {
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
    // Configurar reconocimiento de voz
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

  // Método para filtrar cursos basado en el término de búsqueda
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

  // Método para manejar la búsqueda por texto
  onBuscar(): void {
    this.filtrarCursos();
  }

  // Método para limpiar la búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.cursosFiltrados = [...this.cursos];
  }

  // Método para toggle del reconocimiento de voz
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
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nuevoCurso = {
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
      
      this.cursosService.createCurso(this.nuevoCurso).subscribe({
        next: (cursoCreado) => {
          this.cursos.push(cursoCreado);
          this.filtrarCursos(); // Actualizar lista filtrada
          this.closeModal();
          this.showSuccessModal = true;
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error al crear curso:', error);
          this.errorMessage = error.error?.message || 'Error al crear el curso. Por favor, intenta de nuevo.';
          this.showErrorModal = true;
          this.isSaving = false;
        }
      });
    }
  }

  isValidForm(): boolean {
    return !!(
      this.nuevoCurso.nombre.trim() &&
      this.nuevoCurso.duracion.trim() &&
      this.nuevoCurso.tecnologia.trim() &&
      this.nuevoCurso.fecha.trim() &&
      this.nuevoCurso.imagen.trim() &&
      this.nuevoCurso.descripcion.trim()
    );
  }

  // Métodos para manejar modales de éxito y error
  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  // Método para recargar cursos después de un error
  recargarCursos(): void {
    this.closeErrorModal();
    this.cargarCursos();
  }
}