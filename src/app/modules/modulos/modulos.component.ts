import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { ModulosService } from '../../services/modulos/modulos.service';
import { CursosService } from '../../services/cursos/cursos.service';
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CardModuloComponent } from "../../components/card-modulo/card-modulo.component";
import { CommonModule } from '@angular/common';
import { Modulo } from '../../models/modulo';
import { Curso } from '../../models/curso';
import { RedesSocialesComponent } from "../../components/redes-sociales/redes-sociales.component";

@Component({
  selector: 'app-modulos',
  standalone: true,
  imports: [CommonModule, TecnologiasComponent, CardTecnologyComponent, CardModuloComponent, RedesSocialesComponent],
  templateUrl: './modulos.component.html',
  styleUrl: './modulos.component.css'
})
export class ModulosComponent implements OnInit, OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  modulos: Modulo[] = [];
  filteredModulos: Modulo[] = [];
  cursoId: number = 0;
  nombreCurso: string = '';
  curso: Curso | null = null;
  
  recognition: any;
  isListening = false;
  cargando = false;

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
      next: (curso) => {
        this.curso = curso;
        this.nombreCurso = curso.nombre;
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
        this.modulos = modulos;
        this.filteredModulos = [...modulos];
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar módulos:', err);
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

    this.modulosService.searchModulosByNombreAndCurso(termino, this.cursoId).subscribe({
      next: (modulos) => {
        this.filteredModulos = modulos;
      },
      error: (err) => {
        console.error('Error al buscar módulos:', err);
      }
    });
  }

  sendToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['blog']);
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
}