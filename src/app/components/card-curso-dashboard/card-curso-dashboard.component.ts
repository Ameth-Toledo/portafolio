import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-curso-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './card-curso-dashboard.component.html',
  styleUrl: './card-curso-dashboard.component.css'
})
export class CardCursoDashboardComponent {
  constructor(private router: Router) { }

  @Input() nombre!: string;
  @Input() descripcion!: string;
  @Input() nivel!: string;
  @Input() duracion!: string;
  @Input() tecnologia!: string;
  @Input() fecha!: string;
  @Input() imagen!: string;
  @Input() id!: number;

  navegarAModulos(): void {
    this.router.navigate(['/dashboard/modules'], {
      queryParams: { cursoId: this.id, nombreCurso: this.nombre }
    });
  }
}
