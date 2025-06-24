import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuenasPracticasFrontComponent } from './modules/buenas-practicas-front/buenas-practicas-front.component';
import { FrameworksCuandoUsarComponent } from './modules/frameworks-cuando-usar/frameworks-cuando-usar.component';
import { BuenasPracticasUiuxComponent } from './modules/buenas-practicas-uiux/buenas-practicas-uiux.component';
import { ArquitecturaHexagonalComponent } from './modules/arquitectura-hexagonal/arquitectura-hexagonal.component';
import { NotfoundComponent } from './modules/notfound/notfound.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'buenas/practicas/de/front', component: BuenasPracticasFrontComponent },
    { path: 'cuando/usar/react/y/cuando/angular', component: FrameworksCuandoUsarComponent },
    { path: 'buenas/practicas/ui/ux', component: BuenasPracticasUiuxComponent },
    { path: 'arquitectura/hexagonal', component: ArquitecturaHexagonalComponent },
    { path: '**', component: NotfoundComponent }
];
