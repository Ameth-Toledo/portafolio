import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { BuenasPracticasFrontComponent } from './features/buenas-practicas-front/buenas-practicas-front.component';
import { FrameworksCuandoUsarComponent } from './features/frameworks-cuando-usar/frameworks-cuando-usar.component';
import { ArquitecturaHexagonalComponent } from './features/arquitectura-hexagonal/arquitectura-hexagonal.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { DespliegueFrontendAwsComponent } from './features/despliegue-frontend-aws/despliegue-frontend-aws.component';
import { DespliegueFrontendAws2Component } from './features/despliegue-frontend-aws-2/despliegue-frontend-aws-2.component';
import { DespliegueFrontendAws3Component } from './features/despliegue-frontend-aws-3/despliegue-frontend-aws-3.component';
import { DespliegueFrontendAws4Component } from './features/despliegue-frontend-aws-4/despliegue-frontend-aws-4.component';
import { DespliegueFrontendAws5Component } from './features/despliegue-frontend-aws-5/despliegue-frontend-aws-5.component';
import { DespliegueBaseDeDatosAwsComponent } from './features/despliegue-base-de-datos-aws/despliegue-base-de-datos-aws.component';
import { DespliegueBaseDeDatosAws1Component } from './features/despliegue-base-de-datos-aws1/despliegue-base-de-datos-aws1.component';
import { DespliegueBaseDeDatosAws2Component } from './features/despliegue-base-de-datos-aws2/despliegue-base-de-datos-aws2.component';
import { DespliegueBaseDeDatosAws3Component } from './features/despliegue-base-de-datos-aws3/despliegue-base-de-datos-aws3.component';
import { DespliegueBaseDeDatosAws4Component } from './features/despliegue-base-de-datos-aws4/despliegue-base-de-datos-aws4.component';
import { DespliegueBaseDeDatosAws5Component } from './features/despliegue-base-de-datos-aws5/despliegue-base-de-datos-aws5.component';
import { DespliegueBackendAwsComponent } from './features/despliegue-backend-aws/despliegue-backend-aws.component';
import { DespliegueBackendAws1Component } from './features/despliegue-backend-aws1/despliegue-backend-aws1.component';
import { DespliegueBackendAws2Component } from './features/despliegue-backend-aws2/despliegue-backend-aws2.component';
import { DespliegueBackendAws3Component } from './features/despliegue-backend-aws3/despliegue-backend-aws3.component';
import { DespliegueBackendAws4Component } from './features/despliegue-backend-aws4/despliegue-backend-aws4.component';
import { DespliegueBackendAws5Component } from './features/despliegue-backend-aws5/despliegue-backend-aws5.component';
import { DespliegueBackendAws6Component } from './features/despliegue-backend-aws6/despliegue-backend-aws6.component';
import { DespliegueBackendAws7Component } from './features/despliegue-backend-aws7/despliegue-backend-aws7.component';
import { DespliegueBackendAws8Component } from './features/despliegue-backend-aws8/despliegue-backend-aws8.component';
import { DespliegueBaseDeDatosComponent } from './features/despliegue-base-de-datos/despliegue-base-de-datos.component';
import { DespliegueBackendComponent } from './features/despliegue-backend/despliegue-backend.component';
import { DespliegueFrontendComponent } from './features/despliegue-frontend/despliegue-frontend.component';
import { AtoDetailComponent } from './features/ato-detail/ato-detail.component';

