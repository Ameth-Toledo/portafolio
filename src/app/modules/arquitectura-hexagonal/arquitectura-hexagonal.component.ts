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
          name: 'core',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'db_mysql.go', type: 'file' }
          ]
        },
        {
          name: 'users',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'application', 
              type: 'folder', 
              expanded: false, 
              children: [
                { name: 'CreateUser_UseCase.go', type: 'file' },
                { name: 'DeleteUser_UseCase.go', type: 'file' },
                { name: 'GetUsers_UseCase.go', type: 'file' },
                { name: 'GetUserById_UseCase.go', type: 'file' },
                { name: 'UpdateUser_UseCase.go', type: 'file' },
            ]
          },
            { name: 'domain', 
              type: 'folder',
              expanded: false,
              children: [
                { name: 'entities', 
                  type: 'folder',
                  expanded: false, 
                  children: [
                { name: 'User.go', type: 'file' }
            ]
            },
                { name: 'User_Repository.go', type: 'file' },
              ]
            },
            { name: 'infrastructure', 
              type: 'folder',
              expanded: false,
              children: [
                { name: 'controllers', 
                  type: 'folder',
                  expanded: false,
                  children: [
                    { name: 'CreateUser_Controller.go', type: 'file' },
                    { name: 'DeleteUser_Controller.go', type: 'file' },
                    { name: 'GetUsers_Controller.go', type: 'file' },
                    { name: 'GetUsersById_Controller.go', type: 'file' },
                    { name: 'UpdateUser_Controller.go', type: 'file' },
                  ] 
                },
                { name: 'database', 
                  type: 'folder',
                  expanded: false,
                  children: [
                    { name: 'MySQL.go', type: 'file' }
                  ] 
                },
                { name: 'routes', 
                  type: 'folder',
                  expanded: false,
                  children: [
                    { name: 'User_Routes.go', type: 'file' }
                  ] 
                },
                { name: 'dependencies.go', type: 'file' },
              ] 
            }
          ]
        },
        {
          name: 'products',
          type: 'folder',
          expanded: false,
          children: [
            { name: 'application', type: 'folder' },
            { name: 'domain', type: 'folder' },
            { name: 'infrastructure', type: 'folder' }
          ]
        }
      ]
    },
    { name: '.env', type: 'file' },
    { name: '.gitignore', type: 'file' },
    { name: 'go.mod', type: 'file' },
    { name: 'go.sum', type: 'file' },
    { name: 'README.md', type: 'file' }
  ];
}
