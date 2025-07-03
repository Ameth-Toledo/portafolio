import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-cursos',
  standalone: true,
  imports: [],
  templateUrl: './card-cursos.component.html',
  styleUrl: './card-cursos.component.css'
})
export class CardCursosComponent {
  constructor(private router: Router) {}

  @Input() nombre!: string;
  @Input() descripcion!: string;
  @Input() nivel!: string;
  @Input() duracion!: string;
  @Input() tecnologia!: string;
  @Input() fecha!: string;
  @Input() imagen!: string;
  @Input() id!: number; 

  navegarAModulos(): void {
    this.router.navigate(['/modulos'], { 
      queryParams: { cursoId: this.id, nombreCurso: this.nombre }
    });
  }
}