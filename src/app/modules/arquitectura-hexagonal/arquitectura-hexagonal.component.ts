import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationService } from '../../services/animation/animation.service';
import { CardTecnologyComponent } from "../../components/card-tecnology/card-tecnology.component";
import { CardEditorCodeComponent } from "../../components/card-editor-code/card-editor-code.component";
import { TecnologiasComponent } from "../../components/tecnologias/tecnologias.component";
import { FileItem } from '../../models/file-item';
import { EstructuraDirectoriosComponent } from "../../components/estructura-directorios/estructura-directorios.component";

@Component({
  selector: 'app-arquitectura-hexagonal',
  standalone: true,
  imports: [CardTecnologyComponent, CardEditorCodeComponent, TecnologiasComponent, EstructuraDirectoriosComponent],
  templateUrl: './arquitectura-hexagonal.component.html',
  styleUrl: './arquitectura-hexagonal.component.css'
})
export class ArquitecturaHexagonalComponent {
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
  `;

  goHandlerCode = `
func (h *UserHandler) GetUser(c *gin.Context) {
    id := c.Param("id")
    user, err := h.userUsecase.GetUserByID(id)
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }
    c.JSON(http.StatusOK, user)
}
`

 folderStructure: FileItem[] = [
    {
      name: 'src',
      type: 'folder',
      expanded: true,
      children: [
        {
          name: 'app',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'main.go', type: 'file' },
            { name: 'router.go', type: 'file' }
          ]
        },
        {
          name: 'domain',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'user.go', type: 'file' },
            { name: 'product.go', type: 'file' }
          ]
        },
        {
          name: 'infrastructure',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'database.go', type: 'file' },
            { name: 'cache.go', type: 'file' }
          ]
        }
      ]
    },
    {
      name: 'config',
      type: 'folder',
      expanded: false,
      children: [
        { name: 'config.yaml', type: 'file' },
        { name: 'env.example', type: 'file' }
      ]
    },
    { name: 'go.mod', type: 'file' },
    { name: 'go.sum', type: 'file' },
    { name: 'README.md', type: 'file' }
  ];
}
