import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { PagesRoutingModule } from './pages-routing.module';
import { CandidatesRegisterComponent } from './candidates-register/candidates-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PhasesComponent } from './phases/phases.component';
import { WelcomeComponent } from './welcome/welcome.component';


@NgModule({
  declarations: [CandidatesRegisterComponent, PhasesComponent, WelcomeComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    AgGridModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PagesModule { }
