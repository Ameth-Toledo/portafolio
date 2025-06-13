import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { BuenasPracticasFrontComponent } from './modules/buenas-practicas-front/buenas-practicas-front.component';
import { FrameworksCuandoUsarComponent } from './modules/frameworks-cuando-usar/frameworks-cuando-usar.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: HomeComponent },
    { path: 'buenas/practicas/de/front', component: BuenasPracticasFrontComponent },
    { path: 'cuando/usar/react/y/cuando/angular', component: FrameworksCuandoUsarComponent }
];
