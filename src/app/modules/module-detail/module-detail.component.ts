// Modificaciones necesarias en ModuleDetailComponent

import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Contenido } from '../../models/contenido';
import { ContenidoService } from '../../services/contenido/contenido.service';
import { FormsModule } from '@angular/forms';
import { TimeFormatPipe } from '../../pipes/time-format.pipe';

@Component({
  selector: 'app-module-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, TimeFormatPipe],
  templateUrl: './module-detail.component.html',
  styleUrl: './module-detail.component.css'
})
export class ModuleDetailComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  modulo: Contenido | null = null;
  safeVideoUrl: SafeResourceUrl | null = null;
  loading = true;
  error: string | null = null;

  // NUEVAS PROPIEDADES PARA MANEJAR LA NAVEGACIÓN DE REGRESO
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
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private contenidoService: ContenidoService
  ) {}

  ngOnInit(): void {
    // Obtener TODOS los query parameters, incluyendo los del curso
    this.route.queryParams.subscribe(params => {
      const idModulo = params['id_modulo'];
      
      // GUARDAR LOS PARÁMETROS DEL CURSO PARA EL REGRESO
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

  // MÉTODO goBack() CORREGIDO
  goBack(): void {
    // Si tenemos información del curso, regresar a la vista de módulos del curso
    if (this.cursoId && this.nombreCurso) {
      this.router.navigate(['/modulos'], {
        queryParams: {
          cursoId: this.cursoId,
          nombreCurso: this.nombreCurso
        }
      });
    } else {
      // Si no tenemos info del curso, regresar a la vista general de módulos
      this.router.navigate(['/modulos']);
    }
  }

  goToPreviousModule(): void {
    if (this.modulo && this.modulo.id_modulo > 1) {
      const previousId = this.modulo.id_modulo - 1;
      
      // MANTENER LOS PARÁMETROS DEL CURSO AL NAVEGAR
      const queryParams: any = { id_modulo: previousId };
      if (this.cursoId) queryParams.cursoId = this.cursoId;
      if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;
      
      this.router.navigate(['/modulo/detail'], { 
        queryParams: queryParams
      });
    }
  }

  goToNextModule(): void {
    if (this.modulo) {
      const nextId = this.modulo.id_modulo + 1;
      
      // MANTENER LOS PARÁMETROS DEL CURSO AL NAVEGAR
      const queryParams: any = { id_modulo: nextId };
      if (this.cursoId) queryParams.cursoId = this.cursoId;
      if (this.nombreCurso) queryParams.nombreCurso = this.nombreCurso;
      
      this.router.navigate(['/modulo/detail'], { 
        queryParams: queryParams
      });
    }
  }

  openRepository(): void {
    if (this.modulo?.repositorio) {
      window.open(this.modulo.repositorio, '_blank');
    } else {
      alert('No hay repositorio disponible para este módulo');
    }
  }

  // ... resto de métodos del componente sin cambios
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

  togglePlay() {
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
}