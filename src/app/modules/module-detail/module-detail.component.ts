import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contenido } from '../../models/contenido';
import { ContenidoService } from '../../services/contenido/contenido.service';
import { FormsModule } from '@angular/forms';
import { ModulosService } from '../../services/modulos/modulos.service';
import { ComentariosService } from '../../services/comentarios/comentarios.service';
import { ChatbotComponent } from "../../components/chatbot/chatbot.component";
import { CardModuleDescriptionComponent } from "../../components/card-module-description/card-module-description.component";
import { ReproductorVideoComponent } from "../../components/reproductor-video/reproductor-video.component";
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ChatbotComponent, 
    CardModuleDescriptionComponent, 
    ReproductorVideoComponent
  ],
  providers: [ComentariosService],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.css'
})
export class ModuleDetailComponent implements OnInit, OnDestroy {
  modulo: Contenido | null = null;
  loading = true;
  error: string | null = null;
  cursoId: number | null = null;
  nombreCurso: string | null = null;

  showFinalModal: boolean = false;
  comentarios: any[] = [];
  nuevoComentario = '';
  cargandoComentarios = true;
  editandoComentario: string | null = null;
  textoEditando: string = '';

  likes: any[] = [];
  likesCount = 0;
  userHasLiked = false;
  loadingLikes = false;

  showMercadoPagoModal = false;
  selectedAmount = '50.00';
  customAmount: number | null = null;
  mercadoPagoLoaded = false;

