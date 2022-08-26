import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InternalLoginComponent } from './internal-login.component';

const routes: Routes = [
  {
    path: '',
    component: InternalLoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InternalLoginRoutingModule { }


