import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuenasPracticasFrontComponent } from './modules/buenas-practicas-front/buenas-practicas-front.component';
import { FrameworksCuandoUsarComponent } from './modules/frameworks-cuando-usar/frameworks-cuando-usar.component';
import { ArquitecturaHexagonalComponent } from './modules/arquitectura-hexagonal/arquitectura-hexagonal.component';
import { NotfoundComponent } from './modules/notfound/notfound.component';
import { DespliegueFrontendAwsComponent } from './modules/despliegue-frontend-aws/despliegue-frontend-aws.component';
import { DespliegueFrontendAws2Component } from './modules/despliegue-frontend-aws-2/despliegue-frontend-aws-2.component';
import { DespliegueFrontendAws3Component } from './modules/despliegue-frontend-aws-3/despliegue-frontend-aws-3.component';
import { DespliegueFrontendAws4Component } from './modules/despliegue-frontend-aws-4/despliegue-frontend-aws-4.component';
import { DespliegueFrontendAws5Component } from './modules/despliegue-frontend-aws-5/despliegue-frontend-aws-5.component';
import { CoursesComponent } from './modules/courses/courses.component';
import { ModulosComponent } from './modules/modulos/modulos.component';
import { ModuleDetailComponent } from './modules/module-detail/module-detail.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { UserGuard } from './guards/auth.guard';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ComentariosComponent } from './modules/comentarios/comentarios.component';
import { CursosDashboardComponent } from './modules/cursos-dashboard/cursos-dashboard.component';
import { ModulesDashboardComponent } from './modules/modules-dashboard/modules-dashboard.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'buenas/practicas/de/front', component: BuenasPracticasFrontComponent },
    { path: 'cuando/usar/react/y/cuando/angular', component: FrameworksCuandoUsarComponent },
    { path: 'arquitectura/hexagonal', component: ArquitecturaHexagonalComponent },
    { path: 'despliegue/front/aws/ec2', component: DespliegueFrontendAwsComponent },
    { path: 'despliegue/front/aws/ec2/id=2', component: DespliegueFrontendAws2Component },
    { path: 'despliegue/front/aws/ec2/id=3', component: DespliegueFrontendAws3Component },
    { path: 'despliegue/front/aws/ec2/id=4', component: DespliegueFrontendAws4Component },
    { path: 'despliegue/front/aws/ec2/id=5', component: DespliegueFrontendAws5Component },
    { path: 'blog', component: CoursesComponent },
    { path: 'modulos', component: ModulosComponent, canActivate: [UserGuard] },
    { path: 'modulo/detail', component: ModuleDetailComponent, canActivate: [UserGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'dashboard', component: DashboardComponent, children: [
        { path: 'comentarios', component: ComentariosComponent },
        { path: 'cursos', component: CursosDashboardComponent },
        { path: 'modules', component: ModulesDashboardComponent }
    ] },
    { path: '**', component: NotfoundComponent }
];
