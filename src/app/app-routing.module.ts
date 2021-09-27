import { PagesModule } from './pages/pages.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'pages',
    loadChildren: () => import(`./pages/pages-routing.module`).then(m => m.PagesRoutingModule),
  },

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pages'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
