import { Routes, Route } from 'react-router-dom'
import Header from './shared/components/Header'
import { ScrollToTop } from './shared/components/ScrollToTop'
import { LenisProvider } from './core/context/LenisContext'
import LandingPage from './features/landing/LandingPage'
import { BlogPostPage } from './features/blog/BlogPostPage'
import { EstructuraCarpetasLesson } from './features/blog/lessons/EstructuraCarpetasLesson'
import { ConvencionesNomenclaturaLesson } from './features/blog/lessons/ConvencionesNomenclaturaLesson'
import { ModularizacionJSLesson } from './features/blog/lessons/ModularizacionJSLesson'
import { OptimizacionAssetsLesson } from './features/blog/lessons/OptimizacionAssetsLesson'
import { ConsumoAPIsFetchLesson } from './features/blog/lessons/ConsumoAPIsFetchLesson'
import { AsyncAwaitLesson } from './features/blog/lessons/AsyncAwaitLesson'
import { PostPutDeleteLesson } from './features/blog/lessons/PostPutDeleteLesson'
import { ErroresLoadingLesson } from './features/blog/lessons/ErroresLoadingLesson'
import { CrearInstanciaEC2Lesson } from './features/blog/lessons/CrearInstanciaEC2Lesson'
import { IPElasticaLesson } from './features/blog/lessons/IPElasticaLesson'
import { ConfigurarPuertosLesson } from './features/blog/lessons/ConfigurarPuertosLesson'
import { InstalarNginxLesson } from './features/blog/lessons/InstalarNginxLesson'
import { ConfigurarNginxLesson } from './features/blog/lessons/ConfigurarNginxLesson'
import { CrearRepositorioLesson } from './features/blog/lessons/CrearRepositorioLesson'
import { JavalinCrearInstanciaLesson } from './features/blog/lessons/javalin/JavalinCrearInstanciaLesson'
import { JavalinCrearRepositorioLesson } from './features/blog/lessons/javalin/JavalinCrearRepositorioLesson'
import { JavalinHabilitarPuertosLesson } from './features/blog/lessons/javalin/JavalinHabilitarPuertosLesson'
import { JavalinInstalarJavaLesson } from './features/blog/lessons/javalin/JavalinInstalarJavaLesson'
import { JavalinInstalarGitLesson } from './features/blog/lessons/javalin/JavalinInstalarGitLesson'
import { JavalinVariablesEntornoLesson } from './features/blog/lessons/javalin/JavalinVariablesEntornoLesson'
import { JavalinGradlewLesson } from './features/blog/lessons/javalin/JavalinGradlewLesson'
import { JavalinIPElasticaLesson } from './features/blog/lessons/javalin/JavalinIPElasticaLesson'
import { JavalinServicioAutomatizadoLesson } from './features/blog/lessons/javalin/JavalinServicioAutomatizadoLesson'
import { MySQLCrearInstanciaLesson } from './features/blog/lessons/mysql/MySQLCrearInstanciaLesson'
import { MySQLInstalarServerLesson } from './features/blog/lessons/mysql/MySQLInstalarServerLesson'
import { MySQLIPElasticaLesson } from './features/blog/lessons/mysql/MySQLIPElasticaLesson'
import { MySQLAccesoRemotoLesson } from './features/blog/lessons/mysql/MySQLAccesoRemotoLesson'
import { MySQLOpcionesSeguridadLesson } from './features/blog/lessons/mysql/MySQLOpcionesSeguridad'
import { MySQLVerificacionLesson } from './features/blog/lessons/mysql/MySQLVerificacionLesson'

function App() {
  return (
    <LenisProvider>
      <Header />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog/:id" element={<BlogPostPage />} />
        <Route path="/blog/arquitectura-frontend-limpia/estructura-carpetas" element={<EstructuraCarpetasLesson />} />
        <Route path="/blog/arquitectura-frontend-limpia/convenciones-nomenclatura" element={<ConvencionesNomenclaturaLesson />} />
        <Route path="/blog/arquitectura-frontend-limpia/modularizacion-js" element={<ModularizacionJSLesson />} />
        <Route path="/blog/arquitectura-frontend-limpia/optimizacion-assets" element={<OptimizacionAssetsLesson />} />
        <Route path="/blog/conexion-frontend-backend/consumo-apis-fetch" element={<ConsumoAPIsFetchLesson />} />
        <Route path="/blog/conexion-frontend-backend/async-await" element={<AsyncAwaitLesson />} />
        <Route path="/blog/conexion-frontend-backend/post-put-delete" element={<PostPutDeleteLesson />} />
        <Route path="/blog/conexion-frontend-backend/errores-loading" element={<ErroresLoadingLesson />} />
        <Route path="/blog/deploy-frontend-nginx-aws/crear-instancia-ec2" element={<CrearInstanciaEC2Lesson />} />
        <Route path="/blog/deploy-frontend-nginx-aws/ip-elastica" element={<IPElasticaLesson />} />
        <Route path="/blog/deploy-frontend-nginx-aws/configurar-puertos" element={<ConfigurarPuertosLesson />} />
        <Route path="/blog/deploy-frontend-nginx-aws/instalar-nginx" element={<InstalarNginxLesson />} />
        <Route path="/blog/deploy-frontend-nginx-aws/configurar-nginx" element={<ConfigurarNginxLesson />} />
        <Route path="/blog/github-proyectos-colaborativos/crear-repositorio" element={<CrearRepositorioLesson />} />
        <Route path="/blog/deploy-api-javalin/crear-instancia-ec2" element={<JavalinCrearInstanciaLesson />} />
        <Route path="/blog/deploy-api-javalin/crear-repositorio-github" element={<JavalinCrearRepositorioLesson />} />
        <Route path="/blog/deploy-api-javalin/habilitar-puertos" element={<JavalinHabilitarPuertosLesson />} />
        <Route path="/blog/deploy-api-javalin/instalar-java" element={<JavalinInstalarJavaLesson />} />
        <Route path="/blog/deploy-api-javalin/instalar-git-clonar" element={<JavalinInstalarGitLesson />} />
        <Route path="/blog/deploy-api-javalin/variables-entorno" element={<JavalinVariablesEntornoLesson />} />
        <Route path="/blog/deploy-api-javalin/gradlew" element={<JavalinGradlewLesson />} />
        <Route path="/blog/deploy-api-javalin/ip-elastica" element={<JavalinIPElasticaLesson />} />
        <Route path="/blog/deploy-api-javalin/servicio-automatizado" element={<JavalinServicioAutomatizadoLesson />} />
        <Route path="/blog/deploy-mysql-aws/crear-instancia-ec2" element={<MySQLCrearInstanciaLesson />} />
        <Route path="/blog/deploy-mysql-aws/instalar-mysql" element={<MySQLInstalarServerLesson />} />
        <Route path="/blog/deploy-mysql-aws/ip-elastica" element={<MySQLIPElasticaLesson />} />
        <Route path="/blog/deploy-mysql-aws/acceso-remoto" element={<MySQLAccesoRemotoLesson />} />
        <Route path="/blog/deploy-mysql-aws/opciones-seguridad" element={<MySQLOpcionesSeguridadLesson />} />
        <Route path="/blog/deploy-mysql-aws/verificacion-mysql" element={<MySQLVerificacionLesson />} />
      </Routes>
    </LenisProvider>
  )
}

export default App
