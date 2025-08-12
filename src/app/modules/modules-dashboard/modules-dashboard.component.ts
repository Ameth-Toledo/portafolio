import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { ModulosService } from '../../services/modulos/modulos.service';
import { CursosService } from '../../services/cursos/cursos.service';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CommonModule } from '@angular/common';
import { Modulo } from '../../models/modulo';
import { Curso } from '../../models/curso';
import { RedesSocialesComponent } from "../../components/redes-sociales/redes-sociales.component";
import { ChatbotComponent } from "../../components/chatbot/chatbot.component";
import { FormsModule } from '@angular/forms';
import { CardModuleDashboardComponent } from "../../components/card-module-dashboard/card-module-dashboard.component";

@Component({
  selector: 'app-modules-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TecnologiasComponent, CardTecnologyComponent, RedesSocialesComponent, ChatbotComponent, CardModuleDashboardComponent],
  templateUrl: './modules-dashboard.component.html',
  styleUrl: './modules-dashboard.component.css'
})
export class ModulesDashboardComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  modulos: Modulo[] = [];
  filteredModulos: Modulo[] = [];
  cursoId: number = 0;
  nombreCurso: string = '';
  curso: Curso | null = null;

  recognition: any;
  isListening = false;
  cargando = false;

  isModalOpen = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  isSaving = false;

  isEditMode = false;
  moduloEditandoId: number | null = null;

  nuevoModulo = {
    titulo: '',
    imagen_portada: '',
    descripcion: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private animationService: AnimationService,
    private modulosService: ModulosService,
    private cursosService: CursosService
  ) {
    const { webkitSpeechRecognition } = window as any;
    if (webkitSpeechRecognition) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES';

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.searchInput.nativeElement.value = transcript;
        this.buscarModulos(transcript);
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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.cursoId = +params['cursoId'] || 0;
      this.nombreCurso = params['nombreCurso'] || '';

      if (this.cursoId) {
        this.cargarDatosCurso();
        this.cargarModulos();
      }
    });

    this.configurarBusqueda();

    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  cargarDatosCurso(): void {
    this.cursosService.getCursoById(this.cursoId).subscribe({
      next: (response: any) => {
        this.curso = response.curso || response;
        this.nombreCurso = this.curso?.nombre || this.nombreCurso;
      },
      error: (err: any) => {
        console.error('Error al cargar datos del curso:', err);
      }
    });
  }

  cargarModulos(): void {
    this.cargando = true;
    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (modulos) => {
        this.modulos = modulos.filter(modulo => modulo.id_curso === this.cursoId);
        this.filteredModulos = [...this.modulos];
        this.cargando = false;

        console.log(`Cargados ${this.modulos.length} módulos para el curso ${this.cursoId}`);
      },
      error: (err: any) => {
        console.error('Error al cargar módulos:', err);
        this.modulos = [];
        this.filteredModulos = [];
        this.cargando = false;
      }
    });
  }

  configurarBusqueda(): void {
    setTimeout(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.addEventListener('input', (event: any) => {
          this.buscarModulos(event.target.value);
        });
      }
    }, 100);
  }

  buscarModulos(termino: string): void {
    if (!termino.trim()) {
      this.filteredModulos = [...this.modulos];
      return;
    }

    this.filteredModulos = this.modulos.filter(modulo =>
      modulo.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(termino.toLowerCase())
    );

    if (this.cursoId) {
      this.modulosService.searchModulosByNombreAndCurso(termino, this.cursoId).subscribe({
        next: (modulos) => {
          this.filteredModulos = modulos.filter(modulo => modulo.id_curso === this.cursoId);
        },
        error: (err: any) => {
          console.error('Error al buscar módulos:', err);
          this.filteredModulos = this.modulos.filter(modulo =>
            modulo.titulo.toLowerCase().includes(termino.toLowerCase()) ||
            modulo.descripcion.toLowerCase().includes(termino.toLowerCase())
          );
        }
      });
    }
  }

  sendToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['dashboard/cursos']);
  }

  regresarACursos(): void {
    this.router.navigate(['/courses']);
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

  navigateToModuleDetail(moduloId: number): void {
    console.log('Navegando al detalle del módulo:', moduloId);
    console.log('Parámetros de navegación:', {
      id_modulo: moduloId,
      cursoId: this.cursoId,
      nombreCurso: this.nombreCurso
    });

    // Actualizar la ruta para usar la nueva ruta del dashboard
    this.router.navigate(['dashboard/module/detail'], {
      queryParams: {
        id_modulo: moduloId,
        cursoId: this.cursoId,
        nombreCurso: this.nombreCurso
      }
    });
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.resetForm();
  }

  resetForm(): void {
    this.nuevoModulo = {
      titulo: '',
      imagen_portada: '',
      descripcion: ''
    };
    this.isSaving = false;
    this.isEditMode = false;
    this.moduloEditandoId = null;
  }

  onSubmit(): void {
    if (this.isValidForm() && !this.isSaving) {
      this.isSaving = true;

      const moduloData = {
        titulo: this.nuevoModulo.titulo.trim(),
        imagen_portada: this.nuevoModulo.imagen_portada.trim(),
        descripcion: this.nuevoModulo.descripcion.trim(),
        id_curso: this.cursoId
      };

      if (this.isEditMode && this.moduloEditandoId) {
        const moduloCompleto = {
          id: this.moduloEditandoId,
          ...moduloData
        };

        this.modulosService.updateModulo(moduloCompleto).subscribe({
          next: (moduloActualizado) => {
            const index = this.modulos.findIndex(m => m.id === this.moduloEditandoId);
            if (index !== -1) {
              this.modulos[index] = moduloActualizado;
              this.filteredModulos = [...this.modulos];
            }

            this.closeModal();
            this.showSuccessModal = true;
          },
          error: (error: any) => {
            console.error('Error al actualizar módulo:', error);
            this.errorMessage = error.error?.message || 'Error al actualizar el módulo. Por favor, intenta de nuevo.';
            this.showErrorModal = true;
            this.isSaving = false;
          }
        });
      } else {
        this.modulosService.createModulo(moduloData).subscribe({
          next: (moduloCreado) => {
            if (moduloCreado.id_curso === this.cursoId) {
              this.modulos.push(moduloCreado);
              this.filteredModulos = [...this.modulos];
            }
            
            this.closeModal();
            this.showSuccessModal = true;
          },
          error: (error: any) => {
            console.error('Error al crear módulo:', error);
            this.errorMessage = error.error?.message || 'Error al crear el módulo. Por favor, intenta de nuevo.';
            this.showErrorModal = true;
            this.isSaving = false;
          }
        });
      }
    }
  }

  isValidForm(): boolean {
    return !!(
      this.nuevoModulo.titulo.trim() &&
      this.nuevoModulo.imagen_portada.trim() &&
      this.nuevoModulo.descripcion.trim()
    );
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
  }

  closeErrorModal(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  recargarModulos(): void {
    this.closeErrorModal();
    this.cargarModulos();
  }

  openEditModalModulo(moduloData: any): void {
    this.isEditMode = true;
    this.moduloEditandoId = moduloData.id;

    this.nuevoModulo = {
      titulo: moduloData.titulo,
      imagen_portada: moduloData.imagen_portada,
      descripcion: moduloData.descripcion
    };

    this.isModalOpen = true;
  }

  eliminarModulo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este módulo? Esta acción también eliminará todo su contenido y no se puede deshacer.')) {
      this.modulosService.deleteModulo(id).subscribe({
        next: () => {
          this.modulos = this.modulos.filter(m => m.id !== id);
          this.filteredModulos = this.filteredModulos.filter(m => m.id !== id);
          console.log('Módulo eliminado exitosamente');
        },
        error: (error: any) => {
          console.error('Error al eliminar módulo:', error);
          this.errorMessage = 'Error al eliminar el módulo. Por favor, intenta de nuevo.';
          this.showErrorModal = true;
        }
      });
    }
  }
}