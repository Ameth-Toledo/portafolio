import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LikesService } from '../../services/likes/likes.service';

@Component({
  selector: 'app-card-modulo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-modulo.component.html',
  styleUrl: './card-modulo.component.css'
})
export class CardModuloComponent implements OnInit {
  @Input() imageUrl: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() moduloId: number = 0;

  @Output() cardClick = new EventEmitter<number>(); 
  
  likeCount: number = 0;
  isLoadingLikes: boolean = false;
  hasLikeError: boolean = false;
    
  constructor(private likesService: LikesService) {}

  ngOnInit(): void {
    console.log('CardModuloComponent iniciado con moduloId:', this.moduloId);
    if (this.moduloId && this.moduloId > 0) {
      this.loadLikeCount();
    } else {
      console.warn('ModuloId no válido:', this.moduloId);
    }
  }

  private loadLikeCount(): void {
    this.isLoadingLikes = true;
    this.hasLikeError = false;
    
    console.log('Cargando likes para módulo ID:', this.moduloId);
    
    this.likesService.getLikeCount(this.moduloId).subscribe({
      next: (response: any) => {
        console.log('Respuesta de likes:', response);
        this.likeCount = response.like_count || 0;
        this.isLoadingLikes = false;
      },
      error: (error) => {
        console.error('Error al cargar likes del módulo:', error);
        this.likeCount = 0;
        this.hasLikeError = true;
        this.isLoadingLikes = false;
      }
    });
  }
    
  onCardClick(): void {
    if (this.moduloId > 0) {
      this.cardClick.emit(this.moduloId);
    }
  }
}