export const routes: Routes = [
    { path: '', redirectTo: '', pathMatch: 'full' },
    { path: '', component: HomeComponent, title: 'Ameth Toledo' },

    { path: 'buenas/practicas/de/front', component: BuenasPracticasFrontComponent, title: 'Buenas Prácticas de Frontend | DevDocs' },
    { path: 'cuando/usar/react/y/cuando/angular', component: FrameworksCuandoUsarComponent, title: 'React vs Angular | DevDocs' },
    { path: 'arquitectura/hexagonal', component: ArquitecturaHexagonalComponent, title: 'Arquitectura Hexagonal | DevDocs' },

    { path: 'despliegue/frontend/aws', component: DespliegueFrontendComponent, title: 'Despliegue Frontend en AWS | DevDocs' },
    { path: 'despliegue/front/aws/ec2', component: DespliegueFrontendAwsComponent, title: 'Despliegue Frontend AWS EC2 — Paso 1 | DevDocs' },
    { path: 'despliegue/front/aws/ec2/id=2', component: DespliegueFrontendAws2Component, title: 'Despliegue Frontend AWS EC2 — Paso 2 | DevDocs' },
    { path: 'despliegue/front/aws/ec2/id=3', component: DespliegueFrontendAws3Component, title: 'Despliegue Frontend AWS EC2 — Paso 3 | DevDocs' },
    { path: 'despliegue/front/aws/ec2/id=4', component: DespliegueFrontendAws4Component, title: 'Despliegue Frontend AWS EC2 — Paso 4 | DevDocs' },
    { path: 'despliegue/front/aws/ec2/id=5', component: DespliegueFrontendAws5Component, title: 'Despliegue Frontend AWS EC2 — Paso 5 | DevDocs' },

    { path: 'despliegue/base-de-datos/aws', component: DespliegueBaseDeDatosComponent, title: 'Despliegue Base de Datos en AWS | DevDocs' },
    { path: 'despliegue/bd/aws/ec2', component: DespliegueBaseDeDatosAwsComponent, title: 'Despliegue BD AWS EC2 — Paso 1 | DevDocs' },
    { path: 'despliegue/bd/aws/ec2/id=2', component: DespliegueBaseDeDatosAws1Component, title: 'Despliegue BD AWS EC2 — Paso 2 | DevDocs' },
    { path: 'despliegue/bd/aws/ec2/id=3', component: DespliegueBaseDeDatosAws2Component, title: 'Despliegue BD AWS EC2 — Paso 3 | DevDocs' },
    { path: 'despliegue/bd/aws/ec2/id=4', component: DespliegueBaseDeDatosAws3Component, title: 'Despliegue BD AWS EC2 — Paso 4 | DevDocs' },
    { path: 'despliegue/bd/aws/ec2/id=5', component: DespliegueBaseDeDatosAws4Component, title: 'Despliegue BD AWS EC2 — Paso 5 | DevDocs' },
    { path: 'despliegue/bd/aws/ec2/id=6', component: DespliegueBaseDeDatosAws5Component, title: 'Despliegue BD AWS EC2 — Paso 6 | DevDocs' },

    { path: 'depliegue/backend/aws', component: DespliegueBackendComponent, title: 'Despliegue Backend en AWS | DevDocs' },
    { path: 'despliegue/backend/aws/ec2', component: DespliegueBackendAwsComponent, title: 'Despliegue Backend AWS EC2 — Paso 1 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=2', component: DespliegueBackendAws1Component, title: 'Despliegue Backend AWS EC2 — Paso 2 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=3', component: DespliegueBackendAws2Component, title: 'Despliegue Backend AWS EC2 — Paso 3 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=4', component: DespliegueBackendAws3Component, title: 'Despliegue Backend AWS EC2 — Paso 4 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=5', component: DespliegueBackendAws4Component, title: 'Despliegue Backend AWS EC2 — Paso 5 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=6', component: DespliegueBackendAws5Component, title: 'Despliegue Backend AWS EC2 — Paso 6 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=7', component: DespliegueBackendAws6Component, title: 'Despliegue Backend AWS EC2 — Paso 7 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=8', component: DespliegueBackendAws7Component, title: 'Despliegue Backend AWS EC2 — Paso 8 | DevDocs' },
    { path: 'despliegue/backend/aws/ec2/id=9', component: DespliegueBackendAws8Component, title: 'Despliegue Backend AWS EC2 — Paso 9 | DevDocs' },

    { path: 'ato/detail', component: AtoDetailComponent, title: 'ATO Core Init — CLI para Node.js | DevDocs' },

    { path: '**', component: NotfoundComponent, title: 'Página no encontrada | DevDocs' }
];