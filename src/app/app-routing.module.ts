import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OperatorComponent } from './operator/operator.component';
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component';
import { PreparateurComponent } from './preparateur/preparateur.component';
import { GestionnaireComponent } from './gestionnaire/gestionnaire.component';
import { StickersComponent } from './shared/print/stickers/stickers.component';
import { DefaultComponent } from './modules/default/default.component';
import { QualityComponent } from './quality/quality.component';
import { ToolingComponent } from './tooling/tooling.component';

// const routes: Routes = [
//   { path: 'app-operator', component: OperatorComponent },
//   { path: 'app-login', component: LoginComponent },
//   { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
//   { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
// ];

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'app-operator', component: OperatorComponent },
      { path: 'app-preparateur', component: PreparateurComponent },
      { path: 'app-gestionnaire', component: GestionnaireComponent },
      { path: 'app-quality', component: QualityComponent },
      { path: 'app-tooling', component: ToolingComponent },
    ]
  },

  { path: 'app-login', component: LoginComponent },
  { path: 'app-stickers', component: StickersComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
