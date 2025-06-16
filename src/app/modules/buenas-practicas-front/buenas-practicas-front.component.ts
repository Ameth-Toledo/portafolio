import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CardEditorCodeComponent } from "../../components/card-editor-code/card-editor-code.component";
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { AnimationService } from '../../services/animation/animation.service';

@Component({
  selector: 'app-buenas-practicas-front',
  standalone: true,
  imports: [CommonModule, CardTecnologyComponent, CardEditorCodeComponent, TecnologiasComponent],
  templateUrl: './buenas-practicas-front.component.html',
  styleUrl: './buenas-practicas-front.component.css'
})
export class BuenasPracticasFrontComponent implements OnInit, OnDestroy {
  constructor (
    private router : Router,
    private animationService: AnimationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  ngOnDestroy(): void {}

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  htmlCode = `
  <!-- Aqui tenemos un ejemplo de como usar html limpio -->
  <div class="container" style="color: blue;">
    <h1 class="title">Ejemplo HTML</h1>
    <p class="subtitle">Este es un ejemplo de código con 
      resaltado de sintaxis</p>
  </div>
  
<!-- Codigo con estilos globales y desordenado -->
  <div>
    <h1>Ejemplo HTML mal</h1>
    <p>Ejemplo de codigo mal estructurado</p>
  </div>`;

  cssCode = `
  /* codigo de css limpio y ordenado */
  .container {
    color: #2a5885;
    padding: 20px;
    background-color: #f0f0f0;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
    
  .subtitle {
    font-size: 1rem;
    font-weight: bold;
    text-align: left;
  }
    
  /* codigo de css desordenado y global */
  div {
    color: #2a5885;
    padding: 20px;
    background-color: #f0f0f0;
  }
    
  h1 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
    
  p {
    font-size: 1rem;
    font-weight: bold;
    text-align: left;
  }`
  
  reactCode =`
  import React from 'react';
import './ReusableButton.css';

  const ReusableButton = ({ text, color }) => {
    return (
      <button className="reusable-button" style={{ backgroundColor: color }}>
        {text}
      </button>
    );
  };

  export default ReusableButton;
  ;`

  cssCodeReact = `
  .reusable-button {
    border: none;
    color: white;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .reusable-button:hover {
    opacity: 0.85;
  }
  `
}