  quickAmounts = [
    { value: '20.00', label: 'Un café ☕' },
    { value: '50.00', label: 'Desayuno 🥐' },
    { value: '100.00', label: 'Comida 🍕' },
    { value: '200.00', label: 'Cena 🍽️' },
    { value: '500.00', label: '¡Eres increíble! 🎉' },
    { value: '1000.00', label: '¡Súper apoyo! 🌟' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contenidoService: ContenidoService,
    private modulosService: ModulosService,
    private comentariosService: ComentariosService,
    private authService: AuthService
  ) { }

  getCurrentUserId(): number | null {
    const user = this.authService.getCurrentUser();
    console.log('Usuario actual en componente:', user);
    return user ? user.userId : null;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idModulo = params['id_modulo'];
      this.cursoId = params['cursoId'] ? Number(params['cursoId']) : null;
      this.nombreCurso = params['nombreCurso'] || null;

      if (idModulo) {
        this.loadModulo(Number(idModulo));
      } else {
        this.error = 'No se proporcionó ID de módulo';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
  }

  loadModulo(idModulo: number): void {
    console.log('Cargando módulo con ID:', idModulo);
    this.loading = true;
    this.error = null;

    this.contenidoService.getContenidoByModulo(idModulo).subscribe({
      next: (contenidos) => {
        console.log('Contenidos recibidos:', contenidos);
        if (contenidos && contenidos.length > 0) {
          this.modulo = contenidos[0];
          console.log('Módulo cargado:', this.modulo);
          this.cargarComentarios(idModulo);
        } else {
          console.error('No se encontraron contenidos para el módulo:', idModulo);
          this.error = 'No se encontró contenido para este módulo';
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar el módulo:', err);
        this.error = 'Error al cargar el contenido del módulo';
        this.loading = false;
      }
    });
  }

  goBack(): void {
    if (this.cursoId && this.nombreCurso) {
      this.router.navigate(['/modulos'], {
        queryParams: {
          cursoId: this.cursoId,
          nombreCurso: this.nombreCurso
        }
      });
    } else {
      this.router.navigate(['/modulos']);
    }
  }

  goToNextModule(): void {
    if (!this.modulo || !this.cursoId) {
      console.error('No hay módulo actual o curso ID');
      return;
    }

    console.log('=== NAVEGACIÓN AL SIGUIENTE MÓDULO ===');
    console.log('Curso actual ID:', this.cursoId);
    console.log('Módulo actual ID:', this.modulo.id_modulo);

    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (todosLosModulos) => {
        console.log('Todos los módulos recibidos del servicio:', todosLosModulos);

        const modulosDelCursoActual = todosLosModulos.filter(m => m.id_curso === this.cursoId);
        console.log('Módulos filtrados del curso actual:', modulosDelCursoActual);

        modulosDelCursoActual.sort((a, b) => a.id - b.id);
        console.log('Módulos ordenados del curso actual:', modulosDelCursoActual);

        const currentIndex = modulosDelCursoActual.findIndex(m => m.id === this.modulo!.id_modulo);
        console.log(`Posición actual: ${currentIndex + 1} de ${modulosDelCursoActual.length} módulos`);

        if (currentIndex !== -1) {
          if (currentIndex < modulosDelCursoActual.length - 1) {
            const nextModulo = modulosDelCursoActual[currentIndex + 1];
            console.log('✅ Navegando al siguiente módulo del mismo curso:', nextModulo);

            const queryParams: any = { id_modulo: nextModulo.id };
            if (this.cursoId) queryParams.cursoId = this.cursoId;
            if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;

            this.router.navigate(['/modulo/detail'], {
              queryParams: queryParams
            });
          } else {
            console.log('🎉 Es el último módulo del curso actual, mostrando modal final');
            this.openFinalModal();
          }
        } else {
          console.error('❌ Error: No se encontró el módulo actual en la lista del curso');
          console.log('🔄 Fallback: Mostrando modal final');
          this.openFinalModal();
        }
      },
      error: (err) => {
        console.error('❌ Error al verificar módulos del curso:', err);
        alert('No se pudo verificar si hay más módulos en este curso.');
      }
    });
  }

  goToPreviousModule(): void {
    if (!this.modulo || !this.cursoId) {
      return;
    }

    console.log('=== NAVEGACIÓN AL MÓDULO ANTERIOR ===');
    console.log('Curso actual ID:', this.cursoId);
    console.log('Módulo actual ID:', this.modulo.id_modulo);

    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (todosLosModulos) => {
        const modulosDelCursoActual = todosLosModulos.filter(m => m.id_curso === this.cursoId);
        console.log('Módulos del curso actual:', modulosDelCursoActual);

        modulosDelCursoActual.sort((a, b) => a.id - b.id);

        const currentIndex = modulosDelCursoActual.findIndex(m => m.id === this.modulo!.id_modulo);
        console.log(`Posición actual: ${currentIndex + 1} de ${modulosDelCursoActual.length} módulos`);

        if (currentIndex > 0) {
          const previousModulo = modulosDelCursoActual[currentIndex - 1];
          console.log('✅ Navegando al módulo anterior del mismo curso:', previousModulo);

          const queryParams: any = { id_modulo: previousModulo.id };
          if (this.cursoId) queryParams.cursoId = this.cursoId;
          if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;

          this.router.navigate(['/modulo/detail'], {
            queryParams: queryParams
          });
        } else {
          console.log('ℹ️ Este es el primer módulo del curso.');
          alert('Este es el primer módulo del curso.');
        }
      },
      error: (err) => {
        console.error('❌ Error al verificar módulos del curso:', err);
        alert('No se pudo verificar el módulo anterior.');
      }
    });
  }

  openRepository(): void {
    if (this.modulo?.repositorio) {
      window.open(this.modulo.repositorio, '_blank');
    } else {
      alert('No hay repositorio disponible para este módulo');
    }
  }

  openFinalModal(): void {
    this.showFinalModal = true;
  }

  closeFinalModal(): void {
    this.showFinalModal = false;
    this.goBack();
  }

  cargarComentarios(moduloId: number): void {
    this.cargandoComentarios = true;
    const currentUserId = this.getCurrentUserId();
    console.log('ID del usuario actual al cargar comentarios:', currentUserId);
    
    this.comentariosService.getComentariosPorModulo(moduloId.toString())
      .subscribe({
        next: (actions) => {
          this.comentarios = actions.map((a: any) => {
            const data = a.payload.val();
            const key = a.payload.key;
            
            console.log('Comentario:', {
              key: key,
              autor: data.autor,
              usuario_id: data.usuario_id,
              currentUserId: currentUserId,
              canEdit: data.canEdit
            });
            
            return { key, ...data };
          });
          this.cargandoComentarios = false;
        },
        error: (err) => {
          console.error('Error al cargar comentarios:', err);
          this.cargandoComentarios = false;
        }
      });
  }

  agregarComentario(): void {
    if (!this.nuevoComentario.trim() || !this.modulo) return;

    this.comentariosService.agregarComentario(
      this.modulo.id_modulo.toString(),
      this.nuevoComentario
    ).then(() => {
      this.nuevoComentario = '';
      this.cargarComentarios(this.modulo!.id_modulo);
    }).catch((err: any) => {
      console.error('Error al agregar comentario:', err);
      alert('Error al agregar el comentario');
    });
  }

  editarComentario(key: string, textoActual: string): void {
    this.editandoComentario = key;
    this.textoEditando = textoActual;
  }

  cancelarEdicion(): void {
    this.editandoComentario = null;
    this.textoEditando = '';
  }

  guardarEdicion(key: string): void {
    if (!this.textoEditando.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    const comentarioOriginal = this.comentarios.find(c => c.key === key);
    if (!comentarioOriginal) {
      alert('Error: No se encontró el comentario original');
      return;
    }

    this.editarComentarioCompleto(key, comentarioOriginal.modulo_id, comentarioOriginal.usuario_id, this.textoEditando);
  }

  editarComentarioCompleto(key: string, moduloId: number, usuarioId: number, nuevoTexto: string): void {
    const comentario = {
      modulo_id: moduloId,
      usuario_id: usuarioId,
      texto: nuevoTexto
    };

    this.comentariosService.editarComentarioCompleto(key, comentario)
      .then(() => {
        this.editandoComentario = null;
        this.textoEditando = '';
        if (this.modulo) {
          this.cargarComentarios(this.modulo.id_modulo);
        }
      })
      .catch((err: any) => {
        console.error('Error al editar comentario:', err);
        alert('Error al editar el comentario');
      });
  }

  eliminarComentario(key: string): void {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      this.comentariosService.eliminarComentario(key).then(() => {
        if (this.modulo) {
          this.cargarComentarios(this.modulo.id_modulo);
        }
      }).catch((err: any) => {
        console.error('Error al eliminar comentario:', err);
        alert('Error al eliminar el comentario');
      });
    }
  }

  handleTextareaKeydown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === ' ') {
      keyboardEvent.preventDefault();
      keyboardEvent.stopPropagation();

      const target = keyboardEvent.target as HTMLTextAreaElement;
      if (target) {
        const start = target.selectionStart;
        const end = target.selectionEnd;

        this.nuevoComentario =
          this.nuevoComentario.substring(0, start) +
          ' ' +
          this.nuevoComentario.substring(end);

        setTimeout(() => {
          target.selectionStart = target.selectionEnd = start + 1;
        });
      }
    }
  }
}