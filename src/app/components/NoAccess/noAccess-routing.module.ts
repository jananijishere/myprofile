import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoAccessComponent } from './noAccess.component';

const routes: Routes = [
  {
    path: '',
    component: NoAccessComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoAccesstRoutingModule { }


