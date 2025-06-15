import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CardEditorCodeComponent } from "../../components/card-editor-code/card-editor-code.component";

@Component({
  selector: 'app-buenas-practicas-front',
  standalone: true,
  imports: [CommonModule, CardTecnologyComponent, CardEditorCodeComponent],
  templateUrl: './buenas-practicas-front.component.html',
  styleUrl: './buenas-practicas-front.component.css'
})
export class BuenasPracticasFrontComponent {
  constructor (private router : Router) {}

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  htmlCode = `
  <div class="container">
    <h1>Ejemplo HTML</h1>
    <p>Este es un ejemplo de código con resaltado de sintaxis</p>
  </div>`;

  cssCode = `
  .container {
    color: #2a5885;
    padding: 20px;
    background-color: #f0f0f0;
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }`;

}
