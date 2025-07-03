import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { HeaderBlogComponent } from "../../components/header-blog/header-blog.component";
import { CardCursosComponent } from "../../components/card-cursos/card-cursos.component";
import { CursosService } from '../../services/cursos/cursos.service';
import { CommonModule } from '@angular/common';
import { Curso } from '../../models/curso';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    CardTecnologyComponent,
    TecnologiasComponent,
    HeaderBlogComponent,
    CardCursosComponent
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent {
  cursos: Curso[] = [];
  cursosFiltrados: Curso[] = [];

  constructor (
    private router: Router,
    private animationService: AnimationService,
    private cursosService: CursosService
  ) {}

  ngOnInit() {
    this.cargarCursos();
    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  cargarCursos() {
    this.cursosService.getCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.cursosFiltrados = [...cursos];
      },
      error: (err) => console.error('Error al cargar cursos', err)
    });
  }

  onBuscar(termino: string) {
    if (!termino) {
      this.cursosFiltrados = [...this.cursos];
      return;
    }
    
    this.cursosService.searchCursosByNombre(termino).subscribe({
      next: (cursos) => {
        this.cursosFiltrados = cursos;
      },
      error: (err) => console.error('Error al buscar cursos', err)
    });
  }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }
}