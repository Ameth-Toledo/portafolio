import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contenido } from '../../models/contenido';
import { ContenidoService } from '../../services/contenido/contenido.service';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';
import { ModulosService } from '../../services/modulos/modulos.service';
import { ComentariosService, Comentario } from '../../services/comentarios/comentarios.service';
import { LikesService } from '../../services/likes/likes.service'; 

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe],
  providers: [ComentariosService, LikesService], 
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.css'
})
export class ModuleDetailComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  modulo: Contenido | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  loading = true;
  error: string | null = null;

  cursoId: number | null = null;
  nombreCurso: string | null = null;

  isPlaying = false;
  isMuted = false;
  showControls = true;
  progressPercent = 0;
  currentTime = 0;
  duration = 0;
  volume = 0.7;
  private controlsTimeout: any;
  private hideControlsDelay = 3000;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private contenidoService: ContenidoService,
    private modulosService: ModulosService,
    private comentariosService: ComentariosService,
    private likesService: LikesService, 
  ) { }

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

  loadModulo(idModulo: number): void {
    this.loading = true;
    this.error = null;

    this.contenidoService.getContenidoByModulo(idModulo).subscribe({
      next: (contenidos) => {
        if (contenidos && contenidos.length > 0) {
          this.modulo = contenidos[0];
          this.setupVideoUrl();
          this.cargarComentarios(idModulo);
          this.cargarLikes(idModulo);
        } else {
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

  private setupVideoUrl(): void {
    if (this.modulo?.video_url) {
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.modulo.video_url);
    }
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

  goToPreviousModule(): void {
    if (!this.modulo || !this.cursoId) {
      return;
    }

    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (modulosDelCurso) => {
        const currentIndex = modulosDelCurso.findIndex(m => m.id === this.modulo!.id_modulo);

        if (currentIndex > 0) {
          const previousModulo = modulosDelCurso[currentIndex - 1];

          const queryParams: any = { id_modulo: previousModulo.id };
          if (this.cursoId) queryParams.cursoId = this.cursoId;
          if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;

          this.router.navigate(['/modulo/detail'], {
            queryParams: queryParams
          });
        } else {
          alert('Este es el primer módulo del curso.');
        }
      },
      error: (err) => {
        console.error('Error al verificar módulos del curso:', err);
        alert('No se pudo verificar el módulo anterior.');
      }
    });
  }

  goToNextModule(): void {
    if (!this.modulo || !this.cursoId) {
      return;
    }

    this.modulosService.getModulosByCursoId(this.cursoId).subscribe({
      next: (modulosDelCurso) => {
        const currentIndex = modulosDelCurso.findIndex(m => m.id === this.modulo!.id_modulo);

        if (currentIndex !== -1 && currentIndex < modulosDelCurso.length - 1) {
          const nextModulo = modulosDelCurso[currentIndex + 1];

          const queryParams: any = { id_modulo: nextModulo.id };
          if (this.cursoId) queryParams.cursoId = this.cursoId;
          if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;

          this.router.navigate(['/modulo/detail'], {
            queryParams: queryParams
          });
        } else {
          this.openFinalModal();
        }
      },
      error: (err) => {
        console.error('Error al verificar módulos del curso:', err);
        alert('No se pudo verificar si hay más módulos en este curso.');
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

  ngAfterViewInit() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume;
      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.duration = this.videoPlayer.nativeElement.duration;
      });

      const videoWrapper = this.videoPlayer.nativeElement.parentElement;
      if (videoWrapper) {
        videoWrapper.addEventListener('mouseenter', () => {
          this.showControls = true;
          this.resetControlsTimer();
        });

        videoWrapper.addEventListener('mouseleave', () => {
          this.hideControls();
        });
      }

      this.videoPlayer.nativeElement.addEventListener('click', () => {
        this.togglePlay();
      });
    }
  }

  hideControls() {
    if (!this.isPlaying) {
      this.showControls = true;
      return;
    }
    this.controlsTimeout = setTimeout(() => {
      this.showControls = false;
    }, this.hideControlsDelay);
  }

  togglePlay(event?: MouseEvent) {
    if (event && event.target !== this.videoPlayer.nativeElement) {
      return;
    }

    if (this.videoPlayer) {
      if (this.videoPlayer.nativeElement.paused) {
        this.videoPlayer.nativeElement.play();
        this.isPlaying = true;
        this.resetControlsTimer();
      } else {
        this.videoPlayer.nativeElement.pause();
        this.isPlaying = false;
        this.showControls = true;
      }
    }
  }

  updateTime() {
    if (this.videoPlayer) {
      this.currentTime = this.videoPlayer.nativeElement.currentTime;
      this.duration = this.videoPlayer.nativeElement.duration || 0;
      this.progressPercent = (this.currentTime / this.duration) * 100;
    }
  }

  seekVideo() {
    if (this.videoPlayer) {
      const seekTime = (this.progressPercent / 100) * this.duration;
      this.videoPlayer.nativeElement.currentTime = seekTime;
    }
  }

  toggleMute() {
    if (this.videoPlayer) {
      this.isMuted = !this.isMuted;
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  updateVolume() {
    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume;
      this.isMuted = this.volume === 0;
    }
  }

  toggleFullscreen() {
    const videoContainer = this.videoPlayer.nativeElement.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  private resetControlsTimer() {
    clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      this.showControls = false;
    }, this.hideControlsDelay);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }
    if (!this.videoPlayer) return;

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowRight':
        this.videoPlayer.nativeElement.currentTime += 5;
        break;
      case 'ArrowLeft':
        this.videoPlayer.nativeElement.currentTime -= 5;
        break;
      case 'ArrowUp':
        this.volume = Math.min(1, this.volume + 0.1);
        this.updateVolume();
        break;
      case 'ArrowDown':
        this.volume = Math.max(0, this.volume - 0.1);
        this.updateVolume();
        break;
      case 'f':
        this.toggleFullscreen();
        break;
      case 'm':
        this.toggleMute();
        break;
    }
  }

  openFinalModal() {
    this.showFinalModal = true;
  }

  closeFinalModal() {
    this.showFinalModal = false;
    this.goBack();
  }

  cargarComentarios(moduloId: number) {
    this.cargandoComentarios = true;
    this.comentariosService.getComentariosPorModulo(moduloId.toString())
      .subscribe({
        next: (actions) => {
          this.comentarios = actions.map((a: any) => {
            const data = a.payload.val();
            const key = a.payload.key;
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

  agregarComentario() {
    if (!this.nuevoComentario.trim() || !this.modulo) return;

    this.comentariosService.agregarComentario(
      this.modulo.id_modulo.toString(),
      this.nuevoComentario
    ).then(() => {
      this.nuevoComentario = '';
      this.cargarComentarios(this.modulo!.id_modulo);
    }).catch(err => {
      console.error('Error al agregar comentario:', err);
      alert('Error al agregar el comentario');
    });
  }

  editarComentario(key: string, textoActual: string) {
    this.editandoComentario = key;
    this.textoEditando = textoActual;
  }

  cancelarEdicion() {
    this.editandoComentario = null;
    this.textoEditando = '';
  }

  guardarEdicion(key: string) {
    if (!this.textoEditando.trim()) {
      alert('El comentario no puede estar vacío');
      return;
    }

    this.comentariosService.editarComentario(key, this.textoEditando)
      .then(() => {
        this.editandoComentario = null;
        this.textoEditando = '';
        if (this.modulo) {
          this.cargarComentarios(this.modulo.id_modulo);
        }
      })
      .catch(err => {
        console.error('Error al editar comentario:', err);
        alert('Error al editar el comentario');
      });
  }

  eliminarComentario(key: string) {
    if (confirm('¿Estás seguro de eliminar este comentario?')) {
      this.comentariosService.eliminarComentario(key).then(() => {
        if (this.modulo) {
          this.cargarComentarios(this.modulo.id_modulo);
        }
      }).catch(err => {
        console.error('Error al eliminar comentario:', err);
        alert('Error al eliminar el comentario');
      });
    }
  }

  handleTextareaKeydown(event: Event) {
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

  cargarLikes(moduloId: number) {
    this.loadingLikes = true;
    const moduloIdStr = moduloId.toString();
    
    this.likesService.getLikesPorModulo(moduloIdStr).subscribe({
      next: (actions) => {
        this.likes = actions.map((a: any) => {
          const data = a.payload.val();
          const key = a.payload.key;
          return { key, ...data };
        });
        
        this.likesCount = this.likes.length;
        const currentUserId = this.likesService.getUsuarioId();
        this.userHasLiked = this.likes.some(like => like.usuarioId === currentUserId);
        this.loadingLikes = false;
      },
      error: (err) => {
        console.error('Error al cargar likes:', err);
        this.loadingLikes = false;
      }
    });
  }

  toggleLike() {
    if (!this.modulo || this.loadingLikes) return;

    this.loadingLikes = true;
    const moduloIdStr = this.modulo.id_modulo.toString();
    const currentUserId = this.likesService.getUsuarioId();

    if (this.userHasLiked) {
      const userLike = this.likes.find(like => like.usuarioId === currentUserId);
      if (userLike && userLike.key) {
        this.likesService.quitarLike(userLike.key)
          .then(() => {
            this.cargarLikes(this.modulo!.id_modulo);
          })
          .catch((err) => {
            console.error('Error al quitar like:', err);
            alert('Error al quitar el like');
            this.loadingLikes = false;
          });
      }
    } else {
      this.likesService.agregarLike(moduloIdStr)
        .then(() => {
          this.cargarLikes(this.modulo!.id_modulo);
        })
        .catch((err) => {
          console.error('Error al agregar like:', err);
          alert('Error al agregar el like');
          this.loadingLikes = false;
        });
    }
  }
}