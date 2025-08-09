import { Component, OnInit, ElementRef, ViewChild, HostListener, OnDestroy, AfterViewInit } from '@angular/core';
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
import { ChatbotComponent } from "../../components/chatbot/chatbot.component";
import { MercadoPagoService } from '../../services/mercadoPago/mercado-pago.service';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe, ChatbotComponent],
  providers: [ComentariosService, LikesService, MercadoPagoService],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.css'
})
export class ModuleDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  private youtubePlayer: any = null;
  private youtubeApiReady = false;
  showCenterButton = true;

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
  isFullscreen = false;
  showVolumeSlider = false;
  isControlsHidden = false;

  private controlsTimeout: any;
  private hideControlsDelay = 3000;
  private mouseMoveTimeout: any;
  private progressUpdateInterval: any;
  private lastMouseMoveTime = 0;
  private controlsHideTimer: any;

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
    private sanitizer: DomSanitizer,
    private contenidoService: ContenidoService,
    private modulosService: ModulosService,
    private comentariosService: ComentariosService,
    private likesService: LikesService,
    private mercadoPagoService: MercadoPagoService
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

    this.loadMercadoPagoSDK();
  }

  ngAfterViewInit(): void {
    this.loadYouTubeAPI();
    this.setupCustomControls();
    this.setupMouseMovementTracking();

    if (this.videoPlayer) {
      this.videoPlayer.nativeElement.volume = this.volume;
      this.videoPlayer.nativeElement.addEventListener('loadedmetadata', () => {
        this.duration = this.videoPlayer.nativeElement.duration;
      });
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
    if (this.progressUpdateInterval) {
      clearInterval(this.progressUpdateInterval);
    }
  }

  private clearAllTimers(): void {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
      this.controlsTimeout = null;
    }
    if (this.mouseMoveTimeout) {
      clearTimeout(this.mouseMoveTimeout);
      this.mouseMoveTimeout = null;
    }
    if (this.controlsHideTimer) {
      clearTimeout(this.controlsHideTimer);
      this.controlsHideTimer = null;
    }
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
          this.setupVideoUrl();
          this.cargarComentarios(idModulo);
          this.cargarLikes(idModulo);
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

  private setupVideoUrl(): void {
    if (this.modulo?.video_url) {
      console.log('URL original del video:', this.modulo.video_url);
      let videoUrl = this.modulo.video_url;

      if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('v=')[1].split('&')[0];
        videoUrl = this.buildYouTubeEmbedUrl(videoId);
      }
      else if (videoUrl.includes('youtu.be/')) {
        const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
        videoUrl = this.buildYouTubeEmbedUrl(videoId);
      }
      else if (videoUrl.includes('vimeo.com/') && !videoUrl.includes('/embed/')) {
        const videoId = videoUrl.split('vimeo.com/')[1].split('/')[0];
        videoUrl = this.buildVimeoEmbedUrl(videoId);
      }
      else if (videoUrl.startsWith('./') || videoUrl.startsWith('/') || !videoUrl.startsWith('http')) {
        if (!videoUrl.startsWith('http')) {
          videoUrl = `/assets/videos/${videoUrl.replace('./', '')}`;
        }
      }

      console.log('URL procesada para iframe:', videoUrl);
      this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    }
  }

  private buildYouTubeEmbedUrl(videoId: string): string {
    const params = new URLSearchParams({
      'controls': '0',           // Oculta TODOS los controles de YouTube
      'disablekb': '1',          // Deshabilita atajos de teclado
      'fs': '0',                 // Deshabilita pantalla completa de YouTube
      'modestbranding': '1',     // Minimiza branding de YouTube
      'rel': '0',                // No muestra videos relacionados
      'showinfo': '0',           // Oculta información del video
      'iv_load_policy': '3',     // Oculta anotaciones
      'cc_load_policy': '0',     // Oculta subtítulos automáticos
      'autoplay': '0',           // No reproduce automáticamente
      'playsinline': '1',        // Reproduce inline en móviles
      'enablejsapi': '1',        // Habilita API JavaScript
      'origin': window.location.origin,
      'widget_referrer': window.location.origin
    });

    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }

  private buildVimeoEmbedUrl(videoId: string): string {
    const params = new URLSearchParams({
      'controls': '0',           // Oculta controles de Vimeo
      'autoplay': '0',
      'loop': '0',
      'title': '0',              // Oculta título
      'byline': '0',             // Oculta autor
      'portrait': '0',           // Oculta avatar del autor
      'transparent': '0',        // Fondo no transparente
      'responsive': '1'          // Responsive
    });

    return `https://player.vimeo.com/video/${videoId}?${params.toString()}`;
  }

  private loadYouTubeAPI(): void {
    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      (window as any).onYouTubeIframeAPIReady = () => {
        this.youtubeApiReady = true;
        setTimeout(() => this.initYouTubePlayer(), 1000);
      };
    } else if ((window as any).YT && (window as any).YT.Player) {
      this.youtubeApiReady = true;
      setTimeout(() => this.initYouTubePlayer(), 1000);
    }
  }

  private initYouTubePlayer(): void {
    if (this.videoIframe && this.youtubeApiReady) {
      try {
        this.youtubePlayer = new (window as any).YT.Player(this.videoIframe.nativeElement, {
          events: {
            'onReady': (event: any) => {
              console.log('YouTube player ready');
              this.setupProgressTracking();
              try {
                this.duration = this.youtubePlayer.getDuration() || 0;
              } catch (error) {
                console.log('No se pudo obtener la duración inicial:', error);
                this.duration = 0;
              }
            },
            'onStateChange': (event: any) => {
              this.onYouTubeStateChange(event);
            }
          }
        });
      } catch (error) {
        console.log('No se pudo inicializar el player de YouTube:', error);
        this.setupFallbackProgressTracking();
      }
    } else {
      this.setupFallbackProgressTracking();
    }
  }

  private onYouTubeStateChange(event: any): void {
    const YT = (window as any).YT;
    if (YT && YT.PlayerState) {
      switch (event.data) {
        case YT.PlayerState.PLAYING:
          this.isPlaying = true;
          this.showCenterButton = false;
          this.hideVideoControlsDelayed();
          break;
        case YT.PlayerState.PAUSED:
          this.isPlaying = false;
          this.showCenterButton = true;
          this.showVideoControls();
          this.clearAllTimers();
          break;
        case YT.PlayerState.ENDED:
          this.isPlaying = false;
          this.showCenterButton = true;
          this.showVideoControls();
          this.clearAllTimers();
          break;
      }
    }
  }

  private setupProgressTracking(): void {
    if (this.youtubePlayer) {
      this.progressUpdateInterval = setInterval(() => {
        try {
          if (this.youtubePlayer && this.isPlaying) {
            this.currentTime = this.youtubePlayer.getCurrentTime() || 0;
            const newDuration = this.youtubePlayer.getDuration() || 0;
            if (newDuration > 0) {
              this.duration = newDuration;
            }
            this.progressPercent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
          }
        } catch (error) {
          console.log('Error obteniendo progreso del video:', error);
        }
      }, 1000);
    }
  }

  private setupFallbackProgressTracking(): void {
    this.progressUpdateInterval = setInterval(() => {
      if (this.isPlaying && this.duration > 0) {
        this.currentTime += 1;
        if (this.currentTime >= this.duration) {
          this.currentTime = this.duration;
          this.isPlaying = false;
          this.showCenterButton = true;
        }
        this.progressPercent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
      }
    }, 1000);
  }

  handleVideoClick(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const target = event.target as HTMLElement;

    if (target.closest('.video-controls-overlay') ||
      target.closest('.center-play-button') ||
      target.classList.contains('video-controls-overlay') ||
      target.classList.contains('center-play-button')) {
      return;
    }

    this.togglePlayYouTube();
  }

  togglePlayYouTube(): void {
    console.log('Toggle play/pause - Estado actual:', this.isPlaying);

    if (this.youtubePlayer && this.youtubeApiReady) {
      try {
        if (this.isPlaying) {
          this.youtubePlayer.pauseVideo();
        } else {
          this.youtubePlayer.playVideo();
          if (this.duration === 0) {
            setTimeout(() => {
              try {
                this.duration = this.youtubePlayer.getDuration() || 300;
              } catch (error) {
                this.duration = 300;
              }
            }, 1000);
          }
        }
      } catch (error) {
        console.log('Error controlando YouTube player:', error);
        this.fallbackTogglePlay();
      }
    } else {
      this.fallbackTogglePlay();
    }
  }

  private fallbackTogglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.showCenterButton = !this.isPlaying;

    if (this.isPlaying) {
      if (this.duration === 0) {
        this.duration = 300;
      }
      this.hideVideoControlsDelayed();
    } else {
      this.showVideoControls();
      this.clearAllTimers();
    }

    if (this.videoIframe) {
      const message = this.isPlaying ?
        '{"event":"command","func":"playVideo","args":""}' :
        '{"event":"command","func":"pauseVideo","args":""}';

      try {
        this.videoIframe.nativeElement.contentWindow?.postMessage(message, '*');
      } catch (error) {
        console.log('No se pudo controlar el video embebido:', error);
      }
    }
  }

  seekVideo(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.duration) return;

    const progressContainer = event.currentTarget as HTMLElement;
    const rect = progressContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const seekTime = (percentage / 100) * this.duration;

    this.progressPercent = percentage;
    this.currentTime = seekTime;

    if (this.youtubePlayer && this.youtubeApiReady) {
      try {
        this.youtubePlayer.seekTo(seekTime, true);
        console.log(`Buscando a: ${seekTime}s (${percentage.toFixed(1)}%)`);
      } catch (error) {
        console.log('Error buscando en el video:', error);
      }
    }

    this.showVideoControls();
    if (this.isPlaying) {
      this.hideVideoControlsDelayed();
    }
  }

  toggleMute(): void {
    if (this.isMuted || this.volume === 0) {
      this.volume = 0.7;
      this.isMuted = false;
    } else {
      this.volume = 0;
      this.isMuted = true;
    }
    this.updateVolume();
  }

  updateVolume(): void {
    this.isMuted = this.volume === 0;

    if (this.youtubePlayer && this.youtubeApiReady) {
      try {
        this.youtubePlayer.setVolume(this.volume * 100);
        if (this.volume === 0) {
          this.youtubePlayer.mute();
        } else {
          this.youtubePlayer.unMute();
        }
      } catch (error) {
        console.log('Error controlando volumen:', error);
      }
    }
  }

  toggleFullscreenYouTube(): void {
    const videoContainer = this.videoIframe?.nativeElement.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().then(() => {
        this.isFullscreen = true;
      }).catch((err: Error) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        this.isFullscreen = false;
      });
    }
  }

  showVideoControls(): void {
    this.showControls = true;
    this.isControlsHidden = false;
    this.clearAllTimers();
  }

  hideVideoControlsDelayed(): void {
    if (this.isPlaying) {
      this.clearAllTimers();
      this.controlsHideTimer = setTimeout(() => {
        this.isControlsHidden = true;
        setTimeout(() => {
          if (this.isControlsHidden && this.isPlaying) {
            this.showControls = false;
          }
        }, 300);
      }, this.hideControlsDelay);
    }
  }

  keepControlsVisible(): void {
    this.showVideoControls();
    this.clearAllTimers();
  }

  startHideControlsTimer(): void {
    this.hideVideoControlsDelayed();
  }

  private setupMouseMovementTracking(): void {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
      videoWrapper.addEventListener('mousemove', (e) => {
        this.onMouseMove(e);
      });

      videoWrapper.addEventListener('mouseleave', () => {
        this.hideVideoControlsDelayed();
      });

      const controlsOverlay = document.querySelector('.video-controls-overlay');
      if (controlsOverlay) {
        controlsOverlay.addEventListener('mouseleave', () => {
          if (this.isPlaying) {
            this.hideVideoControlsDelayed();
          }
        });

        controlsOverlay.addEventListener('mouseenter', () => {
          this.clearAllTimers();
          this.showVideoControls();
        });
      }
    }
  }

  private onMouseMove(event: Event): void {
    if (!(event instanceof MouseEvent)) return;
    const now = Date.now();
    this.lastMouseMoveTime = now;

    this.showVideoControls();

    if (this.isPlaying) {
      this.clearAllTimers();

      if (this.mouseMoveTimeout) {
        clearTimeout(this.mouseMoveTimeout);
      }

      this.mouseMoveTimeout = setTimeout(() => {
        if (this.isPlaying && (Date.now() - this.lastMouseMoveTime) >= this.hideControlsDelay) {
          this.hideVideoControlsDelayed();
        }
      }, this.hideControlsDelay);
    }
  }

  private setupCustomControls(): void {
    const videoWrapper = document.querySelector('.video-wrapper');
    if (videoWrapper) {
      videoWrapper.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        if (target.closest('.video-controls-overlay') ||
          target.closest('.center-play-button') ||
          target.classList.contains('video-controls-overlay') ||
          target.classList.contains('center-play-button')) {
          return;
        }

        e.preventDefault();
        e.stopPropagation();
        this.togglePlayYouTube();
      });

      const iframe = videoWrapper.querySelector('iframe');
      if (iframe) {
        const overlay = videoWrapper.querySelector('.video-click-overlay') as HTMLElement;
        if (overlay) {
          overlay.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.togglePlayYouTube();
          });
        }
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement) {
      return;
    }

    const activeElement = document.activeElement;
    const videoContainer = document.querySelector('.video-container');

    if (!videoContainer || !activeElement?.closest('.video-container')) {
      return;
    }

    switch (event.key) {
      case ' ':
        event.preventDefault();
        this.togglePlayYouTube();
        break;
      case 'f':
      case 'F':
        event.preventDefault();
        this.toggleFullscreenYouTube();
        break;
      case 'Escape':
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        break;
      case 'm':
      case 'M':
        event.preventDefault();
        this.toggleMute();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.seekRelative(-10);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.seekRelative(10);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.changeVolume(0.1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.changeVolume(-0.1);
        break;
    }
  }

  private seekRelative(seconds: number): void {
    if (!this.duration) return;

    const newTime = Math.max(0, Math.min(this.duration, this.currentTime + seconds));
    const percentage = (newTime / this.duration) * 100;

    this.currentTime = newTime;
    this.progressPercent = percentage;

    if (this.youtubePlayer && this.youtubeApiReady) {
      try {
        this.youtubePlayer.seekTo(newTime, true);
      } catch (error) {
        console.log('Error en seek relativo:', error);
      }
    }

    this.showVideoControls();
    if (this.isPlaying) {
      this.hideVideoControlsDelayed();
    }
  }

  private changeVolume(delta: number): void {
    const newVolume = Math.max(0, Math.min(1, this.volume + delta));
    this.volume = newVolume;
    this.updateVolume();

    this.showVideoControls();
    if (this.isPlaying) {
      this.hideVideoControlsDelayed();
    }
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
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

    this.comentariosService.editarComentario(key, this.textoEditando)
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

  cargarLikes(moduloId: number) {
    this.loadingLikes = true;

    this.likesService.getLikeCount(moduloId).subscribe({
      next: (response) => {
        this.likesCount = response.like_count;
        this.userHasLiked = response.user_liked;
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
    const moduloId = this.modulo.id_modulo;

    this.likesService.toggleLike(moduloId).subscribe({
      next: (response) => {
        this.likesCount = response.like_count;
        this.userHasLiked = response.action === 'liked';
        this.loadingLikes = false;

        console.log(response.message);
      },
      error: (err) => {
        console.error('Error al cambiar like:', err);
        alert('Error al cambiar el like');
        this.loadingLikes = false;
      }
    });
  }

  private async loadMercadoPagoSDK(): Promise<void> {
    try {
      await this.mercadoPagoService.loadMercadoPagoScript();
      this.mercadoPagoLoaded = true;
      console.log('MercadoPago SDK cargado exitosamente');
    } catch (error) {
      console.error('Error cargando MercadoPago SDK:', error);
    }
  }

  openMercadoPagoModal(): void {
    if (!this.mercadoPagoLoaded) {
      alert('MercadoPago aún se está cargando, por favor espera un momento...');
      return;
    }
    this.showMercadoPagoModal = true;

    setTimeout(() => {
      this.renderMercadoPagoButton();
    }, 100);
  }

  closeMercadoPagoModal(): void {
    this.showMercadoPagoModal = false;
    this.selectedAmount = '50.00';
    this.customAmount = null;
  }

  private renderMercadoPagoButton(): void {
    const container = document.getElementById('mercadopago-button-container');
    if (container) {
      container.innerHTML = '';

      this.mercadoPagoService.createCustomDonationButton('mercadopago-button-container', this.finalAmount)
        .then(() => {
          console.log('Botón de MercadoPago renderizado con monto:', this.finalAmount);
        })
        .catch(error => {
          console.error('Error renderizando botón de MercadoPago:', error);
          this.renderFallbackButton();
        });
    }
  }

  private renderFallbackButton(): void {
    const container = document.getElementById('mercadopago-button-container');
    if (container) {
      container.innerHTML = `
        <button class="mercadopago-fallback-btn" onclick="alert('MercadoPago no está disponible en este momento. Por favor intenta más tarde.')">
          <span>Donar ${this.finalAmount} MXN</span>
          <small>MercadoPago</small>
        </button>
      `;
    }
  }

  get finalAmount(): string {
    if (this.customAmount && this.customAmount >= 10) {
      return this.customAmount.toFixed(2);
    }
    return this.selectedAmount;
  }

  selectQuickAmount(amount: string): void {
    this.selectedAmount = amount;
    this.customAmount = null;
    setTimeout(() => {
      this.renderMercadoPagoButton();
    }, 50);
  }

  onCustomAmountChange(): void {
    if (this.customAmount && this.customAmount >= 10 && this.customAmount <= 10000) {
      this.selectedAmount = this.customAmount.toFixed(2);
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    } else if (this.customAmount && this.customAmount < 10) {
      this.customAmount = 10;
      this.selectedAmount = '10.00';
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    } else if (this.customAmount && this.customAmount > 10000) {
      this.customAmount = 10000;
      this.selectedAmount = '10000.00';
      setTimeout(() => {
        this.renderMercadoPagoButton();
      }, 50);
    }
  }

  togglePlay(event?: MouseEvent): void {
    if (event && event.target !== this.videoPlayer?.nativeElement) {
      return;
    }

    if (this.videoPlayer) {
      if (this.videoPlayer.nativeElement.paused) {
        this.videoPlayer.nativeElement.play();
        this.isPlaying = true;
        this.hideVideoControlsDelayed();
      } else {
        this.videoPlayer.nativeElement.pause();
        this.isPlaying = false;
        this.showVideoControls();
      }
    }
  }

  updateTime(): void {
    if (this.videoPlayer) {
      this.currentTime = this.videoPlayer.nativeElement.currentTime;
      this.duration = this.videoPlayer.nativeElement.duration || 0;
      this.progressPercent = this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
  }

  toggleFullscreen(): void {
    const videoContainer = this.videoPlayer?.nativeElement.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch((err: Error) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  testMercadoPago(): void {
    console.log('Estado de MercadoPago:', {
      loaded: this.mercadoPagoLoaded,
      finalAmount: this.finalAmount,
      selectedAmount: this.selectedAmount,
      customAmount: this.customAmount
    });
  }
}