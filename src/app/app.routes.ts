import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuenasPracticasFrontComponent } from './modules/buenas-practicas-front/buenas-practicas-front.component';
import { FrameworksCuandoUsarComponent } from './modules/frameworks-cuando-usar/frameworks-cuando-usar.component';
import { BuenasPracticasUiuxComponent } from './modules/buenas-practicas-uiux/buenas-practicas-uiux.component';
import { ArquitecturaHexagonalComponent } from './modules/arquitectura-hexagonal/arquitectura-hexagonal.component';
import { NotfoundComponent } from './modules/notfound/notfound.component';
import { DespliegueFrontendAwsComponent } from './modules/despliegue-frontend-aws/despliegue-frontend-aws.component';
import { DespliegueFrontendAws2Component } from './modules/despliegue-frontend-aws-2/despliegue-frontend-aws-2.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'buenas/practicas/de/front', component: BuenasPracticasFrontComponent },
    { path: 'cuando/usar/react/y/cuando/angular', component: FrameworksCuandoUsarComponent },
    { path: 'buenas/practicas/ui/ux', component: BuenasPracticasUiuxComponent },
    { path: 'arquitectura/hexagonal', component: ArquitecturaHexagonalComponent },
    { path: 'despliegue/front/aws/ec2', component: DespliegueFrontendAwsComponent },
    { path: 'despliegue/front/aws/ec2/id=2', component: DespliegueFrontendAws2Component },
    { path: '**', component: NotfoundComponent }
];
