import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardTecnologyComponent } from '../../core/components/card-tecnology/card-tecnology.component';
import { TecnologiasComponent } from '../../core/components/tecnologias/tecnologias.component';
import { TerminalComponent, TerminalCommand } from '../../core/components/terminal/terminal.component';
import { FileTreeComponent, FileItem } from '../../core/components/file-tree/file-tree.component';
import { CodeBlockComponent } from '../../core/components/code-block/code-block.component';
import { AnimationService } from '../../core/services/animation/animation.service';

@Component({
  selector: 'app-ato-detail',
  standalone: true,
  imports: [CommonModule, CardTecnologyComponent, TecnologiasComponent, TerminalComponent, FileTreeComponent, CodeBlockComponent],
  templateUrl: './ato-detail.component.html',
  styleUrl: './ato-detail.component.css'
})
export class AtoDetailComponent implements OnInit {
  constructor (
    private router : Router,
    private animationService: AnimationService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.animationService.initAnimations();
    }, 50);
  }

  sendToHome(event: Event) {
    event.preventDefault();
    this.router.navigate(['']);
  }

  createCommands: TerminalCommand[] = [
    { command: 'npx ato-core-init create --db=mysql', output: '✓ Proyecto MVC con MySQL creado exitosamente' },
    { command: 'npx ato-core-init create --db=postgres --architecture=hexagonal', output: '✓ Proyecto Hexagonal con PostgreSQL creado exitosamente' },
    { command: 'npx ato-core-init create --db=mongo --lang=typescript', output: '✓ Proyecto MVC con MongoDB y TypeScript creado exitosamente' },
  ];

  initCommands: TerminalCommand[] = [
    { command: 'npx ato-core-init init --db=mysql', output: '✓ Configuración de MySQL añadida al proyecto' },
  ];

  runCommands: TerminalCommand[] = [
    { command: 'npm run dev', output: 'Server running on http://localhost:3000' },
    { command: 'npm run build', output: 'Build completed successfully in 3.2s' },
  ];

  registerCommands: TerminalCommand[] = [
    {
      command: 'curl -X POST http://localhost:3000/api/auth/register -H "Content-Type: application/json" -d \'{"name":"John","email":"john@example.com","password":"123456"}\'',
      output: '{"message":"User registered successfully","user":{"id":1,"name":"John","email":"john@example.com"}}',
      outputColor: '#7ee787'
    },
  ];

  loginCommands: TerminalCommand[] = [
    {
      command: 'curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d \'{"email":"john@example.com","password":"123456"}\'',
      output: '{"message":"Login successful","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}',
      outputColor: '#7ee787'
    },
  ];

  profileCommands: TerminalCommand[] = [
    {
      command: 'curl -X GET http://localhost:3000/api/auth/profile -b cookies.txt',
      output: '{"id":1,"name":"John","email":"john@example.com","created_at":"2024-01-15T10:30:00Z"}',
      outputColor: '#7ee787'
    },
  ];

  refreshCommands: TerminalCommand[] = [
    {
      command: 'curl -X POST http://localhost:3000/api/auth/refresh -b cookies.txt',
      output: '{"message":"Token refreshed","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}',
      outputColor: '#7ee787'
    },
  ];

  logoutCommands: TerminalCommand[] = [
    {
      command: 'curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt',
      output: '{"message":"Logout successful"}',
      outputColor: '#7ee787'
    },
  ];

  endpoints = `POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/profile  (protegido)
GET    /api/users         (protegido)
GET    /api/users/:id     (protegido)
PUT    /api/users/:id     (protegido)
DELETE /api/users/:id     (protegido)`;

  libUsageTs = `import { initDatabase } from 'ato-core-init';

await initDatabase('mysql');`;

  libUsageJs = `const { initDatabase } = require('ato-core-init');

(async () => {
  await initDatabase('postgres');
})();`;

  schemaSql = `CREATE TABLE users (
    id INT/SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    secondname VARCHAR(50),
    lastname VARCHAR(50) NOT NULL,
    secondlastname VARCHAR(50),
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  mysqlEnv = `DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=mydb`;

  postgresEnv = `DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=
DB_NAME=mydb
DB_SSL=false`;

  mongoEnv = `MONGO_URI=mongodb://localhost:27017/mydb`;

  cookieConfig = `res.cookie('access_token', token, {
  httpOnly: true,      // No accesible desde JavaScript
  secure: true,        // Solo HTTPS en producción
  sameSite: 'strict',  // Protección CSRF
  maxAge: 15 * 60 * 1000 // 15 minutos
});`;

  jwtMiddleware = `import { jwtMiddleware } from './core/security/jwt_middleware';

// Proteger rutas
router.get('/users', jwtMiddleware, userController.getAll);`;

  hashExample = `import { hashPassword, checkPassword } from './core/security/hash';

const hashedPassword = await hashPassword('123456');
const isValid = await checkPassword(hashedPassword, '123456');`;

  mvcStructure: FileItem[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        { id: 'controllers', name: 'controllers', type: 'folder' },
        { id: 'models', name: 'models', type: 'folder' },
        { id: 'repositories', name: 'repositories', type: 'folder' },
        { id: 'services', name: 'services', type: 'folder' },
        { id: 'routes', name: 'routes', type: 'folder' },
        {
          id: 'core',
          name: 'core',
          type: 'folder',
          children: [
            { id: 'config', name: 'config', type: 'folder' },
            { id: 'security', name: 'security', type: 'folder' },
          ]
        }
      ]
    }
  ];

  hexStructure: FileItem[] = [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'users',
          name: 'users',
          type: 'folder',
          children: [
            {
              id: 'application',
              name: 'application',
              type: 'folder',
              children: [
                { id: 'AuthService.ts', name: 'AuthService.ts', type: 'file' },
                { id: 'CreateUserUseCase.ts', name: 'CreateUserUseCase.ts', type: 'file' },
                { id: 'GetAllUsersUseCase.ts', name: 'GetAllUsersUseCase.ts', type: 'file' },
              ]
            },
            {
              id: 'domain',
              name: 'domain',
              type: 'folder',
              children: [
                { id: 'entities', name: 'entities', type: 'folder' },
                { id: 'dto', name: 'dto', type: 'folder' },
                { id: 'IUserRepository.ts', name: 'IUserRepository.ts', type: 'file' },
              ]
            },
            {
              id: 'infrastructure',
              name: 'infrastructure',
              type: 'folder',
              children: [
                { id: 'adapters', name: 'adapters', type: 'folder' },
                { id: 'controllers', name: 'controllers', type: 'folder' },
                { id: 'routes', name: 'routes', type: 'folder' },
                { id: 'dependencies.ts', name: 'dependencies.ts', type: 'file' },
              ]
            }
          ]
        }
      ]
    }
  ];
}
