import { WelcomeComponent } from './welcome/welcome.component';
import { PhasesComponent } from './phases/phases.component';
import { CandidatesRegisterComponent } from './candidates-register/candidates-register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'candidates',
    component: CandidatesRegisterComponent
  },
  {
    path: 'phases',
    component: PhasesComponent
  },
  {
    path: '',
    component: WelcomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
