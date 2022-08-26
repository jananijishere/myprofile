import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { AuthGuard } from './AuthGuard';

const routes: Routes = [
  {
    path: '', component: AuthComponent, canLoad: [AuthGuard], canActivate: [AuthGuard], canDeactivate: [AuthGuard], resolve: [AuthGuard] 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
