import { Component, Input, ElementRef, ViewChild, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-reproductor-video',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe],
  templateUrl: './reproductor-video.component.html',
  styleUrl: './reproductor-video.component.css'
})
export class ReproductorVideoComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoUrl: string | null = null;
  
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoIframe') videoIframe!: ElementRef<HTMLIFrameElement>;

  private youtubePlayer: any = null;
  private youtubeApiReady = false;
  
  safeVideoUrl: SafeResourceUrl | null = null;
  showCenterButton = true;
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

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.videoUrl) {
      this.setupVideoUrl();
    }
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

  private setupVideoUrl(): void {
    if (this.videoUrl) {
      console.log('URL original del video:', this.videoUrl);
      let videoUrl = this.videoUrl;

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

  // Métodos para compatibilidad con videos HTML5 nativos
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
}