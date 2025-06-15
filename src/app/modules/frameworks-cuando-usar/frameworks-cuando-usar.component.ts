import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CardEditorCodeComponent } from "../../components/card-editor-code/card-editor-code.component";

@Component({
  selector: 'app-frameworks-cuando-usar',
  standalone: true,
  imports: [CardTecnologyComponent, CardEditorCodeComponent],
  templateUrl: './frameworks-cuando-usar.component.html',
  styleUrl: './frameworks-cuando-usar.component.css'
})
export class FrameworksCuandoUsarComponent {
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
