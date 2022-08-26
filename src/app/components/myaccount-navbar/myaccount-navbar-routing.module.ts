import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyaccountNavbarComponent } from './myaccount-navbar.component';
const routes: Routes = [
  {
    path: '',
    component: MyaccountNavbarComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyaccountNavbarRoutingModule { }
