export type ModuleIcon = 'aws' | 'mysql' | 'nginx' | 'java' | 'react' | 'angular' | 'github' | 'nodejs' | 'typescript' | 'generic' | 'env' | 'gradle' | 'pm2'

export interface BlogModule {
  icon: ModuleIcon
  title: string
  link?: string
}

export interface BlogPost {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  image: string
  readTime: number
  modules: BlogModule[]
}

export const blogPosts: BlogPost[] = [
  {
    id: 'arquitectura-frontend-limpia',
    title: 'Arquitectura Frontend Limpia',
    description:
      'Descubre las mejores prácticas para escribir código frontend limpio, mantenible y escalable. Desde la organización de archivos hasta optimizaciones de rendimiento que marcan la diferencia.',
    category: 'FRONTEND',
    tags: ['#HTML', '#CSS', '#JavaScript'],
    image: 'assets/blog/arquitectura_web_vanilla.png',
    readTime: 5,
    modules: [
      { icon: 'generic', title: 'Estructura de carpetas y separación de responsabilidades', link: '/blog/arquitectura-frontend-limpia/estructura-carpetas' },
      { icon: 'generic', title: 'Convenciones de nomenclatura en HTML y CSS', link: '/blog/arquitectura-frontend-limpia/convenciones-nomenclatura' },
      { icon: 'generic', title: 'Modularización con JavaScript vanilla', link: '/blog/arquitectura-frontend-limpia/modularizacion-js' },
      { icon: 'generic', title: 'Optimización de assets y rendimiento', link: '/blog/arquitectura-frontend-limpia/optimizacion-assets' },
    ],
  },
  {
    id: 'conexion-frontend-backend',
    title: 'Conexión de Frontend con Backend',
    description:
      'Una guía práctica para conectar tu frontend con una API REST. Analizamos fetch, axios, manejo de errores y buenas prácticas para una comunicación robusta entre capas.',
    category: 'FRAMEWORKS',
    tags: ['#React', '#Angular', '#API REST'],
    image: 'assets/blog/conection_api.png',
    readTime: 8,
    modules: [
      { icon: 'generic', title: 'Consumo de APIs con fetch', link: '/blog/conexion-frontend-backend/consumo-apis-fetch' },
      { icon: 'generic', title: 'Peticiones con async/await', link: '/blog/conexion-frontend-backend/async-await' },
      { icon: 'generic', title: 'Enviar datos: POST, PUT y DELETE', link: '/blog/conexion-frontend-backend/post-put-delete' },
      { icon: 'generic', title: 'Manejo de errores y estados de carga', link: '/blog/conexion-frontend-backend/errores-loading' },
    ],
  },
  {
    id: 'deploy-api-javalin',
    title: 'Deploy de API Rest con Javalin',
    description:
      'Guía completa para desplegar APIs REST robustas y escalables usando Javalin y Java. Configuración de servidores, manejo de dependencias y mejores prácticas de deployment.',
    category: 'BACKEND',
    tags: ['#Java', '#Javalin', '#AWS'],
    image: 'assets/blog/deploy_api.png',
    readTime: 8,
    modules: [
      { icon: 'aws',     title: 'Creación de instancia EC2 con IP elástica',          link: '/blog/deploy-api-javalin/crear-instancia-ec2' },
      { icon: 'github',  title: 'Creación de repositorio y subida de archivos a GitHub', link: '/blog/deploy-api-javalin/crear-repositorio-github' },
      { icon: 'aws',     title: 'Habilitación de puertos',                             link: '/blog/deploy-api-javalin/habilitar-puertos' },
      { icon: 'java',    title: 'Instalación de Java',                                 link: '/blog/deploy-api-javalin/instalar-java' },
      { icon: 'github',  title: 'Instalación de git y clonación de proyecto',          link: '/blog/deploy-api-javalin/instalar-git-clonar' },
      { icon: 'env',     title: 'Creación de variables de entorno',                    link: '/blog/deploy-api-javalin/variables-entorno' },
      { icon: 'gradle',  title: 'Construcción de archivo ./gradlew',                   link: '/blog/deploy-api-javalin/gradlew' },
      { icon: 'aws',     title: 'Asociación de IP Elásticas',                          link: '/blog/deploy-api-javalin/ip-elastica' },
      { icon: 'pm2',     title: 'Creación de servicio para ejecución automatizada',    link: '/blog/deploy-api-javalin/servicio-automatizado' },
    ],
  },
  {
    id: 'deploy-frontend-nginx-aws',
    title: 'Deploy Frontend con Nginx en AWS',
    description:
      'Guía práctica sobre el despliegue de aplicaciones web en AWS. Creación de instancias EC2 y cómo publicar tu proyecto y ponerlo en línea de forma simple y eficiente.',
    category: 'SERVIDOR',
    tags: ['#AWS', '#Nginx', '#EC2'],
    image: 'assets/blog/deploy_web.png',
    readTime: 6,
    modules: [
      { icon: 'aws',   title: 'Creación de instancia EC2 con IP elástica',  link: '/blog/deploy-frontend-nginx-aws/crear-instancia-ec2' },
      { icon: 'aws',   title: 'Asociación de IP elástica',                  link: '/blog/deploy-frontend-nginx-aws/ip-elastica' },
      { icon: 'aws',   title: 'Configuración de puertos',                   link: '/blog/deploy-frontend-nginx-aws/configurar-puertos' },
      { icon: 'nginx', title: 'Instalación de Nginx',                       link: '/blog/deploy-frontend-nginx-aws/instalar-nginx' },
      { icon: 'nginx', title: 'Configuración de Nginx para despliegue',     link: '/blog/deploy-frontend-nginx-aws/configurar-nginx' },
    ],
  },
  {
    id: 'github-proyectos-colaborativos',
    title: 'GitHub para Proyectos Colaborativos',
    description:
      'Flujo de trabajo profesional con Git y GitHub para equipos. Ramas, pull requests, code review y estrategias de merge para mantener un repositorio limpio y ordenado.',
    category: 'COLABORACIÓN',
    tags: ['#Git', '#GitHub', '#Teamwork'],
    image: 'assets/blog/trabajo_coolaborativo_github.png',
    readTime: 10,
    modules: [
      { icon: 'github', title: 'Crear y subir proyecto a repositorio',        link: '/blog/github-proyectos-colaborativos/crear-repositorio' },
      { icon: 'github', title: 'Estrategia de ramas: GitFlow y trunk-based' },
      { icon: 'github', title: 'Creación y revisión de Pull Requests' },
      { icon: 'github', title: 'Resolución de conflictos de merge' },
      { icon: 'github', title: 'GitHub Actions: CI básico' },
      { icon: 'github', title: 'Protección de ramas y reglas del repositorio' },
    ],
  },
  {
    id: 'deploy-mysql-aws',
    title: 'Deploy Base de datos MySQL en AWS',
    description:
      'Aprende a desplegar y configurar una base de datos MySQL en una instancia EC2 de AWS. Cubrimos la creación de la base de datos, usuarios, permisos y conexión remota.',
    category: 'BASE DE DATOS',
    tags: ['#MySQL', '#AWS', '#EC2'],
    image: 'assets/blog/deploy_db.png',
    readTime: 8,
    modules: [
      { icon: 'aws',   title: 'Creación de instancia EC2 con IP elástica',  link: '/blog/deploy-mysql-aws/crear-instancia-ec2' },
      { icon: 'mysql', title: 'Actualización e instalación de MySQL Server', link: '/blog/deploy-mysql-aws/instalar-mysql' },
      { icon: 'aws',   title: 'Configuración de IP elástica',                link: '/blog/deploy-mysql-aws/ip-elastica' },
      { icon: 'mysql', title: 'Configuración de MySQL para acceso remoto',   link: '/blog/deploy-mysql-aws/acceso-remoto' },
      { icon: 'mysql', title: 'Configuración de las opciones de seguridad',  link: '/blog/deploy-mysql-aws/opciones-seguridad' },
      { icon: 'mysql', title: 'Verificación de la configuración de MySQL',   link: '/blog/deploy-mysql-aws/verificacion-mysql' },
    ],
  },
]
