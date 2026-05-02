import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CardTecnologyComponent } from '../../core/components/card-tecnology/card-tecnology.component';
import { CardEditorCodeComponent } from '../../core/components/card-editor-code/card-editor-code.component';
import { TecnologiasComponent } from '../../core/components/tecnologias/tecnologias.component';
import { AnimationService } from '../../core/services/animation/animation.service';

@Component({
  selector: 'app-ato-detail',
  standalone: true,
  imports: [CommonModule, CardTecnologyComponent, CardEditorCodeComponent, TecnologiasComponent],
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

  createCommand = `npx ato-core-init create --db=mysql`;

  hexagonalCommand = `npx ato-core-init create --db=postgres --architecture=hexagonal`;

  tsCommand = `npx ato-core-init create --db=mongo --lang=typescript`;

  initCommand = `npx ato-core-init init --db=mysql`;

  createOptions = `# MVC con MySQL y TypeScript
npx ato-core-init create --db=mysql --lang=typescript

# Hexagonal con PostgreSQL
npx ato-core-init create --db=postgres --architecture=hexagonal

# MVC con MongoDB y JavaScript
npx ato-core-init create --db=mongo --lang=javascript`;

  mvcStructure = `src/
├── controllers/      # Controladores HTTP
├── models/          # Interfaces/Tipos
├── repositories/    # Acceso a datos
├── services/        # Lógica de negocio
├── routes/          # Rutas Express
└── core/
    ├── config/      # Conexión DB
    └── security/    # Auth, JWT, Hash`;

  endpoints = `POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/profile  (protegido)
GET    /api/users         (protegido)
GET    /api/users/:id     (protegido)
PUT    /api/users/:id     (protegido)
DELETE /api/users/:id     (protegido)`;

  hexStructure = `src/
└── users/
    ├── application/          # Casos de uso
    │   ├── AuthService.ts
    │   ├── CreateUserUseCase.ts
    │   ├── GetAllUsersUseCase.ts
    │   └── ...
    ├── domain/              # Lógica de negocio
    │   ├── entities/
    │   ├── dto/
    │   ├── utils/
    │   └── IUserRepository.ts
    └── infrastructure/      # Adaptadores externos
        ├── adapters/        # MySQL, PostgreSQL, MongoDB
        ├── controllers/     # HTTP handlers
        ├── routes/
        └── dependencies.ts`;

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

  registerCurl = `curl -X POST http://localhost:3000/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "password": "123456"
  }'`;

  loginCurl = `curl -X POST http://localhost:3000/api/auth/login \\
  -H "Content-Type: application/json" \\
  -c cookies.txt \\
  -d '{
    "email": "john@example.com",
    "password": "123456"
  }'`;

  profileCurl = `curl -X GET http://localhost:3000/api/auth/profile \\
  -b cookies.txt`;

  refreshCurl = `curl -X POST http://localhost:3000/api/auth/refresh \\
  -b cookies.txt`;

  logoutCurl = `curl -X POST http://localhost:3000/api/auth/logout \\
  -b cookies.txt`;

  runDev = `# Desarrollo
npm run dev

# Producción
npm run build
npm start`;

  libUsage = `import { initDatabase } from 'ato-core-init';

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
}
