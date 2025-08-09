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
        // La API devuelve un objeto con la propiedad 'curso'
        this.curso = response.curso || response;
        this.nombreCurso = this.curso?.nombre || this.nombreCurso;
      },
      error: (err) => {
        console.error('Error al cargar datos del curso:', err);
      }
    });
  }

  cargarModulos(): void {
    this.cargando = true;
    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (modulos) => {
        // Filtrar los módulos para asegurar que solo se muestren los del curso seleccionado
        this.modulos = modulos.filter(modulo => modulo.id_curso === this.cursoId);
        this.filteredModulos = [...this.modulos];
        this.cargando = false;
        
        console.log(`Cargados ${this.modulos.length} módulos para el curso ${this.cursoId}`);
      },
      error: (err) => {
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
      // Si no hay término de búsqueda, mostrar todos los módulos del curso actual
      this.filteredModulos = [...this.modulos];
      return;
    }

    // Primero filtrar localmente entre los módulos ya cargados del curso
    this.filteredModulos = this.modulos.filter(modulo =>
      modulo.titulo.toLowerCase().includes(termino.toLowerCase()) ||
      modulo.descripcion.toLowerCase().includes(termino.toLowerCase())
    );

    // Opcionalmente, también hacer búsqueda en el servidor para más precisión
    // pero asegurándose de que solo devuelva módulos del curso actual
    if (this.cursoId) {
      this.modulosService.searchModulosByNombreAndCurso(termino, this.cursoId).subscribe({
        next: (modulos) => {
          // Doble verificación: filtrar por curso ID
          this.filteredModulos = modulos.filter(modulo => modulo.id_curso === this.cursoId);
        },
        error: (err) => {
          console.error('Error al buscar módulos:', err);
          // En caso de error, mantener el filtrado local
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
    this.router.navigate(['modulo/detail'], { 
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
  }

  onSubmit(): void {
    if (this.isValidForm() && !this.isSaving) {
      this.isSaving = true;
      
      const moduloData = {
        ...this.nuevoModulo,
        id_curso: this.cursoId
      };

      this.modulosService.createModulo(moduloData).subscribe({
        next: (moduloCreado) => {
          // Verificar que el módulo creado pertenece al curso actual antes de agregarlo
          if (moduloCreado.id_curso === this.cursoId) {
            this.modulos.push(moduloCreado);
            this.filteredModulos = [...this.modulos];
          }
          this.closeModal();
          this.showSuccessModal = true;
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Error al crear módulo:', error);
          this.errorMessage = error.error?.message || 'Error al crear el módulo. Por favor, intenta de nuevo.';
          this.showErrorModal = true;
          this.isSaving = false;
        }
      });
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
}